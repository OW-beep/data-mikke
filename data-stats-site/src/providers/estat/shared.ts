import { DataPoint } from "@/types/data";
import { PREFECTURES } from "@/lib/prefectures";

/**
 * e-Stat API（getStatsData）を呼び出して素のJSONを取得する共通関数。
 * 複数のProvider（人口・出生率など）から使い回す。
 */
export async function callGetStatsData(appId: string, statsDataId: string): Promise<any> {
  const url = new URL("https://api.e-stat.go.jp/rest/3.0/app/json/getStatsData");
  url.searchParams.set("appId", appId);
  url.searchParams.set("statsDataId", statsDataId);
  url.searchParams.set("metaGetFlg", "Y"); // CLASS_OBJ（地域名・分類マスタ）を一緒に取得する
  url.searchParams.set("cntGetFlg", "N");

  const res = await fetch(url.toString(), { next: { revalidate: 60 * 60 * 24 } });
  if (!res.ok) {
    throw new Error(`e-Stat API error: ${res.status} ${res.statusText}`);
  }
  const json = await res.json();

  const result = json?.GET_STATS_DATA?.RESULT;
  if (result && String(result.STATUS) !== "0") {
    throw new Error(`e-Stat API returned STATUS=${result.STATUS}: ${result.ERROR_MSG}`);
  }
  return json;
}

/**
 * CLASS_OBJ（メタ情報）から「あるクラスIDのコード → 名前」のマップを作る。
 * e-Statのコードは表によって桁数が異なる（例: "13000" や "13"）ため、
 * 生の名前で都道府県マスタと突き合わせるほうが確実。
 */
export function buildClassNameMap(json: any, classId: string): Map<string, string> {
  const classObjRaw = json?.GET_STATS_DATA?.STATISTICAL_DATA?.CLASS_INF?.CLASS_OBJ;
  const classObjList: any[] = Array.isArray(classObjRaw) ? classObjRaw : classObjRaw ? [classObjRaw] : [];
  const targetClass = classObjList.find((c) => c["@id"] === classId);

  const map = new Map<string, string>();
  const classesRaw = targetClass?.CLASS;
  const classes: any[] = Array.isArray(classesRaw) ? classesRaw : classesRaw ? [classesRaw] : [];
  for (const c of classes) {
    if (c?.["@code"] && c?.["@name"]) {
      map.set(String(c["@code"]), String(c["@name"]));
    }
  }
  return map;
}

/**
 * area・time以外の分類（男女別、総人口/日本人人口など）について、
 * 「総数（全体）」を表すコードだけを集めておく。
 * 該当する分類軸ごとに { "@クラスid": "総数のコード" } を返す。
 * これが無いと、内訳がある表では複数カテゴリの値まで合算・重複されてしまう。
 *
 * "総数"に一致する名前が見つからない分類軸は、classes[0]（先頭の選択肢）を採用する。
 * e-Statの表は多くの場合、先頭に「総数」相当の代表値を置く慣習があるため。
 */
export function buildTotalFilters(json: any, areaClassId: string): Record<string, string> {
  const classObjRaw = json?.GET_STATS_DATA?.STATISTICAL_DATA?.CLASS_INF?.CLASS_OBJ;
  const classObjList: any[] = Array.isArray(classObjRaw) ? classObjRaw : classObjRaw ? [classObjRaw] : [];

  const filters: Record<string, string> = {};
  for (const classObj of classObjList) {
    const id = classObj?.["@id"];
    if (!id || id === areaClassId || id === "time") continue;

    const classesRaw = classObj?.CLASS;
    const classes: any[] = Array.isArray(classesRaw) ? classesRaw : classesRaw ? [classesRaw] : [];
    // 選択肢が1つしか無い分類（＝実質フィルタ不要）はスキップ
    if (classes.length <= 1) continue;

    const totalClass =
      classes.find((c) => ["総数", "計", "合計"].includes(String(c?.["@name"]))) ?? classes[0];
    if (totalClass) {
      filters[id] = String(totalClass["@code"]);
    }
  }
  return filters;
}

/**
 * e-StatのレスポンスJSON構造を共通DataPoint形式に変換する。
 * 都道府県名で照合するため、地域コードの桁数の違い（"13" / "13000" 等）に影響されない。
 */
export function transformEstatResponse(
  json: any,
  dataset: string,
  areaNameByCode: Map<string, string>,
  totalFilters: Record<string, string>
): DataPoint[] {
  const valuesRaw = json?.GET_STATS_DATA?.STATISTICAL_DATA?.DATA_INF?.VALUE;
  const values: any[] = Array.isArray(valuesRaw) ? valuesRaw : valuesRaw ? [valuesRaw] : [];

  return values
    .map((v): DataPoint | null => {
      for (const [classId, totalCode] of Object.entries(totalFilters)) {
        const attrKey = `@${classId}`;
        if (attrKey in v && String(v[attrKey]) !== totalCode) return null;
      }

      const areaCode = String(v["@area"] ?? "");
      const areaName = areaNameByCode.get(areaCode);
      if (!areaName) return null;

      const pref = PREFECTURES.find((p) => p.name === areaName || areaName.includes(p.name));
      if (!pref) return null; // 「全国」など都道府県以外の行は除外

      const year = Number(String(v["@time"] ?? "").slice(0, 4));
      const value = Number(v["$"]);
      if (!year || Number.isNaN(value)) return null;

      return { dataset, areaCode: pref.code, areaName: pref.name, year, value };
    })
    .filter((v): v is DataPoint => v !== null);
}

/** area・time以外の分類軸のうち、2値以上あるものの一覧をログ用に要約する（デバッグ支援） */
export function summarizeClassifications(json: any, areaClassId: string): string {
  const classObjRaw = json?.GET_STATS_DATA?.STATISTICAL_DATA?.CLASS_INF?.CLASS_OBJ;
  const classObjList: any[] = Array.isArray(classObjRaw) ? classObjRaw : classObjRaw ? [classObjRaw] : [];
  return classObjList
    .filter((c) => c?.["@id"] && c["@id"] !== areaClassId)
    .map((c) => {
      const classesRaw = c?.CLASS;
      const classes: any[] = Array.isArray(classesRaw) ? classesRaw : classesRaw ? [classesRaw] : [];
      return `${c["@id"]}(${classes.length}件)`;
    })
    .join(", ");
}
