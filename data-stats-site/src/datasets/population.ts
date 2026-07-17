import { DatasetConfig } from "@/types/data";

export const population: DatasetConfig = {
  id: "population",
  title: "人口",
  category: "人口",
  unit: "人",
  source: "e-Stat",
  frequency: "年1回",
  chart: "line",
  ranking: true,
  compare: true,
  providerId: "estat-population",
  description: "都道府県別の総人口の推移。"
};
