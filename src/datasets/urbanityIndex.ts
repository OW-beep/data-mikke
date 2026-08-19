import { DatasetConfig } from "@/types/data";

export const urbanityIndex: DatasetConfig = {
  id: "urbanityIndex",
  title: "都市度指数",
  category: "二次分析",
  unit: "指数",
  source: "当サイト独自算出（20指標を主成分分析、第1主成分・寄与率31.9%）",
  frequency: "不定期（再計算時のみ更新）",
  chart: "bar",
  ranking: true,
  compare: true,
  providerId: "manual-urbanity-index",
  description:
    "県民所得・平均年収・家賃・人口密度・犯罪率など「都市集積型」の指標をまとめて標準化し、主成分分析(PCA)で1つの指数に圧縮したもの。プラスが大きいほど都市集積・高所得の性質が強く、マイナスが大きいほど森林率・持ち家率などの地方型の性質が強い。",
  seo: {
    dashboardTitle: "都道府県 都市度指数ランキング｜20指標のPCA分析",
    dashboardDescription:
      "所得・家賃・人口密度・犯罪率など20指標を主成分分析(PCA)で合成した独自の「都市度指数」を都道府県別に比較できます。"
  }
};
