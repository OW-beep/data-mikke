import { DatasetConfig } from "@/types/data";

export const lifeExpectancyFemale: DatasetConfig = {
  id: "lifeExpectancyFemale",
  title: "平均寿命（女性）",
  category: "健康",
  unit: "歳",
  source: "厚生労働省「都道府県別生命表」",
  frequency: "5年に1回",
  chart: "bar",
  ranking: true,
  compare: true,
  providerId: "manual-life-expectancy-female",
  description: "都道府県別の女性の平均寿命。岡山県が全国トップ、青森県が最下位。",
  seo: {
    dashboardTitle: "平均寿命ランキング(女性)｜都道府県別の長寿県",
    dashboardDescription: "女性の平均寿命で見る都道府県ランキング。岡山県がトップ、青森県が最下位です。",
    rankingTitle: "女性の平均寿命が長い都道府県ランキング",
    rankingDescription: "都道府県別の女性平均寿命ランキング。岡山県・京都府・島根県が上位です。"
  }
};
