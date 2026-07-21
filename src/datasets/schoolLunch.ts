import { DatasetConfig } from "@/types/data";

export const schoolLunch: DatasetConfig = {
  id: "schoolLunch",
  title: "給食施設数",
  category: "教育",
  unit: "施設",
  source: "厚生労働省統計集計",
  frequency: "年数回",
  chart: "bar",
  ranking: true,
  compare: true,
  providerId: "manual-school-lunch",
  description: "都道府県別の特定給食施設数（学校・病院・事業所等の給食施設の合計）。",
  seo: {
    dashboardTitle: "都道府県別 給食施設数ランキング",
    dashboardDescription: "学校・病院・事業所等の給食施設の合計数を都道府県別に比較できます。",
    rankingTitle: "給食施設が多い都道府県ランキング（全47都道府県）",
    rankingDescription: "都道府県別の特定給食施設数ランキング。"
  }
};
