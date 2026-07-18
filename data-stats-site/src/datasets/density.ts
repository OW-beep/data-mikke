import { DatasetConfig } from "@/types/data";

export const density: DatasetConfig = {
  id: "density",
  title: "人口密度",
  category: "人口",
  unit: "人/km²",
  source: "当サイト独自算出（人口 ÷ 面積）",
  frequency: "年1回",
  chart: "line",
  ranking: true,
  compare: true,
  providerId: "computed-density",
  description: "都道府県別の人口密度。人口データと面積データから当サイトが独自に算出したオリジナル指標。"
};
