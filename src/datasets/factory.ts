import { DatasetConfig } from "@/types/data";

export const factory: DatasetConfig = {
  id: "factory",
  title: "製造業事業所数",
  category: "工業",
  unit: "事業所",
  source: "経済産業省「工業統計調査」",
  frequency: "年1回",
  chart: "bar",
  ranking: true,
  compare: true,
  providerId: "manual-factory",
  description: "都道府県別の製造業事業所数。東京都・大阪府・愛知県が上位。製造品出荷額等と組み合わせると、事業所1つあたりの規模が見えてくる。",
  seo: {
    dashboardTitle: "製造業事業所数ランキング｜都道府県別の工場・事業所数",
    dashboardDescription: "都道府県ごとの製造業事業所数を比較できます。東京都・大阪府・愛知県が上位です。",
    rankingTitle: "製造業事業所が多い都道府県ランキング（全47都道府県）",
    rankingDescription: "都道府県別の製造業事業所数ランキング。"
  }
};
