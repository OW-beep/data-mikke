import { DatasetConfig } from "@/types/data";

export const gasoline: DatasetConfig = {
  id: "gasoline",
  title: "ガソリン(1L)",
  category: "生活費",
  unit: "円/L",
  source: "総務省統計局「小売物価統計調査」（2025年、都道府県庁所在市等の平均）",
  frequency: "年1回",
  chart: "bar",
  ranking: true,
  compare: true,
  providerId: "manual-gasoline",
  description: "レギュラーガソリン（セルフサービス式を除く）1Lあたり価格の都道府県平均（2025年）。",
  affiliateKeyword: "カー用品"
};
