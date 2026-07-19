import { DatasetConfig } from "@/types/data";

export const culturalProperty: DatasetConfig = {
  id: "culturalProperty",
  title: "国宝・重要文化財数",
  category: "観光文化",
  unit: "件",
  source: "文化庁データ集計",
  frequency: "年数回（指定のたびに更新）",
  chart: "bar",
  ranking: true,
  compare: true,
  providerId: "manual-cultural-property",
  description: "都道府県別の国宝・重要文化財の総数。京都・奈良など歴史的蓄積のある地域に集中する。"
};
