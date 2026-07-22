import { DatasetConfig } from "@/types/data";

export const cafe: DatasetConfig = {
  id: "cafe",
  title: "喫茶店の軒数",
  category: "観光文化",
  unit: "軒",
  source: "厚生労働省「衛生行政報告例」集計",
  frequency: "年数回",
  chart: "bar",
  ranking: true,
  compare: true,
  providerId: "manual-cafe",
  description: "都道府県別の喫茶店の軒数。",
  seo: {
    dashboardTitle: "喫茶店の軒数ランキング｜都道府県別カフェ文化",
    dashboardDescription: "都道府県ごとの喫茶店の軒数を比較できます。愛知県・岐阜県など「喫茶店文化」が根付く地域の実態が見えます。",
    rankingTitle: "喫茶店が多い都道府県ランキング（全47都道府県）",
    rankingDescription: "都道府県別の喫茶店の軒数ランキング。東京都・愛知県・大阪府が上位です。"
  }
};
