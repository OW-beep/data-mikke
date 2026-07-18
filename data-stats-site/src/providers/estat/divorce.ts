import { Provider } from "@/providers/types";
import { DataPoint } from "@/types/data";
import { PREFECTURES } from "@/lib/prefectures";
import { callGetStatsData, buildClassNameMap, buildTotalFilters, transformEstatResponse, summarizeClassifications } from "./shared";

/**
 * e-Stat API から「都道府県別 離婚率（人口千対）」を取得するProvider。
 * 出典: 厚生労働省「人口動態統計」（人口動態調査 上巻 10-1 都道府県別にみた年次別離婚件数・離婚率）
 *
 * .env / Vercelの環境変数:
 *   ESTAT_APP_ID=（人口・出生率と共通）
 *   ESTAT_STATS_ID_DIVORCE=使いたい統計表のstatsDataId（任意。未設定なら下記デフォルトを使用）
 *
 * デフォルトのstatsDataId "0003411861" は上記の統計表を指す。
 */
export const estatDivorceProvider: Provider = {
  id: "estat-divorce",
  datasetId: "divorce",

  async fetch(): Promise<DataPoint[]> {
    const appId = process.env.ESTAT_APP_ID;

    if (!appId) {
      console.warn("[estat/divorce] ESTAT_APP_ID 未設定のためモックデータを使用します");
      return mockDivorce();
    }

    try {
      const points = await fetchFromEstat(appId);
      if (points.length === 0) {
        console.warn(
          "[estat/divorce] e-Statから0件しか取得できなかったためモックデータにフォールバックします"
        );
        return mockDivorce();
      }
      return points;
    } catch (err) {
      console.error(
        "[estat/divorce] e-Stat APIの取得に失敗したためモックデータにフォールバックします:",
        err
      );
      return mockDivorce();
    }
  }
};

async function fetchFromEstat(appId: string): Promise<DataPoint[]> {
  const statsDataId = process.env.ESTAT_STATS_ID_DIVORCE ?? "0003411861";
  const areaClassId = process.env.ESTAT_AREA_CLASS_ID ?? "area";

  const json = await callGetStatsData(appId, statsDataId);

  const areaNameByCode = buildClassNameMap(json, areaClassId);
  const totalFilters = buildTotalFilters(json, areaClassId);
  const points = transformEstatResponse(json, "divorce", areaNameByCode, totalFilters);

  const years = Array.from(new Set(points.map((p) => p.year))).sort();
  console.log(
    `[estat/divorce] statsDataId=${statsDataId} 取得件数=${points.length} 年=[${years.join(",")}] 分類軸=${summarizeClassifications(json, areaClassId)}`
  );

  return points;
}

function mockDivorce(): DataPoint[] {
  const base: Record<string, number> = {
    "13": 1.85, // 東京都
    "47": 2.4, // 沖縄県（全国的に高い傾向）
    "18": 1.35 // 福井県（全国的に低い傾向）
  };
  const years = [2020, 2021, 2022, 2023, 2024];

  return PREFECTURES.flatMap((pref) => {
    const value = base[pref.code] ?? 1.6 + (Number(pref.code) % 8) * 0.05;
    return years.map((year, i) => ({
      dataset: "divorce",
      areaCode: pref.code,
      areaName: pref.name,
      year,
      value: Number((value - 0.01 * (years.length - 1 - i)).toFixed(2))
    }));
  });
}
