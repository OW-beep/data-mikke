import { DatasetConfig } from "@/types/data";

export const rice: DatasetConfig = {
  id: "rice",
  title: "米（水稲）の収穫量",
  category: "農林水産",
  unit: "トン",
  source: "農林水産省「作物統計調査」",
  frequency: "年1回",
  chart: "bar",
  ranking: true,
  compare: true,
  providerId: "manual-rice",
  description: "都道府県別の水稲収穫量。新潟県・北海道・秋田県が上位、東京都・沖縄県が最下位クラス。",
  seo: {
    dashboardTitle: "米の収穫量ランキング｜都道府県別の水稲生産量",
    dashboardDescription: "都道府県ごとの水稲（お米）の収穫量を比較できます。新潟県が全国トップ、東京都はわずか484トンです。",
    rankingTitle: "米の収穫量が多い都道府県ランキング（全47都道府県）",
    rankingDescription: "都道府県別の水稲収穫量ランキング。新潟県・北海道・秋田県が上位です。"
  }
};
