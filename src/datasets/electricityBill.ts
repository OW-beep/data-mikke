import { DatasetConfig } from "@/types/data";

export const electricityBill: DatasetConfig = {
  id: "electricityBill",
  title: "電気代(月)",
  category: "生活費",
  unit: "円/月",
  source: "総務省統計局「小売物価統計調査」（2025年、都道府県庁所在市等の平均）",
  frequency: "年1回",
  chart: "bar",
  ranking: true,
  compare: true,
  providerId: "manual-electricity-bill",
  description: "従量電灯（50アンペア契約・402kWh利用）を基準とした電気代の都道府県平均（2025年）。"
};
