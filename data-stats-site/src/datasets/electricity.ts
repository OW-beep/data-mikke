import { DatasetConfig } from "@/types/data";

export const electricity: DatasetConfig = {
  id: "electricity",
  title: "電灯使用電力量",
  category: "エネルギー",
  unit: "百万kWh",
  source: "資源エネルギー庁「電力調査統計」",
  frequency: "年1回",
  chart: "bar",
  ranking: true,
  compare: true,
  providerId: "manual-electricity",
  description: "都道府県別の電灯使用電力量（家庭・商店等で使われる電力の合計）。"
};
