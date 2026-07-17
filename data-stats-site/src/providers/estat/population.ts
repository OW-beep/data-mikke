import { Provider } from "@/providers/types";
import { DataPoint } from "@/types/data";
import { PREFECTURES } from "@/lib/prefectures";

/**
 * e-Stat API（政府統計の総合窓口）から人口統計を取得するProvider。
 * 実運用では .env.local に ESTAT_APP_ID を設定して使う。
 * https://www.e-stat.go.jp/api/
 *
 * APIキーが無い環境（このリポジトリのデモ実行時など）ではモックデータを返す。
 * → Provider内部の話なので、画面側やdatasets定義には一切影響しない。
 */
export const estatPopulationProvider: Provider = {
  id: "estat-population",
  datasetId: "population",

  async fetch(): Promise<DataPoint[]> {
    const appId = process.env.ESTAT_APP_ID;

    if (!appId) {
      console.warn(
        "[estat/population] ESTAT_APP_ID 未設定のためモックデータを使用します"
      );
      return mockPopulation();
    }

    // 実際のe-Stat統計表ID（人口推計）は用途に合わせて差し替える
    const statsDataId = "0000010101"; // 例: 人口推計 年報
    const url = new URL("https://api.e-stat.go.jp/rest/3.0/app/json/getStatsData");
    url.searchParams.set("appId", appId);
    url.searchParams.set("statsDataId", statsDataId);

    const res = await fetch(url.toString());
    if (!res.ok) {
      throw new Error(`e-Stat API error: ${res.status} ${res.statusText}`);
    }
    const json = await res.json();

    return transformEstatResponse(json);
  }
};

/**
 * e-StatのレスポンスJSON構造を共通DataPoint形式に変換する。
 * e-Statのレスポンス構造は統計表ごとに異なるため、実際は対象の統計表の
 * VALUE配列・CLASS_OBJ（地域コード等）を見ながら実装する必要がある。
 * ここでは骨組みのみ示す。
 */
function transformEstatResponse(json: any): DataPoint[] {
  const values: any[] =
    json?.GET_STATS_DATA?.STATISTICAL_DATA?.DATA_INF?.VALUE ?? [];

  return values
    .map((v): DataPoint | null => {
      const areaCode = String(v["@area"] ?? "").padStart(2, "0");
      const pref = PREFECTURES.find((p) => p.code === areaCode);
      if (!pref) return null;

      return {
        dataset: "population",
        areaCode: pref.code,
        areaName: pref.name,
        year: Number(v["@time"]?.slice(0, 4) ?? 0),
        value: Number(v["$"] ?? 0)
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
