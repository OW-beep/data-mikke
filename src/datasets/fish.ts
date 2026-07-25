import { DatasetConfig } from "@/types/data";

export const fish: DatasetConfig = {
  id: "fish",
  title: "海面漁業漁獲量",
  category: "農林水産",
  unit: "千トン",
  source: "農林水産省「漁業・養殖業生産統計」",
  frequency: "年1回",
  chart: "bar",
  ranking: true,
  compare: true,
  providerId: "manual-fish",
  description: "都道府県別の海面漁業漁獲量。北海道が全国の3割近くを占める圧倒的1位。内陸の8県は海に面していないため0。",
  seo: {
    dashboardTitle: "漁獲量ランキング｜都道府県別の海面漁業生産量",
    dashboardDescription: "都道府県ごとの海面漁業漁獲量を比較できます。北海道が全国の3割近くを占め、2位長崎県に3倍以上の差をつけています。",
    rankingTitle: "漁獲量が多い都道府県ランキング（全47都道府県）",
    rankingDescription: "都道府県別の海面漁業漁獲量ランキング。北海道・長崎県・静岡県が上位です。"
  }
};
