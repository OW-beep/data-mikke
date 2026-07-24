import { Provider } from "@/providers/types";
import { DataPoint } from "@/types/data";
import { estatPopulationProvider } from "@/providers/estat/population";
import { manualRiceProvider } from "@/providers/manual/rice";

/**
 * 「1人あたり米収穫量」は、水稲収穫量（rice）を人口（population）で調整した、
 * 当サイト独自の二次分析指標。総収穫量では新潟県・北海道が上位だが、
 * 人口で調整すると秋田県・山形県のような「1人あたりの米どころ度」が高い県が浮かび上がる。
 */
export const computedRicePerCapitaProvider: Provider = {
  id: "computed-rice-per-capita",
  datasetId: "ricePerCapita",

  async fetch(): Promise<DataPoint[]> {
    const [ricePoints, populationPoints] = await Promise.all([
      manualRiceProvider.fetch(),
      estatPopulationProvider.fetch()
    ]);

    if (ricePoints.length === 0 || populationPoints.length === 0) {
      console.warn("[computed/ricePerCapita] 米収穫量または人口データが空のため算出できませんでした");
      return [];
    }

    const riceYear = ricePoints[0].year;
    const populationYears = Array.from(new Set(populationPoints.map((p) => p.year)));
    const closestYear = populationYears.reduce((best, y) =>
      Math.abs(y - riceYear) < Math.abs(best - riceYear) ? y : best
    );
    const populationAtYear = populationPoints.filter((p) => p.year === closestYear);
    const populationByCode = new Map(populationAtYear.map((p) => [p.areaCode, p.value]));

    const points: DataPoint[] = [];
    for (const r of ricePoints) {
      const pop = populationByCode.get(r.areaCode);
      if (!pop || pop <= 0) continue;
      points.push({
        dataset: "ricePerCapita",
        areaCode: r.areaCode,
        areaName: r.areaName,
        year: r.year,
        value: Math.round((r.value / pop) * 1000 * 100) / 100 // kg/人に近い単位（トン÷人×1000）
      });
    }

    console.log(
      `[computed/ricePerCapita] 米収穫量(${riceYear}年) ÷ 人口(${closestYear}年) から${points.length}件を算出しました`
    );
    return points;
  }
};
