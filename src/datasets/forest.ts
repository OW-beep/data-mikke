import { DatasetConfig } from "@/types/data";

export const forest: DatasetConfig = {
  id: "forest",
  title: "森林率",
  category: "国土",
  unit: "%",
  source: "林野庁「都道府県別森林率・人工林率」",
  frequency: "5年に1回",
  chart: "bar",
  ranking: true,
  compare: true,
  providerId: "manual-forest",
  description: "都道府県別の国土面積に占める森林面積の割合。高知県が83.8%で全国トップ、大阪府が30.0%で最下位。",
  seo: {
    dashboardTitle: "森林率ランキング｜都道府県別の緑豊かさ",
    dashboardDescription: "国土面積に占める森林の割合で見る都道府県ランキング。高知県・岐阜県・長野県が上位、大阪府・千葉県・埼玉県が下位です。",
    rankingTitle: "森林率が高い都道府県ランキング（全47都道府県）",
    rankingDescription: "都道府県別の森林率ランキング。高知県が全国トップの83.8%です。"
  }
};
