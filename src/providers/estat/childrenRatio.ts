import { Provider } from "@/providers/types";
import { DataPoint } from "@/types/data";
import { PREFECTURES } from "@/lib/prefectures";
import { callGetStatsData, buildClassNameMap, buildTotalFilters, transformEstatResponse, summarizeClassifications } from "./shared";

/**
 * e-Stat API から「都道府県別 年少人口割合（15歳未満人口 ÷ 総人口 × 100）」を取得するProvider。
 * 出典: 総務省統計局「人口推計」（都道府県，年齢（3区分），男女別人口）
 *
 * この表には年齢の内訳（総数／0～14歳／15～64歳／65歳以上）が含まれているため、
 * 「0～14歳」を分子、「総数」を分母として、当サイトが独自に割合を計算している。
 *
 * .env / Vercelの環境変数:
 *   ESTAT_APP_ID=（人口・出生率と共通）
 *   ESTAT_STATS_ID_CHILDREN_RATIO=使いたい統計表のstatsDataId（任意）
 */
export const estatChildrenRatioProvider: Provider = {
  id: "estat-children-ratio",
  datasetId: "childrenRatio",

  async fetch(): Promise<DataPoint[]> {
    const appId = process.env.ESTAT_APP_ID;

    if (!appId) {
      console.warn("[estat/childrenRatio] ESTAT_APP_ID 未設定のためモックデータを使用します");
      return mockChildrenRatio();
    }

    try {
      const points = await fetchFromEstat(appId);
      if (points.length === 0) {
        console.warn(
          "[estat/childrenRatio] e-Statから0件しか取得できなかったためモックデータにフォールバックします（年齢区分の軸が見つからない可能性があります）"
        );
        return mockChildrenRatio();
      }
      return points;
    } catch (err) {
      console.error(
        "[estat/childrenRatio] e-Stat APIの取得に失敗したためモックデータにフォールバックします:",
        err
      );
      return mockChildrenRatio();
    }
  }
};

async function fetchFromEstat(appId: string): Promise<DataPoint[]> {
  const statsDataId = process.env.ESTAT_STATS_ID_CHILDREN_RATIO ?? "0003448225";
  const areaClassId = process.env.ESTAT_AREA_CLASS_ID ?? "area";

  const json = await callGetStatsData(appId, statsDataId);
  const areaNameByCode = buildClassNameMap(json, areaClassId);

  // 年齢区分の分類軸を探し、「0～14歳」に相当するクラスのコードを特定する
  const classObjRaw = json?.GET_STATS_DATA?.STATISTICAL_DATA?.CLASS_INF?.CLASS_OBJ;
  const classObjList: any[] = Array.isArray(classObjRaw) ? classObjRaw : classObjRaw ? [classObjRaw] : [];

  let ageClassId: string | null = null;
  let childCode: string | null = null;
  for (const classObj of classObjList) {
    const classesRaw = classObj?.CLASS;
    const classes: any[] = Array.isArray(classesRaw) ? classesRaw : classesRaw ? [classesRaw] : [];
    const childClass = classes.find((c) => /0.*1?4歳/.test(String(c?.["@name"] ?? "")));
    if (childClass) {
      ageClassId = classObj["@id"];
      childCode = String(childClass["@code"]);
      break;
    }
  }

  if (!ageClassId || !childCode) {
    console.warn("[estat/childrenRatio] 年齢区分の軸が見つかりませんでした");
    return [];
  }

  // 分母（総人口）は通常どおり「総数」フィルタで抽出
  const totalFilters = buildTotalFilters(json, areaClassId);
  const totalPoints = transformEstatResponse(json, "childrenRatio", areaNameByCode, totalFilters);

  // 分子（15歳未満人口）は年齢区分だけ「0～14歳」に差し替えて抽出
  const childFilters = { ...totalFilters, [ageClassId]: childCode };
  const childPoints = transformEstatResponse(json, "childrenRatio", areaNameByCode, childFilters);

  const totalByKey = new Map(totalPoints.map((p) => [`${p.areaCode}-${p.year}`, p.value]));

  const points: DataPoint[] = [];
  for (const child of childPoints) {
    const total = totalByKey.get(`${child.areaCode}-${child.year}`);
    if (!total || total <= 0) continue;
    points.push({
      dataset: "childrenRatio",
      areaCode: child.areaCode,
      areaName: child.areaName,
      year: child.year,
      value: Math.round((child.value / total) * 1000) / 10
    });
  }

  const years = Array.from(new Set(points.map((p) => p.year))).sort();
  console.log(
    `[estat/childrenRatio] statsDataId=${statsDataId} 取得件数=${points.length} 年=[${years.join(",")}] 分類軸=${summarizeClassifications(json, areaClassId)}`
  );

  return points;
}

function mockChildrenRatio(): DataPoint[] {
  const base: Record<string, number> = {
    "47": 16.4, // 沖縄県（全国的に高い）
    "13": 10.9, // 東京都
    "05": 9.5 // 秋田県（全国的に低い）
  };
  const years = [2020, 2021, 2022, 2023, 2024];

  return PREFECTURES.flatMap((pref) => {
    const value = base[pref.code] ?? 11.5 + (Number(pref.code) % 6) * 0.3;
    return years.map((year, i) => ({
      dataset: "childrenRatio",
      areaCode: pref.code,
      areaName: pref.name,
      year,
      value: Number((value - 0.05 * (years.length - 1 - i)).toFixed(1))
    }));
  });
}
