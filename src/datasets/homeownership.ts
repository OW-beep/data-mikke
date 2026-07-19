import { DatasetConfig } from "@/types/data";

export const homeownership: DatasetConfig = {
  id: "homeownership",
  title: "持ち家比率",
  category: "住宅",
  unit: "%",
  source: "総務省統計局「社会生活統計指標－都道府県の指標－」",
  frequency: "5年に1回（住宅・土地統計調査）",
  chart: "line",
  ranking: true,
  compare: true,
  providerId: "manual-homeownership",
  description: "都道府県別の持ち家比率（居住世帯のある住宅のうち持ち家の割合）。2003〜2018年の推移。"
};
