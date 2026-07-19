import { DatasetConfig } from "@/types/data";

export const culturalPropertyPerCapita: DatasetConfig = {
  id: "culturalPropertyPerCapita",
  title: "人口10万人あたり国宝・重要文化財数",
  category: "観光文化",
  unit: "件/10万人",
  source: "当サイト独自算出（国宝・重要文化財数 ÷ 人口 × 10万）",
  frequency: "年数回",
  chart: "bar",
  ranking: true,
  compare: true,
  providerId: "computed-cultural-property-per-capita",
  description:
    "国宝・重要文化財数を人口で調整した当サイト独自の指標。単純な総数ランキングとは異なる顔ぶれが上位に来る。"
};
