import { DatasetConfig } from "@/types/data";

export const minimumWage: DatasetConfig = {
  id: "minimumWage",
  title: "最低賃金（2026年度答申額）",
  category: "経済",
  unit: "円/時",
  source: "各都道府県労働局・厚生労働省（令和8年度地域別最低賃金、2026年9月4日時点の答申額）",
  frequency: "年1回",
  chart: "bar",
  ranking: true,
  compare: true,
  providerId: "manual-minimum-wage",
  description:
    "2026年度（令和8年度）の地域別最低賃金、都道府県労働局の答申額。官報公示前の値で、発効日は都道府県により2026年10月1日〜12月2日の間で異なる。全国加重平均は1,177円。",
  seo: {
    dashboardTitle: "2026年度 最低賃金ランキング｜あなたの県はいくら？",
    dashboardDescription:
      "2026年度（令和8年度）の都道府県別最低賃金答申額をランキングで確認。全国加重平均1,177円、東京都1,280円など、47都道府県を比較できます。",
    rankingTitle: "最低賃金ランキング2026（都道府県別・令和8年度答申額）",
    rankingDescription:
      "2026年度の地域別最低賃金を都道府県別にランキング。東京都1,280円から高知・宮崎・沖縄の1,085〜1,086円まで、47都道府県の答申額を高い順に比較できます。"
  }
};
