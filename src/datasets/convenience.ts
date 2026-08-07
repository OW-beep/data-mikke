import { DatasetConfig } from "@/types/data";

export const convenience: DatasetConfig = {
  id: "convenience",
  title: "コンビニエンスストアの店舗数",
  category: "経済",
  unit: "店",
  source: "経済産業省「商業動態統計調査 確報」（都道府県別店舗数）",
  frequency: "年1回（確報）",
  chart: "bar",
  ranking: true,
  compare: true,
  providerId: "estat-convenience",
  description: "都道府県別のコンビニエンスストア店舗数。e-Stat APIから自動取得。",
  seo: {
    dashboardTitle: "コンビニエンスストア店舗数ランキング｜都道府県別データ",
    dashboardDescription: "都道府県ごとのコンビニエンスストア店舗数を比較できます。出典: 経済産業省「商業動態統計調査」。",
    rankingTitle: "コンビニの店舗数が多い都道府県ランキング（全47都道府県）",
    rankingDescription: "都道府県別のコンビニエンスストア店舗数ランキング。出典: 経済産業省「商業動態統計調査」。"
  }
};
