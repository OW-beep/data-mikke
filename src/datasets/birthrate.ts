import { DatasetConfig } from "@/types/data";

export const birthrate: DatasetConfig = {
  id: "birthrate",
  title: "合計特殊出生率",
  category: "人口",
  unit: "",
  source: "厚生労働省「人口動態統計」",
  frequency: "年1回",
  chart: "line",
  ranking: true,
  compare: true,
  providerId: "estat-birthrate",
  description: "都道府県別の合計特殊出生率（1人の女性が生涯に産む子どもの数の推計値）。"
};
