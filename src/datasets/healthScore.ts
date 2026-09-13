import { DatasetConfig } from "@/types/data";

export const healthScore: DatasetConfig = {
  id: "healthScore",
  title: "都道府県 健康スコア",
  category: "健康",
  unit: "点（4点満点）",
  source: "当サイト独自算出（4指標の合成スコア）",
  frequency: "算出のたび更新",
  chart: "bar",
  ranking: true,
  compare: true,
  providerId: "computed-health-score",
  description:
    "野菜摂取量・食塩摂取量・歩数・喫煙率（男性）の4指標のうち、全国の中央値より良い方向にある指標の数を合成した当サイト独自の健康スコア。",
  seo: {
    dashboardTitle: "都道府県の健康優等生ランキング｜生活習慣4指標で採点",
    dashboardDescription:
      "野菜摂取量・食塩摂取量・歩数・喫煙率の4指標から算出した、都道府県の健康スコア。47都道府県のスコアをランキングで比較できます。",
    rankingTitle: "都道府県 健康スコアランキング（全47都道府県）",
    rankingDescription: "生活習慣に関する4指標を採点した、当サイト独自の健康スコアランキング。上位・下位の都道府県を確認できます。"
  }
};
