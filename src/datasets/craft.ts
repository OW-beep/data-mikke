import { DatasetConfig } from "@/types/data";

export const craft: DatasetConfig = {
  id: "craft",
  title: "伝統的工芸品の指定数",
  category: "観光文化",
  unit: "品目",
  source: "経済産業省指定データ、一般財団法人伝統的工芸品産業振興協会集計（2025年10月27日現在）",
  frequency: "不定期（指定の都度更新）",
  chart: "bar",
  ranking: true,
  compare: true,
  providerId: "manual-craft",
  description: "経済産業大臣が指定する「伝統的工芸品」の都道府県別の指定数。",
  seo: {
    dashboardTitle: "伝統的工芸品の指定数ランキング｜都道府県別データ",
    dashboardDescription: "都道府県ごとの伝統的工芸品の指定数を比較できます。東京都が23品目で全国最多です。",
    rankingTitle: "伝統的工芸品の指定数が多い都道府県ランキング（全47都道府県）",
    rankingDescription: "都道府県別の伝統的工芸品指定数ランキング。出典: 経済産業省。"
  }
};
