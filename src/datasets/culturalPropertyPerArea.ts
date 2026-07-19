import { DatasetConfig } from "@/types/data";

export const culturalPropertyPerArea: DatasetConfig = {
  id: "culturalPropertyPerArea",
  title: "面積あたり国宝・重要文化財数",
  category: "観光文化",
  unit: "件/km²",
  source: "当サイト独自算出（国宝・重要文化財数 ÷ 面積）",
  frequency: "年数回",
  chart: "bar",
  ranking: true,
  compare: true,
  providerId: "computed-cultural-property-per-area",
  description: "国宝・重要文化財数を面積で調整した当サイト独自の指標。人口あたりとは異なる「土地の密度」の視点。",
  seo: {
    dashboardTitle: "面積あたり文化財密度ランキング｜都道府県別の歴史的集積度",
    dashboardDescription: "国宝・重要文化財数を面積で調整した「文化財密度」の都道府県ランキング。人口あたりとは違う顔ぶれが見えます。",
    rankingTitle: "文化財密度が高い都道府県ランキング（面積あたり国宝・重文数）",
    rankingDescription: "都道府県の面積あたり国宝・重要文化財数ランキング。京都府が圧倒的な密度を見せます。"
  }
};
