import { Provider } from "@/providers/types";
import { DataPoint } from "@/types/data";
import { estatPopulationProvider } from "@/providers/estat/population";
import { manualAreaProvider } from "@/providers/manual/area";

/**
 * 「人口密度」は政府統計に単独の表があるわけではなく、
 * 人口（population）÷ 面積（area）から当サイトが独自に算出するオリジナル指標。
 *
 * 面積はほぼ変動しないため、人口側の各年に対して同じ面積値を使って計算する。
 * これにより、人口が複数年ある場合は人口密度も複数年分の推移として出せる。
 *
 * 他のProviderの結果をそのまま合成しているだけなので、
 * ESTAT_APP_ID / data/raw/area_municipalities_raw.csv の設定内容がそのまま反映される。
 */
export const computedDensityProvider: Provider = {
  id: "computed-density",
  datasetId: "density",

  async fetch(): Promise<DataPoint[]> {
    const [populationPoints, areaPoints] = await Promise.all([
      estatPopulationProvider.fetch(),
      manualAreaProvider.fetch()
    ]);

    const areaByCode = new Map(areaPoints.map((p) => [p.areaCode, p.value]));

    const points: DataPoint[] = [];
    for (const pop of populationPoints) {
      const area = areaByCode.get(pop.areaCode);
      if (!area || area <= 0) continue;

      points.push({
        dataset: "density",
        areaCode: pop.areaCode,
        areaName: pop.areaName,
        year: pop.year,
        value: Math.round((pop.value / area) * 10) / 10
      });
    }

    console.log(`[computed/density] 人口×面積から${points.length}件を算出しました`);
    return points;
  }
};
