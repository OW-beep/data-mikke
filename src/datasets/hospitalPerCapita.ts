import { DatasetConfig } from "@/types/data";

export const hospitalPerCapita: DatasetConfig = {
  id: "hospitalPerCapita",
  title: "人口10万人あたり病院数",
  category: "医療",
  unit: "施設/10万人",
  source: "当サイト独自算出（病院数 ÷ 人口 × 10万）",
  frequency: "年1回",
  chart: "bar",
  ranking: true,
  compare: true,
  providerId: "computed-hospital-per-capita",
  description:
    "都道府県別の人口10万人あたり病院数。病院数を人口規模で調整した、当サイト独自のオリジナル指標。",
  seo: {
    dashboardTitle: "人口10万人あたり病院数ランキング｜医療アクセスの都道府県比較",
    dashboardDescription:
      "病院数を人口規模で調整した「人口10万人あたり病院数」の都道府県ランキング。単純な病院数ランキングとは異なる、医療アクセスの実態が見えます。",
    rankingTitle: "医療アクセスが良い都道府県ランキング（人口10万人あたり病院数）",
    rankingDescription: "人口10万人あたりの病院数で見た、都道府県別の医療アクセスランキング。"
  }
};
