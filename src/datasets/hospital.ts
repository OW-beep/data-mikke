import { DatasetConfig } from "@/types/data";

export const hospital: DatasetConfig = {
  id: "hospital",
  title: "病院数",
  category: "医療",
  unit: "施設",
  source: "厚生労働省「平成25年医療施設（動態）調査」（2013年10月1日現在）",
  frequency: "年1回",
  chart: "bar",
  ranking: true,
  compare: true,
  providerId: "manual-hospital",
  description: "都道府県別の病院数（2013年10月1日現在）。"
};
