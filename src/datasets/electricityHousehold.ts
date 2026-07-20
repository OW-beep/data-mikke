import { DatasetConfig } from "@/types/data";

export const electricityHousehold: DatasetConfig = {
  id: "electricityHousehold",
  title: "家庭部門電力消費量",
  category: "エネルギー",
  unit: "百万kWh",
  source: "資源エネルギー庁「都道府県別エネルギー消費統計」",
  frequency: "年1回",
  chart: "bar",
  ranking: true,
  compare: true,
  providerId: "manual-electricity-household",
  description:
    "都道府県別の家庭部門の電力消費量。産業・業務他とは切り分けられた、家庭での電力使用実態に絞った精度の高い指標。",
  seo: {
    dashboardTitle: "家庭の電力消費量ランキング｜都道府県別エネルギー消費統計",
    dashboardDescription: "資源エネルギー庁のデータをもとにした、家庭部門に絞った都道府県別電力消費量ランキング。",
    rankingTitle: "家庭の電力消費量が多い都道府県ランキング",
    rankingDescription: "都道府県別の家庭部門電力消費量ランキング。産業用途を除いた、暮らしの電力消費に絞った指標。"
  }
};
