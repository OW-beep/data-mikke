import { DatasetConfig } from "@/types/data";

export const area: DatasetConfig = {
  id: "area",
  title: "面積",
  category: "国土",
  unit: "km²",
  source: "国土地理院「全国都道府県市区町村別面積調」",
  frequency: "年数回（四半期ごとの公表）",
  chart: "bar",
  ranking: true,
  compare: true,
  providerId: "manual-area",
  description: "都道府県別の面積。"
};
