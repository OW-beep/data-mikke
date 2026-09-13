import { DatasetConfig } from "@/types/data";

export const smokingRate: DatasetConfig = {
  id: "smokingRate",
  title: "喫煙率(男性)",
  category: "健康",
  unit: "%",
  source: "厚生労働省「令和6年国民健康・栄養調査」（都道府県別、年齢調整値）",
  frequency: "年1回",
  chart: "bar",
  ranking: true,
  compare: true,
  providerId: "manual-smoking-rate",
  description: "20歳以上男性の、現在習慣的に喫煙している者の割合（年齢調整値、都道府県別）。"
};
