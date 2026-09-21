import { DatasetConfig } from "@/types/data";

export const eggPrice: DatasetConfig = {
  id: "eggPrice",
  title: "鶏卵（1kg）小売価格",
  category: "生活費",
  unit: "円",
  source: "総務省統計局「小売物価統計調査」（2025年、都道府県庁所在市等の平均）",
  frequency: "年1回",
  chart: "bar",
  ranking: true,
  compare: true,
  providerId: "manual-egg-price",
  description: "鶏卵（1kg）の小売価格の都道府県平均（2025年）。",
  affiliateKeyword: "卵"
};
