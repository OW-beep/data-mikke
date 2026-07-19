import { DatasetConfig } from "@/types/data";

export const manufacturingPerCapita: DatasetConfig = {
  id: "manufacturingPerCapita",
  title: "1人あたり製造品出荷額",
  category: "工業",
  unit: "百万円/人",
  source: "当サイト独自算出（製造品出荷額等 ÷ 人口）",
  frequency: "年1回",
  chart: "bar",
  ranking: true,
  compare: true,
  providerId: "computed-manufacturing-per-capita",
  description: "製造品出荷額等を人口で調整した当サイト独自の指標。工業の「規模」ではなく「生産性・集約度」を示す。"
};
