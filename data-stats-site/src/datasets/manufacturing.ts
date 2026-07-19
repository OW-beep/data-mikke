import { DatasetConfig } from "@/types/data";

export const manufacturing: DatasetConfig = {
  id: "manufacturing",
  title: "製造品出荷額等",
  category: "工業",
  unit: "百万円",
  source: "経済産業省「工業統計調査」",
  frequency: "年1回",
  chart: "bar",
  ranking: true,
  compare: true,
  providerId: "manual-manufacturing",
  description: "都道府県別の製造品出荷額等。工業の集積度を示す代表的な指標。"
};
