import { DatasetConfig } from "@/types/data";

export const saltIntake: DatasetConfig = {
  id: "saltIntake",
  title: "食塩摂取量",
  category: "健康",
  unit: "g/日",
  source: "厚生労働省「令和6年国民健康・栄養調査」（都道府県別、年齢調整値）",
  frequency: "年1回",
  chart: "bar",
  ranking: true,
  compare: true,
  providerId: "manual-salt-intake",
  description: "20歳以上・男女平均の食塩摂取量（年齢調整値、都道府県別）。"
};
