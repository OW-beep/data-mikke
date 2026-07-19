import { DatasetConfig } from "@/types/data";

export const childrenRatio: DatasetConfig = {
  id: "childrenRatio",
  title: "年少人口割合",
  category: "人口",
  unit: "%",
  source: "総務省統計局「人口推計」",
  frequency: "年1回",
  chart: "line",
  ranking: true,
  compare: true,
  providerId: "estat-children-ratio",
  description: "都道府県別の年少人口割合（15歳未満人口が総人口に占める割合）。",
  seo: {
    dashboardTitle: "都道府県別 子どもの割合ランキング（年少人口割合）",
    dashboardDescription: "都道府県ごとの年少人口割合（15歳未満人口の割合）を、ランキングと推移グラフで確認できます。子育て世帯の分布が見えてきます。",
    rankingTitle: "子どもの割合が高い都道府県ランキング（年少人口割合）",
    rankingDescription: "都道府県別の年少人口割合を1位から47位まで比較したランキング。"
  }
};
