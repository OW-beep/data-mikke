import { DatasetConfig } from "@/types/data";

export const bmi: DatasetConfig = {
  id: "bmi",
  title: "BMI",
  category: "健康",
  unit: "",
  source: "厚生労働省「令和6年国民健康・栄養調査」（都道府県別、年齢調整値）",
  frequency: "年1回",
  chart: "bar",
  ranking: true,
  compare: true,
  providerId: "manual-bmi",
  description: "男女平均のBMI（年齢調整値、都道府県別）。高低いずれが良いとも言えない指標のため、健康スコアの集計には含めていません。"
};
