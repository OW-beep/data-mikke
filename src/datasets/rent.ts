import { DatasetConfig } from "@/types/data";

export const rent: DatasetConfig = {
  id: "rent",
  title: "家賃（1ヶ月・1坪あたり）",
  category: "住宅",
  unit: "円",
  source: "総務省統計局「小売物価統計調査」",
  frequency: "年1回",
  chart: "bar",
  ranking: true,
  compare: true,
  providerId: "manual-rent",
  description: "都道府県別の家賃相場（1ヶ月・1坪あたり）。東京都が8,806円で圧倒的に高く、青森県が3,163円で最も安い。",
  seo: {
    dashboardTitle: "家賃相場ランキング｜都道府県別の住居費",
    dashboardDescription: "1坪・1ヶ月あたりの家賃で見る都道府県ランキング。東京都が突出して高く、地方との差は2.8倍にのぼります。",
    rankingTitle: "家賃が高い都道府県ランキング（全47都道府県）",
    rankingDescription: "都道府県別の家賃相場ランキング。東京都・京都府・神奈川県が上位です。"
  }
};
