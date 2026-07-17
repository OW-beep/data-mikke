import { DatasetConfig } from "@/types/data";

export const hospital: DatasetConfig = {
  id: "hospital",
  title: "病院数",
  category: "医療",
  unit: "施設",
  source: "厚生労働省",
  frequency: "年1回",
  chart: "bar",
  ranking: true,
  compare: true,
  providerId: "manual-hospital",
  description: "都道府県別の病院数。"
};
