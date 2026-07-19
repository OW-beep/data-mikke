import { DatasetConfig } from "@/types/data";

export const crime: DatasetConfig = {
  id: "crime",
  title: "犯罪発生件数（人口千人あたり）",
  category: "治安",
  unit: "件/千人",
  source: "警察庁「犯罪統計」",
  frequency: "年1回",
  chart: "bar",
  ranking: true,
  compare: true,
  providerId: "manual-crime",
  description: "都道府県別の人口1千人あたり刑法犯認知件数。殺人・強盗などを含む刑法犯全体の発生率。"
};
