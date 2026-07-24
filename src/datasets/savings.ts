import { DatasetConfig } from "@/types/data";

export const savings: DatasetConfig = {
  id: "savings",
  title: "貯蓄現在高（2人以上世帯）",
  category: "経済",
  unit: "万円",
  source: "総務省統計局「家計調査」",
  frequency: "年1回",
  chart: "bar",
  ranking: true,
  compare: true,
  providerId: "manual-savings",
  description: "都道府県別の2人以上世帯における貯蓄現在高。県民所得ランキングとは異なる顔ぶれが上位に来る。",
  seo: {
    dashboardTitle: "貯蓄額ランキング｜都道府県別の家計貯蓄",
    dashboardDescription: "2人以上世帯の貯蓄現在高で見る都道府県ランキング。県民所得ランキングとは違う地域が上位に来る、意外性のあるデータです。",
    rankingTitle: "貯蓄額が多い都道府県ランキング（全47都道府県）",
    rankingDescription: "都道府県別の貯蓄現在高ランキング。愛知県・奈良県・兵庫県が上位です。"
  }
};
