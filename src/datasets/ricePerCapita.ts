import { DatasetConfig } from "@/types/data";

export const ricePerCapita: DatasetConfig = {
  id: "ricePerCapita",
  title: "1人あたり米収穫量",
  category: "農林水産",
  unit: "kg/人",
  source: "当サイト独自算出（水稲収穫量 ÷ 人口）",
  frequency: "年1回",
  chart: "bar",
  ranking: true,
  compare: true,
  providerId: "computed-rice-per-capita",
  description: "水稲収穫量を人口で調整した当サイト独自の指標。総収穫量トップの新潟県に代わり、秋田県・山形県が上位に来る「米どころ度」を示す。",
  seo: {
    dashboardTitle: "米どころ度ランキング｜人口あたり米収穫量で見る本当の米どころ",
    dashboardDescription: "水稲収穫量を人口で調整した「1人あたり米収穫量」の都道府県ランキング。総収穫量とは違う顔ぶれの「米どころ」が見えてきます。",
    rankingTitle: "1人あたり米収穫量が多い都道府県ランキング",
    rankingDescription: "都道府県別の1人あたり米収穫量ランキング。秋田県・山形県が上位です。"
  }
};
