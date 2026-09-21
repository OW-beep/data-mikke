import { DatasetConfig } from "@/types/data";

export const ricePrice: DatasetConfig = {
  id: "ricePrice",
  title: "米（うるち米・5kg）小売価格",
  category: "生活費",
  unit: "円",
  source: "総務省統計局「小売物価統計調査」（2025年、都道府県庁所在市等の平均）",
  frequency: "年1回",
  chart: "bar",
  ranking: true,
  compare: true,
  providerId: "manual-rice-price",
  description: "うるち米（5kg）の小売価格の都道府県平均（2025年）。",
  affiliateKeyword: "米"
};
