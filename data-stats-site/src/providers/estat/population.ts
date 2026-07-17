import { Provider } from "@/providers/types";
import { DataPoint } from "@/types/data";
import { PREFECTURES } from "@/lib/prefectures";

/**
 * e-Stat API（政府統計の総合窓口）から人口統計を取得するProvider。
 * https://www.e-stat.go.jp/api/
 *
 * 【本番運用の設定】
 * .env.local（またはVercelの環境変数）に以下を設定する:
 *   ESTAT_APP_ID=取得したアプリケーションID
 *   ESTAT_STATS_ID_POPULATION=使いたい統計表のstatsDataId（任意。未設定ならデフォルト値を使用）
 *
 * statsDataIdの探し方:
 *   1. https://www.e-stat.go.jp/ で「人口推計」など目的の統計を検索
 *   2. 都道府県別に集計された表を開く
 *   3. URLまたは「API」タブに表示される statsDataId をコピーして環境変数に設定
 *
 * APIキーが無い環境（ローカルの初回セットアップ時など）や、API呼び出しに失敗した場合は
 * モックデータにフォールバックする（ビルドやローカル開発が止まらないようにするため）。
 */
export const estatPopulationProvider: Provider = {
  id: "estat-population",
  datasetId: "population",

  async fetch(): Promise<DataPoint[]> {
    const appId = process.env.ESTAT_APP_ID;

    if (!appId) {
      console.warn("[estat/population] ESTAT_APP_ID 未設定のためモックデータを使用します");
      return mockPopulation();
    }

    try {
      return await fetchFromEstat(appId);
    } catch (err) {
      console.error(
        "[estat/population] e-Stat APIの取得に失敗したためモックデータにフォールバックします:",
        err
      );
      return mockPopulation();
    }
  }
};

async function fetchFromEstat(appId: string): Promise<DataPoint[]> {
  // 統計表ID: 環境変数で上書き可能。未設定時のデフォルトは「人口推計」の代表的な表を想定しているが、
  // 実際に使う表に合わせて必ずVercelの環境変数で正しいIDに差し替えること。
  const statsDataId = process.env.ESTAT_STATS_ID_POPULATION ?? "0000010101";
  // 地域の分類コードのid。多くの表では "area" だが、表によって異なる場合があるので上書き可能にしておく
  const areaClassId = process.env.ESTAT_AREA_CLASS_ID ?? "area";

  const url = new URL("https://api.e-stat.go.jp/rest/3.0/app/json/getStatsData");
  url.searchParams.set("appId", appId);
  url.searchParams.set("statsDataId", statsDataId);
  url.searchParams.set("metaGetFlg", "Y"); // CLASS_OBJ（地域名マスタ）を一緒に取得する
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

  const areaNameByCode = buildAreaNameMap(json, areaClassId);
  return transformEstatResponse(json, areaNameByCode);
}

/**
 * CLASS_OBJ（メタ情報）から「地域コード → 地域名」のマップを作る。
 * e-Statの地域コードは表によって桁数が異なる（例: "13000" や "13"）ため、
 * 生の名前で都道府県マスタと突き合わせるほうが確実。
 */
function buildAreaNameMap(json: any, areaClassId: string): Map<string, string> {
  const classObjRaw = json?.GET_STATS_DATA?.STATISTICAL_DATA?.CLASS_INF?.CLASS_OBJ;
  const classObjList: any[] = Array.isArray(classObjRaw) ? classObjRaw : classObjRaw ? [classObjRaw] : [];
  const areaClass = classObjList.find((c) => c["@id"] === areaClassId);

  const map = new Map<string, string>();
  const classesRaw = areaClass?.CLASS;
  const classes: any[] = Array.isArray(classesRaw) ? classesRaw : classesRaw ? [classesRaw] : [];
  for (const c of classes) {
    if (c?.["@code"] && c?.["@name"]) {
      map.set(String(c["@code"]), String(c["@name"]));
    }
  }
  return map;
}

/**
 * e-StatのレスポンスJSON構造を共通DataPoint形式に変換する。
 * 都道府県名で照合するため、地域コードの桁数の違い（"13" / "13000" 等）に影響されない。
 */
function transformEstatResponse(json: any, areaNameByCode: Map<string, string>): DataPoint[] {
  const valuesRaw = json?.GET_STATS_DATA?.STATISTICAL_DATA?.DATA_INF?.VALUE;
  const values: any[] = Array.isArray(valuesRaw) ? valuesRaw : valuesRaw ? [valuesRaw] : [];

  return values
    .map((v): DataPoint | null => {
      const areaCode = String(v["@area"] ?? "");
      const areaName = areaNameByCode.get(areaCode);
      if (!areaName) return null;

      const pref = PREFECTURES.find((p) => p.name === areaName || areaName.includes(p.name));
      if (!pref) return null; // 「全国」など都道府県以外の行は除外

      const year = Number(String(v["@time"] ?? "").slice(0, 4));
      const value = Number(v["$"]);
      if (!year || Number.isNaN(value)) return null;

      return {
        dataset: "population",
        areaCode: pref.code,
        areaName: pref.name,
        year,
        value
      };
    })
    .filter((v): v is DataPoint => v !== null);
}

function mockPopulation(): DataPoint[] {
  // 都道府県ごとにそれっぽい人口規模のダミー値を生成（デモ・開発用）
  const base: Record<string, number> = {
    "13": 14059237, // 東京都
    "27": 8778035, // 大阪府
    "14": 9237337, // 神奈川県
    "23": 7495535, // 愛知県
    "01": 5140046 // 北海道
  };

  return PREFECTURES.flatMap((pref) => {
    const value = base[pref.code] ?? 500000 + Number(pref.code) * 37000;
    return [2023, 2024, 2025].map((year, i) => ({
      dataset: "population",
      areaCode: pref.code,
      areaName: pref.name,
      year,
      value: Math.round(value * (1 - 0.003 * (2 - i)))
    }));
  });
}
