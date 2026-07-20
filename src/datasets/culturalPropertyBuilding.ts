import { DatasetConfig } from "@/types/data";

export const culturalPropertyBuilding: DatasetConfig = {
  id: "culturalPropertyBuilding",
  title: "国宝・重文の建造物数",
  category: "観光文化",
  unit: "件",
  source: "文化庁データ集計",
  frequency: "年数回（指定のたびに更新）",
  chart: "bar",
  ranking: true,
  compare: true,
  providerId: "manual-cultural-property-building",
  description:
    "国宝・重要文化財のうち「建造物」だけの件数。総数（culturalProperty）を種別で分解した、より精度の高い指標。京都府・奈良県に極端に集中する。",
  seo: {
    dashboardTitle: "国宝・重文の建造物数ランキング｜寺社仏閣が多い都道府県",
    dashboardDescription: "国宝・重要文化財のうち建造物（寺社・城郭など）だけに絞った都道府県ランキング。京都府・奈良県が突出しています。",
    rankingTitle: "国宝・重文の建造物が多い都道府県ランキング",
    rankingDescription: "都道府県別の国宝・重文の建造物数ランキング。京都府が292件で全国トップ。"
  }
};
