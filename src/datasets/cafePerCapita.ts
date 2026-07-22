import { DatasetConfig } from "@/types/data";

export const cafePerCapita: DatasetConfig = {
  id: "cafePerCapita",
  title: "人口10万人あたり喫茶店の軒数",
  category: "観光文化",
  unit: "軒/10万人",
  source: "当サイト独自算出（喫茶店の軒数 ÷ 人口）",
  frequency: "年数回",
  chart: "bar",
  ranking: true,
  compare: true,
  providerId: "computed-cafe-per-capita",
  description: "喫茶店の軒数を人口で調整した当サイト独自の指標。総数トップの東京都に代わり、長野県が全国トップに立つ「隠れた喫茶店王国」を示す。",
  seo: {
    dashboardTitle: "喫茶店密度ランキング｜長野県が『喫茶店王国』な理由",
    dashboardDescription: "人口あたりの喫茶店数で見ると、総数トップの東京都ではなく長野県が1位に。喫茶店文化の地域差が見えてきます。",
    rankingTitle: "人口あたり喫茶店が多い都道府県ランキング",
    rankingDescription: "都道府県別の人口10万人あたり喫茶店数ランキング。長野県が全国トップの水準です。"
  }
};
