/**
 * 都道府県の「健康スコア」。
 *
 * 総合力スコア（lib/composite.ts）と同じ考え方で、生活習慣に関する4つの指標について
 * 全国の中央値と比べて「良い方向」にあるかどうかを数えるだけの、簡易的な独自集計。
 * 学術的な評価指標ではなく、当サイトが便宜的に定義したものであることをページ上に明記する。
 *
 * BMIは「高い/低いのどちらが良いか」を一律に言えない指標のため、このスコアには含めていない
 * （ダッシュボード・ランキング・比較では通常の指標として利用できる）。
 *
 * direction: "up"   = 値が高いほど良い方向とみなす
 *            "down" = 値が低いほど良い方向とみなす
 */
export const HEALTH_COMPOSITE_METRICS: { datasetId: string; direction: "up" | "down" }[] = [
  { datasetId: "vegetableIntake", direction: "up" }, // 野菜摂取量は多いほど良好
  { datasetId: "saltIntake", direction: "down" }, // 食塩摂取量は少ないほど良好
  { datasetId: "steps", direction: "up" }, // 歩数は多いほど良好
  { datasetId: "smokingRate", direction: "down" } // 喫煙率は低いほど良好
];

export function healthCompositeComment(score: number, total: number): string {
  const ratio = score / total;
  if (ratio >= 0.75) {
    return "4つの指標のうち多くで全国の中央値より良好な方向にあり、生活習慣の面で優等生タイプの都道府県といえます。";
  }
  if (ratio >= 0.5) {
    return "全国の中央値より良好な指標がやや多く、生活習慣の面でバランスの取れた都道府県です。";
  }
  if (ratio > 0.25) {
    return "全国の中央値より良好な指標と、そうでない指標がほぼ半々で、指標によって傾向が分かれています。";
  }
  return "4つの指標のうち多くで全国の中央値を下回る方向にあり、生活習慣の面では改善余地の大きい都道府県といえます。";
}
