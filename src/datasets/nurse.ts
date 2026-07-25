import { DatasetConfig } from "@/types/data";

export const nurse: DatasetConfig = {
  id: "nurse",
  title: "人口10万人あたり看護師数",
  category: "医療",
  unit: "人/10万人",
  source: "厚生労働省「衛生行政報告例」",
  frequency: "2年に1回",
  chart: "bar",
  ranking: true,
  compare: true,
  providerId: "manual-nurse",
  description: "都道府県別の人口10万人あたり看護師数。高知県・鹿児島県・長崎県など九州・四国の県が上位。医師数とは異なる分布を示す。",
  seo: {
    dashboardTitle: "看護師数ランキング｜都道府県別の看護師配置数",
    dashboardDescription: "人口10万人あたりの看護師数で見る都道府県ランキング。高知県が全国トップ、埼玉県が最下位です。",
    rankingTitle: "看護師が多い都道府県ランキング（人口10万人あたり）",
    rankingDescription: "都道府県別の人口10万人あたり看護師数ランキング。九州・四国の県が上位に集中しています。"
  }
};
