import { DatasetConfig } from "@/types/data";

export const lifeExpectancyMale: DatasetConfig = {
  id: "lifeExpectancyMale",
  title: "平均寿命（男性）",
  category: "健康",
  unit: "歳",
  source: "厚生労働省「都道府県別生命表」",
  frequency: "5年に1回",
  chart: "bar",
  ranking: true,
  compare: true,
  providerId: "manual-life-expectancy-male",
  description: "都道府県別の男性の平均寿命。滋賀県が全国トップ、青森県が最下位。",
  seo: {
    dashboardTitle: "平均寿命ランキング(男性)｜都道府県別の長寿県",
    dashboardDescription: "男性の平均寿命で見る都道府県ランキング。滋賀県がトップ、青森県が最下位です。",
    rankingTitle: "男性の平均寿命が長い都道府県ランキング",
    rankingDescription: "都道府県別の男性平均寿命ランキング。滋賀県・長野県・奈良県が上位です。"
  }
};
