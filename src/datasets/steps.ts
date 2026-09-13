import { DatasetConfig } from "@/types/data";

export const steps: DatasetConfig = {
  id: "steps",
  title: "歩数",
  category: "健康",
  unit: "歩/日",
  source: "厚生労働省「令和6年国民健康・栄養調査」（都道府県別、年齢調整値）",
  frequency: "年1回",
  chart: "bar",
  ranking: true,
  compare: true,
  providerId: "manual-steps",
  description: "20〜64歳・男女平均の1日あたり歩数（年齢調整値、都道府県別）。"
};
