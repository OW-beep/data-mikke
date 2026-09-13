import { DatasetConfig } from "@/types/data";

export const gasBill: DatasetConfig = {
  id: "gasBill",
  title: "都市ガス代(月)",
  category: "生活費",
  unit: "円/月",
  source: "総務省統計局「小売物価統計調査」（2025年、都道府県庁所在市等の平均）",
  frequency: "年1回",
  chart: "bar",
  ranking: true,
  compare: true,
  providerId: "manual-gas-bill",
  description: "一般家庭用・1465.12MJ利用を基準とした都市ガス代の都道府県平均（2025年）。"
};
