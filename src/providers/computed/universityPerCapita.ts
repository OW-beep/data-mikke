import { Provider } from "@/providers/types";
import { DataPoint } from "@/types/data";
import { estatPopulationProvider } from "@/providers/estat/population";
import { manualUniversityProvider } from "@/providers/manual/university";

/**
 * 「人口10万人あたり大学数」は、大学数（university）を人口（population）で調整した、
 * 当サイト独自の二次分析指標。総数では東京都が圧倒的だが、人口で調整すると
 * 京都府が全国トップに立つことで知られる（大学収容力の高さを示す指標として言及されることが多い）。
 */
export const computedUniversityPerCapitaProvider: Provider = {
  id: "computed-university-per-capita",
  datasetId: "universityPerCapita",

  async fetch(): Promise<DataPoint[]> {
    const [universityPoints, populationPoints] = await Promise.all([
      manualUniversityProvider.fetch(),
      estatPopulationProvider.fetch()
    ]);

    if (universityPoints.length === 0 || populationPoints.length === 0) {
      console.warn(
        "[computed/universityPerCapita] 大学数または人口データが空のため算出できませんでした"
      );
      return [];
    }

    const universityYear = universityPoints[0].year;
    const populationYears = Array.from(new Set(populationPoints.map((p) => p.year)));
    const closestYear = populationYears.reduce((best, y) =>
      Math.abs(y - universityYear) < Math.abs(best - universityYear) ? y : best
    );
    const populationAtYear = populationPoints.filter((p) => p.year === closestYear);
    const populationByCode = new Map(populationAtYear.map((p) => [p.areaCode, p.value]));

    const points: DataPoint[] = [];
    for (const u of universityPoints) {
      const pop = populationByCode.get(u.areaCode);
      if (!pop || pop <= 0) continue;
      points.push({
        dataset: "universityPerCapita",
        areaCode: u.areaCode,
        areaName: u.areaName,
        year: u.year,
        value: Math.round((u.value / pop) * 100000 * 100) / 100
      });
    }

    console.log(
      `[computed/universityPerCapita] 大学数(${universityYear}年) ÷ 人口(${closestYear}年) から${points.length}件を算出しました`
    );
    return points;
  }
};
