import type { DataPoint } from "@/types/data";

/**
 * 上位5県・下位5県の横棒グラフを、サーバー側でSVGとして描画する。
 * JavaScriptが動かない環境（検索エンジンのクローラーなど）でも、図と値が読めるようにするための静的な図。
 * 値は、同じ記事の表・ランキングと同じデータから作る。
 */
export function StaticRankFigure({
  title,
  unit,
  rows
}: {
  title: string;
  unit: string;
  rows: DataPoint[];
}) {
  if (rows.length < 10) return null;
  const top = rows.slice(0, 5);
  const bottom = rows.slice(-5).reverse();
  const all = [...top, ...bottom];
  const max = Math.max(...all.map((r) => r.value), 0);
  const min = Math.min(...all.map((r) => r.value), 0);
  const span = max - min || 1;
  const year = rows[0]?.year;

  const W = 640;
  const labelW = 92;
  const valueW = 110;
  const barMax = W - labelW - valueW - 12;
  const rowH = 26;
  const gap = 18;
  const H = 5 * rowH + gap + 5 * rowH + 40;

  const fmt = (v: number) =>
    Math.abs(v) >= 1000 ? v.toLocaleString("ja-JP", { maximumFractionDigits: 0 }) : v.toLocaleString("ja-JP", { maximumFractionDigits: 2 });

  const bar = (r: DataPoint, y: number, color: string) => {
    const w = Math.max(2, ((r.value - Math.min(min, 0)) / (max - Math.min(min, 0) || 1)) * barMax);
    return (
      <g key={`${r.areaCode}-${y}`}>
        <text x={labelW - 8} y={y + 17} textAnchor="end" fontSize="13" fill="currentColor">
          {r.areaName}
        </text>
        <rect x={labelW} y={y + 3} width={w} height={rowH - 8} rx={3} fill={color} />
        <text x={labelW + w + 6} y={y + 17} fontSize="13" fill="currentColor">
          {fmt(r.value)}
          {unit}
        </text>
      </g>
    );
  };

  void span;
  const desc =
    `${title}（${year ?? ""}年）の上位5県は、` +
    top.map((r) => `${r.areaName}${fmt(r.value)}${unit}`).join("、") +
    "。下位5県は、" +
    bottom.map((r) => `${r.areaName}${fmt(r.value)}${unit}`).join("、") +
    "です。";

  return (
    <figure className="dm-figure">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-labelledby="fig-title fig-desc" style={{ width: "100%", height: "auto" }}>
        <title id="fig-title">{`${title} 上位5県と下位5県`}</title>
        <desc id="fig-desc">{desc}</desc>
        <text x={0} y={14} fontSize="12" fill="#6f7669">
          上位5県
        </text>
        {top.map((r, i) => bar(r, 20 + i * rowH, "#0f8c6c"))}
        <text x={0} y={20 + 5 * rowH + 14} fontSize="12" fill="#6f7669">
          下位5県
        </text>
        {bottom.map((r, i) => bar(r, 20 + 5 * rowH + gap + 8 + i * rowH, "#e4572e"))}
      </svg>
      <figcaption>
        図：{title}の上位5県と下位5県{year ? `（${year}年）` : ""}。全47都道府県の値は、ランキングページで確認できます。
      </figcaption>
    </figure>
  );
}
