/**
 * 日本地図（模式図・タイル地図）。
 *
 * 正確な都道府県の形ではなく、47都道府県をタイル状に並べた模式図です。
 * 位置関係はおおまかに地理に沿わせていますが、形・面積・距離は正確では
 * ありません。ページ上にもその旨を明記しています。
 *
 * 軽さのための設計：
 * - 地図ライブラリ不使用、タイル画像不使用、外部フェッチなし。
 * - インラインSVG（約47タイル）のみ。JavaScriptは不要で、リンクは通常の
 *   <a href> のため、JavaScriptが無効でも動作します。
 * - 色の濃さは「全国1位の指標の数」（PrefectureStrength.no1Count）で、
 *   サーバー側で計算済みの値を渡すだけです。
 */
import { PREFECTURES } from "@/lib/prefectures";
import type { PrefectureStrength } from "@/lib/prefectureStrengths";

/**
 * タイルの配置（col, row）。北→南、西→東のおおまかな位置関係。
 * 沖縄は本州から離れているため、左下にずらして配置しています。
 */
export const TILE_POS: Record<string, [number, number]> = {
  hokkaido: [9, 0],
  aomori: [9, 1],
  iwate: [10, 1],
  akita: [8, 2],
  yamagata: [9, 2],
  miyagi: [10, 2],
  fukushima: [9, 3],
  niigata: [8, 3],
  tochigi: [10, 3],
  ibaraki: [11, 3],
  gunma: [9, 4],
  nagano: [8, 4],
  toyama: [7, 4],
  ishikawa: [6, 4],
  saitama: [10, 4],
  chiba: [11, 4],
  yamanashi: [8, 5],
  tokyo: [10, 5],
  kanagawa: [9, 5],
  fukui: [6, 5],
  gifu: [7, 5],
  shizuoka: [8, 6],
  aichi: [7, 6],
  shiga: [6, 6],
  kyoto: [5, 6],
  hyogo: [4, 6],
  tottori: [3, 6],
  shimane: [2, 6],
  mie: [7, 7],
  nara: [6, 7],
  osaka: [5, 7],
  okayama: [3, 7],
  hiroshima: [2, 7],
  yamaguchi: [1, 7],
  wakayama: [6, 8],
  kagawa: [4, 8],
  tokushima: [3, 8],
  ehime: [2, 8],
  fukuoka: [1, 8],
  saga: [0, 8],
  kochi: [3, 9],
  nagasaki: [0, 9],
  kumamoto: [1, 9],
  oita: [2, 9],
  miyazaki: [2, 10],
  kagoshima: [1, 10],
  okinawa: [0, 11],
};

const TILE_W = 46;
const TILE_H = 36;
const GAP = 4;
const CELL_W = TILE_W + GAP;
const CELL_H = TILE_H + GAP;
const COLS = 12;
const ROWS = 12;

function fillFor(no1Count: number): string {
  if (no1Count >= 6) return "#0f8c6c";
  if (no1Count >= 3) return "#5dbb9b";
  if (no1Count >= 1) return "#cfe8d8";
  return "#eef2e4";
}

function textFor(no1Count: number): string {
  return no1Count >= 6 ? "#ffffff" : "#0b3b33";
}

export default function PrefectureMap({
  strengths,
}: {
  strengths: PrefectureStrength[];
}) {
  const no1BySlug = new Map(
    strengths.map((s) => [s.prefecture.slug, s.no1Count])
  );

  return (
    <div>
      <svg
        viewBox={`0 0 ${COLS * CELL_W} ${ROWS * CELL_H}`}
        role="img"
        aria-label="都道府県のタイル地図（模式図）。各タイルをクリックすると、その都道府県の統計ページに移動します。"
        style={{ width: "100%", maxWidth: 600, height: "auto", display: "block" }}
      >
        {PREFECTURES.map((p) => {
          const pos = TILE_POS[p.slug];
          if (!pos) return null;
          const [col, row] = pos;
          const x = col * CELL_W;
          const y = row * CELL_H;
          const no1 = no1BySlug.get(p.slug) ?? 0;
          const strength = strengths.find((s) => s.prefecture.slug === p.slug);
          const label = strength
            ? `${p.name}：最も順位が高いのは「${strength.best.title}」全国${strength.best.rank}位。全国1位の指標は${strength.no1Count}件。`
            : p.name;
          return (
            <a key={p.slug} href={`/prefecture/${p.slug}`}>
              <title>{label}</title>
              <rect
                x={x}
                y={y}
                width={TILE_W}
                height={TILE_H}
                rx={4}
                fill={fillFor(no1)}
                stroke="#ffffff"
                strokeWidth={1}
              />
              <text
                x={x + TILE_W / 2}
                y={y + TILE_H / 2 + 4}
                textAnchor="middle"
                fontSize={p.name.length >= 4 ? 10 : 11}
                fill={textFor(no1)}
              >
                {p.name}
              </text>
            </a>
          );
        })}
      </svg>
      <p className="dm-doc-updated" style={{ marginTop: 8 }}>
        ※ 模式図（タイル地図）です。都道府県の形・面積・距離は正確ではありません。
        沖縄は位置をずらして表示しています。色が濃い県ほど、全国1位の指標が多くあります。
      </p>
      <p className="dm-doc-updated" style={{ marginTop: 4 }}>
        色の見方：
        <span style={{ background: "#eef2e4", border: "1px solid #d8dcc8", padding: "0 6px", margin: "0 2px" }}>全国1位なし</span>
        <span style={{ background: "#cfe8d8", border: "1px solid #d8dcc8", padding: "0 6px", margin: "0 2px" }}>1〜2件</span>
        <span style={{ background: "#5dbb9b", border: "1px solid #d8dcc8", padding: "0 6px", margin: "0 2px" }}>3〜5件</span>
        <span style={{ background: "#0f8c6c", color: "#fff", border: "1px solid #0b5c46", padding: "0 6px", margin: "0 2px" }}>6件以上</span>
      </p>
    </div>
  );
}
