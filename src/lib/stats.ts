/**
 * 都道府県横断のデータセット同士を統計的に比較するための、汎用ユーティリティ。
 * ハードコードされた数値ではなく、その時点の実データから毎回計算することを想定している。
 */

/** ピアソンの積率相関係数。areaCodeをキーに持つ2つのMapから、共通するareaCodeだけを使って計算する */
export function pearsonCorrelation(a: Map<string, number>, b: Map<string, number>): { r: number; n: number } | null {
  const codes = [...a.keys()].filter((c) => b.has(c));
  const n = codes.length;
  if (n < 3) return null; // サンプルサイズが小さすぎる場合は計算しない

  const xs = codes.map((c) => a.get(c)!);
  const ys = codes.map((c) => b.get(c)!);
  const mx = xs.reduce((s, v) => s + v, 0) / n;
  const my = ys.reduce((s, v) => s + v, 0) / n;
  const cov = xs.reduce((s, x, i) => s + (x - mx) * (ys[i] - my), 0);
  const sx = Math.sqrt(xs.reduce((s, x) => s + (x - mx) ** 2, 0));
  const sy = Math.sqrt(ys.reduce((s, y) => s + (y - my) ** 2, 0));
  if (sx === 0 || sy === 0) return null;

  return { r: cov / (sx * sy), n };
}

/** 中央値。平均値と違い、一部の突出した値（外れ値）に引っ張られにくい */
export function median(values: number[]): number | null {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}

/** 変動係数（標準偏差 ÷ 平均）。単位や桁数が違う指標同士でも「相対的なばらつきの大きさ」を比較できる */
export function coefficientOfVariation(values: number[]): number | null {
  const n = values.length;
  if (n < 2) return null;
  const mean = values.reduce((s, v) => s + v, 0) / n;
  if (mean === 0) return null;
  const variance = values.reduce((s, v) => s + (v - mean) ** 2, 0) / n;
  return Math.sqrt(variance) / Math.abs(mean);
}

/** 相関係数の強さを大まかに言葉で表す（あくまで目安） */
export function describeCorrelationStrength(r: number): string {
  const abs = Math.abs(r);
  if (abs >= 0.7) return "強い";
  if (abs >= 0.4) return "中程度の";
  if (abs >= 0.2) return "弱い";
  return "ほとんど無い";
}
