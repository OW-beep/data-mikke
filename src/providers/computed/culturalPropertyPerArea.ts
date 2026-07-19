import { Provider } from "@/providers/types";
import { DataPoint } from "@/types/data";
import { manualAreaProvider } from "@/providers/manual/area";
import { manualCulturalPropertyProvider } from "@/providers/manual/culturalProperty";

/**
 * 「面積あたり国宝・重要文化財数」は、国宝・重要文化財数（culturalProperty）を
 * 面積（area）で調整した、当サイト独自の二次分析指標。
 * 人口10万人あたり（culturalPropertyPerCapita）とは違う切り口で、
 * 「その土地のどれだけの密度で文化財が存在するか」を示す。
 */
export const computedCulturalPropertyPerAreaProvider: Provider = {
  id: "computed-cultural-property-per-area",
  datasetId: "culturalPropertyPerArea",

  async fetch(): Promise<DataPoint[]> {
    const [culturalPoints, areaPoints] = await Promise.all([
      manualCulturalPropertyProvider.fetch(),
      manualAreaProvider.fetch()
    ]);

    if (culturalPoints.length === 0 || areaPoints.length === 0) {
      console.warn(
        "[computed/culturalPropertyPerArea] 文化財データまたは面積データが空のため算出できませんでした"
      );
      return [];
    }

    const areaByCode = new Map(areaPoints.map((p) => [p.areaCode, p.value]));

    const points: DataPoint[] = [];
    for (const c of culturalPoints) {
      const area = areaByCode.get(c.areaCode);
      if (!area || area <= 0) continue;
      points.push({
        dataset: "culturalPropertyPerArea",
        areaCode: c.areaCode,
        areaName: c.areaName,
        year: c.year,
        value: Math.round((c.value / area) * 1000) / 1000
      });
    }

    console.log(`[computed/culturalPropertyPerArea] ${points.length}件を算出しました`);
    return points;
  }
};
