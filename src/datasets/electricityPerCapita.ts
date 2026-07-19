import { DatasetConfig } from "@/types/data";

export const electricityPerCapita: DatasetConfig = {
  id: "electricityPerCapita",
  title: "1人あたり電灯使用電力量",
  category: "エネルギー",
  unit: "kWh/人",
  source: "当サイト独自算出（電灯使用電力量 ÷ 人口）",
  frequency: "年1回",
  chart: "bar",
  ranking: true,
  compare: true,
  providerId: "computed-electricity-per-capita",
  description: "電灯使用電力量を人口で調整した当サイト独自の指標。地域の生活水準・住宅の広さの違いが表れやすい。",
  seo: {
    dashboardTitle: "1人あたり電力使用量ランキング｜都道府県別エネルギー消費",
    dashboardDescription: "電灯使用電力量を人口で調整した「1人あたり電力使用量」の都道府県ランキング。",
    rankingTitle: "1人あたり電力使用量が多い都道府県ランキング",
    rankingDescription: "都道府県別の1人あたり電灯使用電力量ランキング。"
  }
};
