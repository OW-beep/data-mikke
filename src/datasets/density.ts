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
  description: "都道府県別の人口密度。人口データと面積データから当サイトが独自に算出したオリジナル指標。",
  seo: {
    dashboardTitle: "都道府県別 人口密度ランキング・推移グラフ",
    dashboardDescription:
      "都道府県別の人口密度を、人口÷面積で算出。1位〜47位のランキングと、年ごとの推移グラフで確認できます。",
    rankingTitle: "人口密度が高い都道府県ランキング（全47都道府県）",
    rankingDescription: "都道府県別の人口密度を1位から47位まで比較できるランキング。人口の多さとは異なる顔ぶれが見えます。"
  }
};
