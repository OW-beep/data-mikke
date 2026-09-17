import { DatasetConfig } from "@/types/data";

export const costIndex: DatasetConfig = {
  id: "costIndex",
  title: "生活費指数（物価水準）",
  category: "生活費",
  unit: "円（19品目の合計）",
  source: "総務省統計局「小売物価統計調査」（2025年）をもとに当サイトが算出",
  frequency: "年1回",
  chart: "bar",
  ranking: true,
  compare: true,
  providerId: "computed-cost-index",
  description:
    "家賃・電気代・都市ガス代・水道料・ガソリン・理髪料・クリーニング代と、米・食パン・卵・牛乳などの主要食料品を合わせた19品目の価格を合計した、当サイト独自の物価水準の目安。数値が小さいほど物価が安い都道府県です。",
  seo: {
    dashboardTitle: "都道府県の物価ランキング｜生活費が安い県・高い県",
    dashboardDescription:
      "家賃・光熱費・食料品など19品目の価格から算出した、都道府県別の物価・生活費水準。物価が安い県、高い県を47都道府県のランキングで比較できます。",
    rankingTitle: "物価が安い県ランキング（都道府県別・生活費指数）",
    rankingDescription:
      "都道府県別の物価・生活費の安さランキング。家賃・電気代・ガソリン・食料品など19品目の合計額で、47都道府県を安い順に比較できます。"
  }
};
