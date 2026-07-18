import { DatasetConfig } from "@/types/data";

export const childrenRatio: DatasetConfig = {
  id: "childrenRatio",
  title: "年少人口割合",
  category: "人口",
  unit: "%",
  source: "総務省統計局「人口推計」",
  frequency: "年1回",
  chart: "line",
  ranking: true,
  compare: true,
  providerId: "estat-children-ratio",
  description: "都道府県別の年少人口割合（15歳未満人口が総人口に占める割合）。"
};
