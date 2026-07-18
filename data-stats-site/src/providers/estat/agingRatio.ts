import { Provider } from "@/providers/types";
import { DataPoint } from "@/types/data";
import { PREFECTURES } from "@/lib/prefectures";
import { callGetStatsData, buildClassNameMap, buildTotalFilters, transformEstatResponse, summarizeClassifications } from "./shared";

/**
 * e-Stat API から「都道府県別 高齢化率（65歳以上人口 ÷ 総人口 × 100）」を取得するProvider。
 * 出典: 総務省統計局「人口推計」（都道府県，年齢（3区分），男女別人口）
 *
 * childrenRatio（年少人口割合）と同じ統計表を使い、年齢区分を「65歳以上」に差し替えて算出している。
 *
 * .env / Vercelの環境変数:
 *   ESTAT_APP_ID=（人口・年少人口割合と共通）
 *   ESTAT_STATS_ID_AGING_RATIO=使いたい統計表のstatsDataId（任意）
 */
export const estatAgingRatioProvider: Provider = {
  id: "estat-aging-ratio",
  datasetId: "agingRatio",

  async fetch(): Promise<DataPoint[]> {
    const appId = process.env.ESTAT_APP_ID;

    if (!appId) {
      console.warn("[estat/agingRatio] ESTAT_APP_ID 未設定のためモックデータを使用します");
      return mockAgingRatio();
    }

    try {
      const points = await fetchFromEstat(appId);
      if (points.length === 0) {
        console.warn(
          "[estat/agingRatio] e-Statから0件しか取得できなかったためモックデータにフォールバックします（年齢区分の軸が見つからない可能性があります）"
        );
        return mockAgingRatio();
      }
      return points;
    } catch (err) {
      console.error(
        "[estat/agingRatio] e-Stat APIの取得に失敗したためモックデータにフォールバックします:",
        err
      );
      return mockAgingRatio();
    }
  }
};

async function fetchFromEstat(appId: string): Promise<DataPoint[]> {
  const statsDataId = process.env.ESTAT_STATS_ID_AGING_RATIO ?? "0003448225";
  const areaClassId = process.env.ESTAT_AREA_CLASS_ID ?? "area";

  const json = await callGetStatsData(appId, statsDataId);
  const areaNameByCode = buildClassNameMap(json, areaClassId);

  // 年齢区分の分類軸を探し、「65歳以上」に相当するクラスのコードを特定する
  const classObjRaw = json?.GET_STATS_DATA?.STATISTICAL_DATA?.CLASS_INF?.CLASS_OBJ;
  const classObjList: any[] = Array.isArray(classObjRaw) ? classObjRaw : classObjRaw ? [classObjRaw] : [];

  let ageClassId: string | null = null;
  let elderlyCode: string | null = null;
  for (const classObj of classObjList) {
    const classesRaw = classObj?.CLASS;
    const classes: any[] = Array.isArray(classesRaw) ? classesRaw : classesRaw ? [classesRaw] : [];
    const elderlyClass = classes.find((c) => /65歳以上/.test(String(c?.["@name"] ?? "")));
    if (elderlyClass) {
      ageClassId = classObj["@id"];
      elderlyCode = String(elderlyClass["@code"]);
      break;
    }
  }

  if (!ageClassId || !elderlyCode) {
    console.warn("[estat/agingRatio] 年齢区分の軸が見つかりませんでした");
    return [];
  }

  const totalFilters = buildTotalFilters(json, areaClassId);
  const totalPoints = transformEstatResponse(json, "agingRatio", areaNameByCode, totalFilters);

  const elderlyFilters = { ...totalFilters, [ageClassId]: elderlyCode };
  const elderlyPoints = transformEstatResponse(json, "agingRatio", areaNameByCode, elderlyFilters);

  const totalByKey = new Map(totalPoints.map((p) => [`${p.areaCode}-${p.year}`, p.value]));

  const points: DataPoint[] = [];
  for (const elderly of elderlyPoints) {
    const total = totalByKey.get(`${elderly.areaCode}-${elderly.year}`);
    if (!total || total <= 0) continue;
    points.push({
      dataset: "agingRatio",
      areaCode: elderly.areaCode,
      areaName: elderly.areaName,
      year: elderly.year,
      value: Math.round((elderly.value / total) * 1000) / 10
    });
  }

  const years = Array.from(new Set(points.map((p) => p.year))).sort();
  console.log(
    `[estat/agingRatio] statsDataId=${statsDataId} 取得件数=${points.length} 年=[${years.join(",")}] 分類軸=${summarizeClassifications(json, areaClassId)}`
  );

  return points;
}

function mockAgingRatio(): DataPoint[] {
  const base: Record<string, number> = {
    "05": 39.5, // 秋田県（全国的に高い）
    "13": 22.9, // 東京都
    "47": 23.5 // 沖縄県（全国的に低い）
  };
  const years = [2020, 2021, 2022, 2023, 2024];

  return PREFECTURES.flatMap((pref) => {
    const value = base[pref.code] ?? 30 + (Number(pref.code) % 10) * 0.6;
    return years.map((year, i) => ({
      dataset: "agingRatio",
      areaCode: pref.code,
      areaName: pref.name,
      year,
      value: Number((value - 0.15 * (years.length - 1 - i)).toFixed(1))
    }));
  });
}
