import { Provider } from "@/providers/types";
import { DataPoint } from "@/types/data";
import { PREFECTURES } from "@/lib/prefectures";
import { callGetStatsData, buildClassNameMap, transformEstatResponse, summarizeClassifications, getEstatAppId } from "./shared";

/**
 * e-Stat API から「都道府県別 コンビニエンスストア店舗数」を取得するProvider。
 * 出典: 経済産業省「商業動態統計調査 確報」表1
 *   （コンビニエンスストア販売 都道府県別販売額等及び前年比増減率）
 * https://www.e-stat.go.jp/dbview?sid=0003395254
 *
 * この表は1つの表に「販売額」「販売額（前年比増減率）」「店舗数」「店舗数（前年比増減率）」の
 * 4指標が同居しているため、通常のbuildTotalFilters（「総数」相当を選ぶ）ではなく、
 * 「店舗数」という項目名を明示的に指定するフィルタを使う。
 *
 * .env / Vercelの環境変数:
 *   ESTAT_APP_ID=（他の統計と共通）
 *   ESTAT_STATS_ID_CONVENIENCE=使いたい統計表のstatsDataId（任意。未設定なら下記デフォルトを使用）
 *
 * デフォルトのstatsDataId "0003395254" は上記の統計表を指す。
 * 表の時間軸が古い場合（現状2019年までを確認）、e-Statで最新の年次に対応する
 * statsDataIdを探し、ESTAT_STATS_ID_CONVENIENCEで上書きすることを推奨。
 */
export const estatConvenienceProvider: Provider = {
  id: "estat-convenience",
  datasetId: "convenience",

  async fetch(): Promise<DataPoint[]> {
    const appId = getEstatAppId();

    if (!appId) {
      console.warn("[estat/convenience] ESTAT_APP_ID 未設定のためモックデータを使用します");
      return mockConvenience();
    }

    try {
      const points = await fetchFromEstat(appId);
      if (points.length === 0) {
        console.warn(
          "[estat/convenience] e-Statから0件しか取得できなかったためモックデータにフォールバックします"
        );
        return mockConvenience();
      }
      return points;
    } catch (err) {
      console.error(
        "[estat/convenience] e-Stat APIの取得に失敗したためモックデータにフォールバックします:",
        err
      );
      return mockConvenience();
    }
  }
};

async function fetchFromEstat(appId: string): Promise<DataPoint[]> {
  const statsDataId = process.env.ESTAT_STATS_ID_CONVENIENCE ?? "0003395254";
  const areaClassId = process.env.ESTAT_AREA_CLASS_ID ?? "area";

  const json = await callGetStatsData(appId, statsDataId);

  const areaNameByCode = buildClassNameMap(json, areaClassId);
  const filters = buildFiltersPreferringName(json, areaClassId, "店舗数");
  const points = transformEstatResponse(json, "convenience", areaNameByCode, filters);

  // 「店舗数」以外の指標（販売額など）が誤って混入していないか、年ごとの件数で簡易チェックする
  const years = Array.from(new Set(points.map((p) => p.year))).sort();
  console.log(
    `[estat/convenience] statsDataId=${statsDataId} 取得件数=${points.length} 年=[${years.join(",")}] 分類軸=${summarizeClassifications(json, areaClassId)}`
  );

  return points;
}

/**
 * area・time以外の分類軸について、選択肢の中に指定した名前（例:「店舗数」）が
 * 完全一致するものがあれば、そのコードをフィルタとして採用する。
 * 見つからない軸は、buildTotalFilters相当（「総数」等 → 無ければ先頭）にフォールバックする。
 */
function buildFiltersPreferringName(json: any, areaClassId: string, preferredName: string): Record<string, string> {
  const classObjRaw = json?.GET_STATS_DATA?.STATISTICAL_DATA?.CLASS_INF?.CLASS_OBJ;
  const classObjList: any[] = Array.isArray(classObjRaw) ? classObjRaw : classObjRaw ? [classObjRaw] : [];

  const filters: Record<string, string> = {};
  for (const classObj of classObjList) {
    const id = classObj?.["@id"];
    if (!id || id === areaClassId || id === "time") continue;

    const classesRaw = classObj?.CLASS;
    const classes: any[] = Array.isArray(classesRaw) ? classesRaw : classesRaw ? [classesRaw] : [];
    if (classes.length <= 1) continue;

    const preferred = classes.find((c) => String(c?.["@name"]) === preferredName);
    const fallback = classes.find((c) => ["総数", "計", "合計"].includes(String(c?.["@name"]))) ?? classes[0];
    const chosen = preferred ?? fallback;
    if (chosen) {
      filters[id] = String(chosen["@code"]);
    }
  }
  return filters;
}

function mockConvenience(): DataPoint[] {
  // 実データ未取得時のフォールバック。2025年度・商業動態統計調査の公表値を一部参考にしているが、
  // 全都道府県を厳密に裏取りしたものではないため、あくまでプレースホルダーとして扱うこと。
  const base: Record<string, number> = {
    "13": 7233, // 東京都
    "27": 3908, // 大阪府
    "14": 3695, // 神奈川県
    "31": 258, // 鳥取県
    "32": 270 // 島根県
  };
  return PREFECTURES.map((pref) => ({
    dataset: "convenience",
    areaCode: pref.code,
    areaName: pref.name,
    year: 2025,
    value: base[pref.code] ?? 800 + (Number(pref.code) % 20) * 40
  }));
}
