import { DatasetConfig } from "@/types/data";

export const agingRatio: DatasetConfig = {
  id: "agingRatio",
  title: "高齢化率",
  category: "人口",
  unit: "%",
  source: "総務省統計局「人口推計」",
  frequency: "年1回",
  chart: "line",
  ranking: true,
  compare: true,
  providerId: "estat-aging-ratio",
  description: "都道府県別の高齢化率（65歳以上人口が総人口に占める割合）。"
};
