import { DatasetConfig } from "@/types/data";

export const income: DatasetConfig = {
  id: "income",
  title: "県民所得",
  category: "経済",
  unit: "千円",
  source: "内閣府「県民経済計算」(平成23年度)",
  frequency: "年1回",
  chart: "bar",
  ranking: true,
  compare: true,
  providerId: "manual-income",
  description: "都道府県別の1人当たり県民所得（2011年度）。"
};
