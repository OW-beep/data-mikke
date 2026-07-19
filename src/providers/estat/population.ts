import { Provider } from "@/providers/types";
import { DataPoint } from "@/types/data";
import { PREFECTURES } from "@/lib/prefectures";
import {
  callGetStatsData,
  buildClassNameMap,
  buildTotalFilters,
  transformEstatResponse,
  summarizeClassifications
} from "./shared";

/**
 * e-Stat API（政府統計の総合窓口）から人口統計を取得するProvider。
 * https://www.e-stat.go.jp/api/
 *
 * 【本番運用の設定】
 * Vercelの環境変数に以下を設定する（APIキーはコードやチャットに直接貼らず、必ず環境変数で渡すこと）:
 *   ESTAT_APP_ID=取得したアプリケーションID
 *   ESTAT_STATS_ID_POPULATION=使いたい統計表のstatsDataId（任意。未設定なら下記デフォルトを使用）
 *
 * デフォルトのstatsDataId "0003448231" は、
 * 「人口推計 各年10月1日現在人口 令和2年国勢調査基準 統計表004
 *   都道府県，男女別人口及び人口性比－総人口，日本人人口」（総務省統計局）を指す。
 *
 * うまく複数年のグラフが出ない場合は、Vercelのデプロイログで
 * "[estat/population]" から始まる行を確認すること（取得件数・年数・分類軸の内訳を出力している）。
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
      const points = await fetchFromEstat(appId);
      if (points.length === 0) {
        console.warn(
          "[estat/population] e-Statから0件しか取得できなかったためモックデータにフォールバックします（statsDataIdやareaClassIdの設定を確認してください）"
        );
        return mockPopulation();
      }
      return points;
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
  const statsDataId = process.env.ESTAT_STATS_ID_POPULATION ?? "0003448231";
  const areaClassId = process.env.ESTAT_AREA_CLASS_ID ?? "area";

  const json = await callGetStatsData(appId, statsDataId);

  const areaNameByCode = buildClassNameMap(json, areaClassId);
  const totalFilters = buildTotalFilters(json, areaClassId);
  const points = transformEstatResponse(json, "population", areaNameByCode, totalFilters);

  const years = Array.from(new Set(points.map((p) => p.year))).sort();
  console.log(
    `[estat/population] statsDataId=${statsDataId} 取得件数=${points.length} 年=[${years.join(",")}] 分類軸=${summarizeClassifications(json, areaClassId)}`
  );

  return points;
}

function mockPopulation(): DataPoint[] {
  // 都道府県ごとにそれっぽい人口規模のダミー値を、複数年分生成（デモ・開発用）
  const base: Record<string, number> = {
    "13": 14059237, // 東京都
    "27": 8778035, // 大阪府
    "14": 9237337, // 神奈川県
    "23": 7495535, // 愛知県
    "01": 5140046 // 北海道
  };

  const years = [2020, 2021, 2022, 2023, 2024];

  return PREFECTURES.flatMap((pref) => {
    const value = base[pref.code] ?? 500000 + Number(pref.code) * 37000;
    return years.map((year, i) => ({
      dataset: "population",
      areaCode: pref.code,
      areaName: pref.name,
      year,
      value: Math.round(value * (1 - 0.004 * (years.length - 1 - i)))
    }));
  });
}
