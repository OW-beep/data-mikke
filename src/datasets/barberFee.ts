import { DatasetConfig } from "@/types/data";

export const barberFee: DatasetConfig = {
  id: "barberFee",
  title: "理髪料",
  category: "生活費",
  unit: "円",
  source: "総務省統計局「小売物価統計調査」（2025年、都道府県庁所在市等）",
  frequency: "年1回",
  chart: "bar",
  ranking: true,
  compare: true,
  providerId: "manual-barber-fee",
  description: "理髪料の都道府県庁所在市等における価格（2025年）。"
};
