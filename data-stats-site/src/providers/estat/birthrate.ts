import { Provider } from "@/providers/types";
import { DataPoint } from "@/types/data";
import { PREFECTURES } from "@/lib/prefectures";
import { callGetStatsData, buildClassNameMap, buildTotalFilters, transformEstatResponse, summarizeClassifications } from "./shared";

/**
 * e-Stat API から「都道府県別 合計特殊出生率」を取得するProvider。
 * 出典: 厚生労働省「人口動態統計」（人口動態調査 上巻 4-5 都道府県別にみた年次別合計特殊出生率）
 *
 * .env / Vercelの環境変数:
 *   ESTAT_APP_ID=（人口と共通）
 *   ESTAT_STATS_ID_BIRTHRATE=使いたい統計表のstatsDataId（任意。未設定なら下記デフォルトを使用）
 *
 * デフォルトのstatsDataId "0003411598" は上記の統計表を指す。
 */
export const estatBirthrateProvider: Provider = {
  id: "estat-birthrate",
  datasetId: "birthrate",

  async fetch(): Promise<DataPoint[]> {
    const appId = process.env.ESTAT_APP_ID;

    if (!appId) {
      console.warn("[estat/birthrate] ESTAT_APP_ID 未設定のためモックデータを使用します");
      return mockBirthrate();
    }

    try {
      const points = await fetchFromEstat(appId);
      if (points.length === 0) {
        console.warn(
          "[estat/birthrate] e-Statから0件しか取得できなかったためモックデータにフォールバックします"
        );
        return mockBirthrate();
      }
      return points;
    } catch (err) {
      console.error(
        "[estat/birthrate] e-Stat APIの取得に失敗したためモックデータにフォールバックします:",
        err
      );
      return mockBirthrate();
    }
  }
};

async function fetchFromEstat(appId: string): Promise<DataPoint[]> {
  const statsDataId = process.env.ESTAT_STATS_ID_BIRTHRATE ?? "0003411598";
  const areaClassId = process.env.ESTAT_AREA_CLASS_ID ?? "area";

  const json = await callGetStatsData(appId, statsDataId);

  const areaNameByCode = buildClassNameMap(json, areaClassId);
  const totalFilters = buildTotalFilters(json, areaClassId);
  const points = transformEstatResponse(json, "birthrate", areaNameByCode, totalFilters);

  const years = Array.from(new Set(points.map((p) => p.year))).sort();
  console.log(
    `[estat/birthrate] statsDataId=${statsDataId} 取得件数=${points.length} 年=[${years.join(",")}] 分類軸=${summarizeClassifications(json, areaClassId)}`
  );

  return points;
}

function mockBirthrate(): DataPoint[] {
  const base: Record<string, number> = {
    "13": 1.04, // 東京都
    "47": 1.6, // 沖縄県
    "01": 1.12 // 北海道
  };
  const years = [2020, 2021, 2022, 2023, 2024];

  return PREFECTURES.flatMap((pref) => {
    const value = base[pref.code] ?? 1.2 + (Number(pref.code) % 10) * 0.03;
    return years.map((year, i) => ({
      dataset: "birthrate",
      areaCode: pref.code,
      areaName: pref.name,
      year,
      value: Number((value - 0.01 * (years.length - 1 - i)).toFixed(2))
    }));
  });
}
