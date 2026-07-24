import { DatasetConfig } from "@/types/data";

export const shipmentPerFactory: DatasetConfig = {
  id: "shipmentPerFactory",
  title: "1事業所あたり製造品出荷額",
  category: "工業",
  unit: "百万円/事業所",
  source: "当サイト独自算出（製造品出荷額等 ÷ 製造業事業所数）",
  frequency: "年1回",
  chart: "bar",
  ranking: true,
  compare: true,
  providerId: "computed-shipment-per-factory",
  description: "製造品出荷額等を製造業事業所数で割った当サイト独自の指標。事業所1つあたりの平均規模（大規模工場型か、中小事業所の集積型か）を示す。",
  seo: {
    dashboardTitle: "工場の平均規模ランキング｜1事業所あたり製造品出荷額",
    dashboardDescription: "製造品出荷額を事業所数で割った「1事業所あたり出荷額」の都道府県ランキング。大規模工場が多い県と、中小事業所が集積する県の違いが見えます。",
    rankingTitle: "1事業所あたりの製造規模が大きい都道府県ランキング",
    rankingDescription: "都道府県別の1事業所あたり製造品出荷額ランキング。大規模工場が立地する県が上位に来ます。"
  }
};
