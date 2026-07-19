import { DatasetConfig } from "@/types/data";

export const library: DatasetConfig = {
  id: "library",
  title: "図書館数",
  category: "教育",
  unit: "館",
  source: "文部科学省「社会教育調査」",
  frequency: "3年に1回",
  chart: "bar",
  ranking: true,
  compare: true,
  providerId: "manual-library",
  description: "都道府県別の公共図書館数。",
  seo: {
    dashboardTitle: "都道府県別 図書館数ランキング",
    dashboardDescription: "都道府県ごとの公共図書館数を、ランキングと出典つきで確認できます。",
    rankingTitle: "図書館が多い都道府県ランキング（全47都道府県）",
    rankingDescription: "都道府県別の公共図書館数を1位から47位まで比較したランキング。"
  }
};
