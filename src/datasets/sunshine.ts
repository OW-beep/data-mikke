import { DatasetConfig } from "@/types/data";

export const sunshine: DatasetConfig = {
  id: "sunshine",
  title: "年間日照時間",
  category: "気候",
  unit: "時間",
  source: "気象庁観測データ",
  frequency: "年1回",
  chart: "bar",
  ranking: true,
  compare: true,
  providerId: "manual-sunshine",
  description: "都道府県別の年間日照時間。埼玉県・群馬県・山梨県のような内陸の県が上位、秋田県・鳥取県のような日本海側の県が下位。",
  seo: {
    dashboardTitle: "日照時間ランキング｜都道府県別の晴れの多さ",
    dashboardDescription: "都道府県別の年間日照時間ランキング。沖縄県ではなく埼玉県がトップという意外な結果です。",
    rankingTitle: "日照時間が長い都道府県ランキング（全47都道府県）",
    rankingDescription: "都道府県別の年間日照時間ランキング。埼玉県・群馬県・山梨県が上位です。"
  }
};
