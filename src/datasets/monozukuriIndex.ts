import { DatasetConfig } from "@/types/data";

export const monozukuriIndex: DatasetConfig = {
  id: "monozukuriIndex",
  title: "ものづくり・堅実度指数",
  category: "二次分析",
  unit: "指数",
  source: "当サイト独自算出（20指標を主成分分析、第2主成分・寄与率16.8%）",
  frequency: "不定期（再計算時のみ更新）",
  chart: "bar",
  ranking: true,
  compare: true,
  providerId: "manual-monozukuri-index",
  description:
    "製造品出荷額・貯蓄額・持ち家率・日照時間などをまとめて標準化し、主成分分析(PCA)で1つの指数に圧縮したもの。プラスが大きいほど製造業・貯蓄・持ち家など「堅実なものづくり県」の性質が強く、マイナスが大きいほど医師数・看護師数・大学数など「医療・教育資源が集中する県」の性質が強い。",
  seo: {
    dashboardTitle: "都道府県 ものづくり・堅実度指数ランキング｜20指標のPCA分析",
    dashboardDescription:
      "製造品出荷額・貯蓄額・持ち家率など20指標を主成分分析(PCA)で合成した独自の「ものづくり・堅実度指数」を都道府県別に比較できます。"
  }
};
