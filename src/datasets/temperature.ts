import { DatasetConfig } from "@/types/data";

export const temperature: DatasetConfig = {
  id: "temperature",
  title: "年平均気温",
  category: "気候",
  unit: "℃",
  source: "総務省統計局「統計でみる都道府県のすがた」（気象庁観測データ）",
  frequency: "年1回",
  chart: "bar",
  ranking: true,
  compare: true,
  providerId: "manual-temperature",
  description: "都道府県庁所在地の年平均気温。沖縄県が23.7℃で最も高く、北海道が10.2℃で最も低い。",
  seo: {
    dashboardTitle: "年平均気温ランキング｜都道府県別の暑い県・寒い県",
    dashboardDescription: "都道府県庁所在地の年平均気温ランキング。沖縄県が最も暑く、北海道が最も寒いという結果です。",
    rankingTitle: "年間平均気温が高い都道府県ランキング（全47都道府県）",
    rankingDescription: "都道府県庁所在地の年平均気温ランキング。沖縄県・鹿児島県・宮崎県が上位です。"
  }
};
