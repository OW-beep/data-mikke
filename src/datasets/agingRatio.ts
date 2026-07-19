import { DatasetConfig } from "@/types/data";

export const agingRatio: DatasetConfig = {
  id: "agingRatio",
  title: "高齢化率",
  category: "人口",
  unit: "%",
  source: "総務省統計局「人口推計」",
  frequency: "年1回",
  chart: "line",
  ranking: true,
  compare: true,
  providerId: "estat-aging-ratio",
  description: "都道府県別の高齢化率（65歳以上人口が総人口に占める割合）。",
  seo: {
    dashboardTitle: "都道府県別 高齢化率ランキング・推移グラフ",
    dashboardDescription: "都道府県ごとの高齢化率（65歳以上人口の割合）を、ランキングと年ごとの推移グラフで確認できます。",
    rankingTitle: "高齢化率が高い都道府県ランキング（全47都道府県）",
    rankingDescription: "都道府県別の高齢化率を1位から47位まで比較。秋田県が全国トップの水準です。"
  }
};
