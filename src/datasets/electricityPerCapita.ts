import { DatasetConfig } from "@/types/data";

export const electricityPerCapita: DatasetConfig = {
  id: "electricityPerCapita",
  title: "1人あたり電力消費量（家庭部門）",
  category: "エネルギー",
  unit: "kWh/人",
  source: "当サイト独自算出（家庭部門電力消費量 ÷ 人口）",
  frequency: "年1回",
  chart: "bar",
  ranking: true,
  compare: true,
  providerId: "computed-electricity-per-capita",
  description: "家庭部門電力消費量を人口で調整した当サイト独自の指標。産業用途を除いた、暮らしぶりの違いがより正確に表れる。",
  seo: {
    dashboardTitle: "1人あたり電力消費量ランキング｜家庭部門に絞った都道府県別エネルギー消費",
    dashboardDescription: "家庭部門の電力消費量を人口で調整した「1人あたり電力消費量」の都道府県ランキング。産業用途を含まない、暮らしぶりに絞った指標です。",
    rankingTitle: "1人あたり電力消費量が多い都道府県ランキング（家庭部門）",
    rankingDescription: "都道府県別の1人あたり家庭部門電力消費量ランキング。"
  }
};
