import { DatasetConfig } from "@/types/data";

export const milk: DatasetConfig = {
  id: "milk",
  title: "生乳生産量",
  category: "農林水産",
  unit: "千トン",
  source: "農林水産省「牛乳乳製品統計調査」",
  frequency: "年1回",
  chart: "bar",
  ranking: true,
  compare: true,
  providerId: "manual-milk",
  description: "都道府県別の生乳生産量。北海道が全国の過半を占める、地域差の大きい指標。"
};
