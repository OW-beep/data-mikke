import { DatasetConfig } from "@/types/data";

export const michinoeki: DatasetConfig = {
  id: "michinoeki",
  title: "道の駅の数",
  category: "交通",
  unit: "駅",
  source: "国土交通省道路局「道の駅一覧」（2024年8月7日現在）",
  frequency: "不定期（登録の都度更新）",
  chart: "bar",
  ranking: true,
  compare: true,
  providerId: "manual-michinoeki",
  description: "都道府県別の登録「道の駅」の数。",
  seo: {
    dashboardTitle: "道の駅の数ランキング｜都道府県別データ",
    dashboardDescription: "都道府県ごとの道の駅の数を比較できます。北海道が128駅で圧倒的な1位、東京都はわずか1駅です。",
    rankingTitle: "道の駅が多い都道府県ランキング（全47都道府県）",
    rankingDescription: "都道府県別の道の駅数ランキング。出典: 国土交通省道路局「道の駅一覧」。"
  }
};
