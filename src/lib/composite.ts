/**
 * 都道府県の「総合力」スコア。
 *
 * 経済基盤・生活基盤としての厚みを示す5つの指標について、
 * 全国の中央値と比べて「良い方向」にあるかどうかを数えるだけの、シンプルな独自集計。
 * 学術的な評価指標ではなく、当サイトが便宜的に定義したものであることを
 * ページ上に明記した上で表示する。
 *
 * direction: "up"   = 値が高いほど平均より良い方向とみなす
 *            "down" = 値が低いほど平均より良い方向とみなす
 */
export const COMPOSITE_METRICS: { datasetId: string; direction: "up" | "down" }[] = [
  { datasetId: "income", direction: "up" }, // 県民所得は高いほど経済的に豊か
  { datasetId: "hospitalPerCapita", direction: "up" }, // 人口あたり病院数は多いほど医療アクセスが良い
  { datasetId: "homeownership", direction: "up" }, // 持ち家比率は高いほど住宅基盤が安定
  { datasetId: "childrenRatio", direction: "up" }, // 年少人口割合は高いほど将来の担い手が多い
  { datasetId: "agingRatio", direction: "down" } // 高齢化率は低いほど現役世代の比率が高い
];

export function compositeComment(score: number, total: number): string {
  const ratio = score / total;
  if (ratio >= 0.8) {
    return "5つの指標のうち多くで全国の中央値を上回っており、経済・生活基盤の面で総合力の高い都道府県といえます。";
  }
  if (ratio >= 0.6) {
    return "全国の中央値を上回る指標がやや多く、経済・生活基盤の面でバランスの取れた都道府県です。";
  }
  if (ratio >= 0.4) {
    return "全国の中央値を上回る指標と下回る指標がほぼ半々で、指標によって強み・弱みが分かれています。";
  }
  return "5つの指標のうち多くで全国の中央値を下回っており、経済・生活基盤の面では課題を抱えやすい都道府県といえます。";
}
