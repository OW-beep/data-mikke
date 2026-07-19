import { Provider } from "@/providers/types";
import { DataPoint } from "@/types/data";
import { estatPopulationProvider } from "@/providers/estat/population";
import { manualCulturalPropertyProvider } from "@/providers/manual/culturalProperty";

/**
 * 「人口10万人あたり国宝・重要文化財数」は、国宝・重要文化財数（culturalProperty）を
 * 人口（population）で調整した、当サイト独自の二次分析指標。
 *
 * 単純な総数ランキングでは東京都・京都府のように人口も多い大都市が上位に来やすいが、
 * 人口で調整すると、奈良県・滋賀県・和歌山県のように「人口の割に文化財が集中している」
 * 地域が浮かび上がる。hospitalPerCapita・densityと同じ「既存データの組み合わせ」の手法。
 */
export const computedCulturalPropertyPerCapitaProvider: Provider = {
  id: "computed-cultural-property-per-capita",
  datasetId: "culturalPropertyPerCapita",

  async fetch(): Promise<DataPoint[]> {
    const [culturalPoints, populationPoints] = await Promise.all([
      manualCulturalPropertyProvider.fetch(),
      estatPopulationProvider.fetch()
    ]);

    if (culturalPoints.length === 0 || populationPoints.length === 0) {
      console.warn(
        "[computed/culturalPropertyPerCapita] 文化財数または人口データが空のため算出できませんでした"
      );
      return [];
    }

    const culturalYear = culturalPoints[0].year;

    // 文化財数の年にできるだけ近い人口データを使う
    const populationYears = Array.from(new Set(populationPoints.map((p) => p.year)));
    const closestYear = populationYears.reduce((best, y) =>
      Math.abs(y - culturalYear) < Math.abs(best - culturalYear) ? y : best
    );
    const populationAtYear = populationPoints.filter((p) => p.year === closestYear);
    const populationByCode = new Map(populationAtYear.map((p) => [p.areaCode, p.value]));

    const points: DataPoint[] = [];
    for (const c of culturalPoints) {
      const pop = populationByCode.get(c.areaCode);
      if (!pop || pop <= 0) continue;

      points.push({
        dataset: "culturalPropertyPerCapita",
        areaCode: c.areaCode,
        areaName: c.areaName,
        year: c.year,
        value: Math.round((c.value / pop) * 100000 * 100) / 100
      });
    }

    console.log(
      `[computed/culturalPropertyPerCapita] 文化財数(${culturalYear}年) ÷ 人口(${closestYear}年) から${points.length}件を算出しました`
    );
    return points;
  }
};
