import { Provider } from "@/providers/types";
import { DataPoint } from "@/types/data";
import { estatPopulationProvider } from "@/providers/estat/population";
import { manualHospitalProvider } from "@/providers/manual/hospital";

/**
 * 「人口10万人あたり病院数」は政府統計に単独の表があるわけではなく、
 * 病院数（hospital）÷ 人口（population）× 100,000 で当サイトが独自に算出するオリジナル指標。
 *
 * 病院数のデータが単年（2018年）のスナップショットしか無いため、
 * 人口側もその年に一番近い年（無ければ最新年）を採用して1年分だけ算出する。
 *
 * これは「病院数ランキングだけでは分からない、地域医療の実態」という当サイトの記事で
 * 指摘している「人口規模で調整すべき」という論点を、実際の指標として実装したもの。
 */
export const computedHospitalPerCapitaProvider: Provider = {
  id: "computed-hospital-per-capita",
  datasetId: "hospitalPerCapita",

  async fetch(): Promise<DataPoint[]> {
    const [hospitalPoints, populationPoints] = await Promise.all([
      manualHospitalProvider.fetch(),
      estatPopulationProvider.fetch()
    ]);

    if (hospitalPoints.length === 0 || populationPoints.length === 0) {
      console.warn(
        "[computed/hospitalPerCapita] 病院数または人口データが空のため算出できませんでした"
      );
      return [];
    }

    const hospitalYear = hospitalPoints[0].year;

    // 病院数の年にできるだけ近い人口データを使う（同じ年が無ければ最も近い年で代用する）
    const populationYears = Array.from(new Set(populationPoints.map((p) => p.year)));
    const closestYear = populationYears.reduce((best, y) =>
      Math.abs(y - hospitalYear) < Math.abs(best - hospitalYear) ? y : best
    );
    const populationAtYear = populationPoints.filter((p) => p.year === closestYear);
    const populationByCode = new Map(populationAtYear.map((p) => [p.areaCode, p.value]));

    const points: DataPoint[] = [];
    for (const h of hospitalPoints) {
      const pop = populationByCode.get(h.areaCode);
      if (!pop || pop <= 0) continue;

      points.push({
        dataset: "hospitalPerCapita",
        areaCode: h.areaCode,
        areaName: h.areaName,
        year: h.year, // 病院数の調査年を採用（人口はcloseestYear時点のものを使って計算）
        value: Math.round((h.value / pop) * 100000 * 100) / 100
      });
    }

    console.log(
      `[computed/hospitalPerCapita] 病院数(${hospitalYear}年) ÷ 人口(${closestYear}年) から${points.length}件を算出しました`
    );
    return points;
  }
};
