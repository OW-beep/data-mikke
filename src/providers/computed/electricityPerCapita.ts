import { Provider } from "@/providers/types";
import { DataPoint } from "@/types/data";
import { estatPopulationProvider } from "@/providers/estat/population";
import { manualElectricityProvider } from "@/providers/manual/electricity";

/**
 * 「1人あたり電灯使用電力量」は、電灯使用電力量（electricity）を人口（population）で
 * 調整した、当サイト独自の二次分析指標。地域の総消費量ではなく、1人あたりの生活水準・
 * 世帯の広さなどを反映しやすい指標になる。
 */
export const computedElectricityPerCapitaProvider: Provider = {
  id: "computed-electricity-per-capita",
  datasetId: "electricityPerCapita",

  async fetch(): Promise<DataPoint[]> {
    const [electricityPoints, populationPoints] = await Promise.all([
      manualElectricityProvider.fetch(),
      estatPopulationProvider.fetch()
    ]);

    if (electricityPoints.length === 0 || populationPoints.length === 0) {
      console.warn(
        "[computed/electricityPerCapita] 電力データまたは人口データが空のため算出できませんでした"
      );
      return [];
    }

    const electricityYear = electricityPoints[0].year;
    const populationYears = Array.from(new Set(populationPoints.map((p) => p.year)));
    const closestYear = populationYears.reduce((best, y) =>
      Math.abs(y - electricityYear) < Math.abs(best - electricityYear) ? y : best
    );
    const populationAtYear = populationPoints.filter((p) => p.year === closestYear);
    const populationByCode = new Map(populationAtYear.map((p) => [p.areaCode, p.value]));

    const points: DataPoint[] = [];
    for (const e of electricityPoints) {
      const pop = populationByCode.get(e.areaCode);
      if (!pop || pop <= 0) continue;
      points.push({
        dataset: "electricityPerCapita",
        areaCode: e.areaCode,
        areaName: e.areaName,
        year: e.year,
        value: Math.round((e.value * 1_000_000 / pop) * 100) / 100 // 百万kWh→kWh ÷ 人
      });
    }

    console.log(
      `[computed/electricityPerCapita] 電力(${electricityYear}年) ÷ 人口(${closestYear}年) から${points.length}件を算出しました`
    );
    return points;
  }
};
