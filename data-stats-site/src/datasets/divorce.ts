import { DatasetConfig } from "@/types/data";

export const divorce: DatasetConfig = {
  id: "divorce",
  title: "離婚率",
  category: "人口",
  unit: "‰（人口千対）",
  source: "厚生労働省「人口動態統計」",
  frequency: "年1回",
  chart: "line",
  ranking: true,
  compare: true,
  providerId: "estat-divorce",
  description: "都道府県別の離婚率（人口千人あたりの離婚件数）。"
};
