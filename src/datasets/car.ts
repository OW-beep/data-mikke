import { DatasetConfig } from "@/types/data";

export const car: DatasetConfig = {
  id: "car",
  title: "自動車所有数量（1千世帯あたり）",
  category: "交通",
  unit: "台/千世帯",
  source: "総務省統計局「全国消費実態調査」集計",
  frequency: "5年に1回",
  chart: "bar",
  ranking: true,
  compare: true,
  providerId: "manual-car",
  description: "都道府県別の2人以上世帯における1千世帯あたりの自動車所有数量。「車社会」の度合いを示す代表的な指標。",
  seo: {
    dashboardTitle: "自動車保有率ランキング｜都道府県別マイカー所有率",
    dashboardDescription: "1千世帯あたりの自動車所有数量で見る、都道府県別の車社会度ランキング。東京都と地方の差が際立ちます。",
    rankingTitle: "車を多く持つ都道府県ランキング（1千世帯あたり）",
    rankingDescription: "都道府県別の自動車所有数量ランキング。山形県・福井県・富山県が上位、東京都が最下位です。"
  }
};
