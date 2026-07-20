import { DatasetConfig } from "@/types/data";

export const university: DatasetConfig = {
  id: "university",
  title: "大学数",
  category: "教育",
  unit: "校",
  source: "都道府県格付研究所（学校基本調査集計）",
  frequency: "年1回",
  chart: "bar",
  ranking: true,
  compare: true,
  providerId: "manual-university",
  description: "都道府県別の大学数（大学院を含み、短期大学・高等専門学校は含まない）。本部所在地ベース。",
  seo: {
    dashboardTitle: "都道府県別 大学数ランキング",
    dashboardDescription: "都道府県ごとの大学数（本部所在地ベース）を、ランキングと出典つきで確認できます。",
    rankingTitle: "大学が多い都道府県ランキング（全47都道府県）",
    rankingDescription: "都道府県別の大学数を1位から47位まで比較したランキング。東京都が圧倒的な数を誇ります。"
  }
};
