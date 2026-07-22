import { Provider } from "@/providers/types";
import { DataPoint } from "@/types/data";
import { estatPopulationProvider } from "@/providers/estat/population";
import { manualCafeProvider } from "@/providers/manual/cafe";

/**
 * 「人口10万人あたり喫茶店の軒数」は、喫茶店の軒数（cafe）を人口（population）で
 * 調整した、当サイト独自の二次分析指標。総数では東京都・愛知県・大阪府が上位だが、
 * 人口で調整すると長野県が全国トップに立つことで知られる「隠れた喫茶店王国」を示す指標。
 */
export const computedCafePerCapitaProvider: Provider = {
  id: "computed-cafe-per-capita",
  datasetId: "cafePerCapita",

  async fetch(): Promise<DataPoint[]> {
    const [cafePoints, populationPoints] = await Promise.all([
      manualCafeProvider.fetch(),
      estatPopulationProvider.fetch()
    ]);

    if (cafePoints.length === 0 || populationPoints.length === 0) {
      console.warn("[computed/cafePerCapita] 喫茶店データまたは人口データが空のため算出できませんでした");
      return [];
    }

    const cafeYear = cafePoints[0].year;
    const populationYears = Array.from(new Set(populationPoints.map((p) => p.year)));
    const closestYear = populationYears.reduce((best, y) =>
      Math.abs(y - cafeYear) < Math.abs(best - cafeYear) ? y : best
    );
    const populationAtYear = populationPoints.filter((p) => p.year === closestYear);
    const populationByCode = new Map(populationAtYear.map((p) => [p.areaCode, p.value]));

    const points: DataPoint[] = [];
    for (const c of cafePoints) {
      const pop = populationByCode.get(c.areaCode);
      if (!pop || pop <= 0) continue;
      points.push({
        dataset: "cafePerCapita",
        areaCode: c.areaCode,
        areaName: c.areaName,
        year: c.year,
        value: Math.round((c.value / pop) * 100000 * 100) / 100
      });
    }

    console.log(
      `[computed/cafePerCapita] 喫茶店数(${cafeYear}年) ÷ 人口(${closestYear}年) から${points.length}件を算出しました`
    );
    return points;
  }
};
