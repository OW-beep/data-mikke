import { DatasetConfig } from "@/types/data";

export const waterBill: DatasetConfig = {
  id: "waterBill",
  title: "水道料(月)",
  category: "生活費",
  unit: "円/月",
  source: "総務省統計局「小売物価統計調査」（2025年、都道府県庁所在市等の平均）",
  frequency: "年1回",
  chart: "bar",
  ranking: true,
  compare: true,
  providerId: "manual-water-bill",
  description: "20立方メートル利用を基準とした水道料の都道府県平均（2025年）。"
};
