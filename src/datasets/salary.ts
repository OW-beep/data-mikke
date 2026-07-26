import { DatasetConfig } from "@/types/data";

export const salary: DatasetConfig = {
  id: "salary",
  title: "平均年収（賃金構造基本統計調査）",
  category: "経済",
  unit: "万円",
  source: "厚生労働省「賃金構造基本統計調査」",
  frequency: "年1回",
  chart: "bar",
  ranking: true,
  compare: true,
  providerId: "manual-salary",
  description: "都道府県別の平均年収（きまって支給する現金給与額×12＋年間賞与その他特別給与額）。県民所得とは異なり、個人の給与実態に近い指標。",
  seo: {
    dashboardTitle: "平均年収ランキング｜都道府県別の給料の実態",
    dashboardDescription: "賃金構造基本統計調査をもとにした都道府県別の平均年収ランキング。東京都が598万円で1位、沖縄県が375万円で最下位です。",
    rankingTitle: "平均年収が高い都道府県ランキング（全47都道府県）",
    rankingDescription: "都道府県別の平均年収ランキング。東京都・神奈川県・大阪府が上位です。"
  }
};
