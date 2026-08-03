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

/** 表示用に数値を整形する。整数はカンマ区切り、小数は小数点以下2桁までに丸める */
export function formatStatValue(value: number): string {
  if (Number.isInteger(value)) return value.toLocaleString("ja-JP");
  return value.toLocaleString("ja-JP", { maximumFractionDigits: 2 });
}

/**
 * ランキングページ・ダッシュボードページ用に、テーブルだけでは伝わらない
 * 「1位と最下位の差」「中央値との比較」を、実データから毎回計算して1〜2文の日本語にする。
 * ハードコードされたコメントではなく、その時点のデータに応じて内容が変わる。
 */
export function buildRankingInsight(
  ranked: { areaName: string; value: number }[],
  unit: string
): string {
  if (ranked.length < 2) return "";

  const top = ranked[0];
  const bottom = ranked[ranked.length - 1];
  const values = ranked.map((p) => p.value);
  const med = median(values);

  const sentences: string[] = [];

  sentences.push(
    `1位は${top.areaName}（${formatStatValue(top.value)}${unit}）、最下位は${bottom.areaName}（${formatStatValue(
      bottom.value
    )}${unit}）です。`
  );

  if (bottom.value > 0 && top.value !== bottom.value) {
    const ratio = top.value / bottom.value;
    const ratioText = ratio >= 10 ? ratio.toFixed(0) : ratio.toFixed(1);
    const gapComment = ratio >= 3 ? "都道府県による差が大きい指標です。" : "都道府県による差は比較的小さい指標です。";
    sentences.push(`1位と最下位の差は約${ratioText}倍で、${gapComment}`);
  }

  if (med !== null && med > 0 && top.value !== med) {
    const ratioToMedian = top.value / med;
    sentences.push(
      `全国の中央値は${formatStatValue(med)}${unit}で、${top.areaName}はその約${ratioToMedian.toFixed(1)}倍にあたります。`
    );
  }

  return sentences.join("");
}
