import { DatasetConfig } from "@/types/data";

export const livability: DatasetConfig = {
  id: "livability",
  title: "都道府県 総合力スコア",
  category: "総合",
  unit: "点（5点満点）",
  source: "当サイト独自算出（5指標の合成スコア）",
  frequency: "算出のたび更新",
  chart: "bar",
  ranking: true,
  compare: true,
  providerId: "computed-livability",
  description:
    "県民所得・人口10万人あたり病院数・持ち家比率・年少人口割合・高齢化率の5指標のうち、全国平均より良い方向にある指標の数を合成した当サイト独自の総合力スコア。",
  seo: {
    dashboardTitle: "都道府県の住みやすさランキング｜5指標で採点した総合力スコア",
    dashboardDescription:
      "県民所得・医療アクセス・持ち家比率・子どもの割合・高齢化率の5指標から算出した、都道府県の住みやすさ・総合力スコア。47都道府県のスコアと推移をランキングで比較できます。",
    rankingTitle: "都道府県 住みやすさランキング（総合力スコア・全47都道府県）",
    rankingDescription:
      "都道府県の住みやすさを5つの指標で採点した、当サイト独自の総合力スコアランキング。上位・下位の都道府県と、その内訳を確認できます。"
  }
};
