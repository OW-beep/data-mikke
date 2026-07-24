import { DatasetConfig } from "@/types/data";

export const doctor: DatasetConfig = {
  id: "doctor",
  title: "人口10万人あたり医師数",
  category: "医療",
  unit: "人/10万人",
  source: "厚生労働省「医師・歯科医師・薬剤師統計」",
  frequency: "2年に1回",
  chart: "bar",
  ranking: true,
  compare: true,
  providerId: "manual-doctor",
  description: "都道府県別の人口10万人あたり医師数。「西高東低」の分布で知られ、医学部の分布と関連が深い指標。",
  seo: {
    dashboardTitle: "医師数ランキング｜都道府県別の医療充実度(西高東低)",
    dashboardDescription: "人口10万人あたりの医師数で見る都道府県ランキング。徳島県・東京都・京都府が上位、埼玉県・茨城県・千葉県が下位という「西高東低」の分布が特徴です。",
    rankingTitle: "医師が多い都道府県ランキング（人口10万人あたり）",
    rankingDescription: "都道府県別の人口10万人あたり医師数ランキング。西日本の県が上位に集中しています。"
  }
};
