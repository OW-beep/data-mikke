import { DatasetConfig } from "@/types/data";

export const trafficAccident: DatasetConfig = {
  id: "trafficAccident",
  title: "交通事故死者数（人口10万人あたり）",
  category: "治安",
  unit: "人/10万人",
  source: "警察庁「交通事故統計」",
  frequency: "年1回",
  chart: "bar",
  ranking: true,
  compare: true,
  providerId: "manual-traffic-accident",
  description: "都道府県別の人口10万人あたり交通事故死者数。自動車所有率が高い地方の県ほど高くなる傾向がある。",
  seo: {
    dashboardTitle: "交通事故死者数ランキング｜都道府県別の交通安全度",
    dashboardDescription: "人口10万人あたりの交通事故死者数で見る都道府県ランキング。香川県・高知県が上位、東京都が最下位という結果です。",
    rankingTitle: "交通事故死者数が多い都道府県ランキング（人口10万人あたり）",
    rankingDescription: "都道府県別の人口10万人あたり交通事故死者数ランキング。自動車所有率との関連が深い指標です。"
  }
};
