import { Provider } from "@/providers/types";
import { DataPoint } from "@/types/data";
import { manualManufacturingProvider } from "@/providers/manual/manufacturing";
import { manualFactoryProvider } from "@/providers/manual/factory";

/**
 * 「1事業所あたり製造品出荷額」は、製造品出荷額等（manufacturing）を
 * 製造業事業所数（factory）で割った、当サイト独自の二次分析指標。
 * 人口や面積ではなく「同じ産業内の別の指標」で割ることで、
 * 1事業所あたりの平均的な事業規模（大規模工場が多いか、小規模事業所が多いか）を示す。
 */
export const computedShipmentPerFactoryProvider: Provider = {
  id: "computed-shipment-per-factory",
  datasetId: "shipmentPerFactory",

  async fetch(): Promise<DataPoint[]> {
    const [manufacturingPoints, factoryPoints] = await Promise.all([
      manualManufacturingProvider.fetch(),
      manualFactoryProvider.fetch()
    ]);

    if (manufacturingPoints.length === 0 || factoryPoints.length === 0) {
      console.warn(
        "[computed/shipmentPerFactory] 製造品出荷額または事業所数データが空のため算出できませんでした"
      );
      return [];
    }

    const factoryByCode = new Map(factoryPoints.map((p) => [p.areaCode, p.value]));

    const points: DataPoint[] = [];
    for (const m of manufacturingPoints) {
      const factories = factoryByCode.get(m.areaCode);
      if (!factories || factories <= 0) continue;
      points.push({
        dataset: "shipmentPerFactory",
        areaCode: m.areaCode,
        areaName: m.areaName,
        year: m.year,
        value: Math.round((m.value / factories) * 100) / 100 // 百万円/事業所
      });
    }

    console.log(`[computed/shipmentPerFactory] ${points.length}件を算出しました`);
    return points;
  }
};
