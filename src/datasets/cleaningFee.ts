import { DatasetConfig } from "@/types/data";

export const cleaningFee: DatasetConfig = {
  id: "cleaningFee",
  title: "クリーニング代(スーツ)",
  category: "生活費",
  unit: "円",
  source: "総務省統計局「小売物価統計調査」（2025年、都道府県庁所在市等の平均）",
  frequency: "年1回",
  chart: "bar",
  ranking: true,
  compare: true,
  providerId: "manual-cleaning-fee",
  description: "男性用スーツ上下のドライクリーニング代の都道府県平均（2025年）。"
};
