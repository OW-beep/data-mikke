import { Provider } from "@/providers/types";
import { DataPoint } from "@/types/data";
import { estatPopulationProvider } from "@/providers/estat/population";
import { manualManufacturingProvider } from "@/providers/manual/manufacturing";

/**
 * 「1人あたり製造品出荷額」は、製造品出荷額等（manufacturing）を人口（population）で
 * 調整した、当サイト独自の二次分析指標。工業の「規模」ではなく「生産性・集約度」を示す。
 */
export const computedManufacturingPerCapitaProvider: Provider = {
  id: "computed-manufacturing-per-capita",
  datasetId: "manufacturingPerCapita",

  async fetch(): Promise<DataPoint[]> {
    const [manufacturingPoints, populationPoints] = await Promise.all([
      manualManufacturingProvider.fetch(),
      estatPopulationProvider.fetch()
    ]);

    if (manufacturingPoints.length === 0 || populationPoints.length === 0) {
      console.warn(
        "[computed/manufacturingPerCapita] 製造品出荷額または人口データが空のため算出できませんでした"
      );
      return [];
    }

    const manufacturingYear = manufacturingPoints[0].year;
    const populationYears = Array.from(new Set(populationPoints.map((p) => p.year)));
    const closestYear = populationYears.reduce((best, y) =>
      Math.abs(y - manufacturingYear) < Math.abs(best - manufacturingYear) ? y : best
    );
    const populationAtYear = populationPoints.filter((p) => p.year === closestYear);
    const populationByCode = new Map(populationAtYear.map((p) => [p.areaCode, p.value]));

    const points: DataPoint[] = [];
    for (const m of manufacturingPoints) {
      const pop = populationByCode.get(m.areaCode);
      if (!pop || pop <= 0) continue;

      points.push({
        dataset: "manufacturingPerCapita",
        areaCode: m.areaCode,
        areaName: m.areaName,
        year: m.year,
        value: Math.round((m.value / pop) * 100) / 100 // 百万円 ÷ 人 = 1人あたり百万円
      });
    }

    console.log(
      `[computed/manufacturingPerCapita] 製造品出荷額(${manufacturingYear}年) ÷ 人口(${closestYear}年) から${points.length}件を算出しました`
    );
    return points;
  }
};
