import { DatasetConfig } from "@/types/data";

export const universityPerCapita: DatasetConfig = {
  id: "universityPerCapita",
  title: "人口10万人あたり大学数",
  category: "教育",
  unit: "校/10万人",
  source: "当サイト独自算出（大学数 ÷ 人口 × 10万）",
  frequency: "年1回",
  chart: "bar",
  ranking: true,
  compare: true,
  providerId: "computed-university-per-capita",
  description: "大学数を人口で調整した当サイト独自の指標。総数トップの東京都に代わり、京都府が全国トップに立つ。",
  seo: {
    dashboardTitle: "人口あたり大学数ランキング｜京都が東京を抑えて1位の理由",
    dashboardDescription: "大学数を人口で調整した「人口10万人あたり大学数」の都道府県ランキング。学生街としての集積度が見えてきます。",
    rankingTitle: "大学の集積度が高い都道府県ランキング（人口10万人あたり）",
    rankingDescription: "都道府県別の人口あたり大学数ランキング。京都府が全国トップの集積度を誇ります。"
  }
};
