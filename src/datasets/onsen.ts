import { DatasetConfig } from "@/types/data";

export const onsen: DatasetConfig = {
  id: "onsen",
  title: "温泉地の数",
  category: "観光文化",
  unit: "か所",
  source: "環境省「令和4年度温泉利用状況」（令和5年3月末現在）",
  frequency: "年1回",
  chart: "bar",
  ranking: true,
  compare: true,
  providerId: "manual-onsen",
  description: "都道府県別の温泉地（宿泊施設のある温泉地）の数。",
  seo: {
    dashboardTitle: "温泉地の数ランキング｜都道府県別データ",
    dashboardDescription: "都道府県ごとの温泉地の数を比較できます。北海道・長野県・新潟県が上位です。",
    rankingTitle: "温泉地が多い都道府県ランキング（全47都道府県）",
    rankingDescription: "都道府県別の温泉地数ランキング。出典: 環境省「温泉利用状況」。"
  }
};
