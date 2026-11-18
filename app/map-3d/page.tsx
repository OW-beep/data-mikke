import Link from "next/link";
import { DATASET_LIST, getDataset } from "@/datasets";
import { loadDataset, latestByArea } from "@/lib/loadData";
import { PREFECTURES } from "@/lib/prefectures";
import { TILE_POS } from "@/components/PrefectureMap";

/**
 * 3D棒グラフ地図（静的SVGの等角バー）。
 *
 * 方針（重くしないため）：
 * - WebGL・3Dライブラリ・canvas・アニメーションは一切なし。
 *   棒はSVGの多角形（前面・上面・側面）だけで描く、サーバー描画の静止画です。
 * - データセットの切り替えはフォームのGET送信（?dataset=...）で、
 *   クライアントJavaScriptは不要です。
 * - 高さは選択した指標の値に比例（その指標の最大値を最大高さとして線形）。
 *   対数変換はしていません。値の差が大きい指標では低い県の棒が短く見えますが、
 *   それが値の差そのものです。棒の上に値を表示しているので、短い棒の県の値も読めます。
 */

export const metadata = {
  title: `3D棒グラフ地図｜都道府県ランキングを高さで比べる`,
  description: `47都道府県のランキング値を、地図の上に立つ3Dの棒の高さで比べられます。人口密度・平均寿命・年収など、指標を切り替えて表示できます。WebGLや動画は使わず、軽い静的SVGだけで表示します。`,
};

const TILE_W = 46;
const GAP = 4;
const CELL_W = TILE_W + GAP;
const BAR_W = 34;
const DEPTH_X = 9;
const DEPTH_Y = -9;
const MAX_BAR_H = 150;
const ROW_H = MAX_BAR_H + 64;
const COLS = 12;
const ROWS = 12;
const MIN_BAR_H = 5;

function formatNum(v: number): string {
  return Number.isInteger(v) ? v.toLocaleString("ja-JP") : v.toLocaleString("ja-JP");
}

export default async function Map3dPage({
  searchParams,
}: {
  searchParams: { dataset?: string };
}) {
  // ランキング表示できる指標だけを対象にする
  const rankable = DATASET_LIST.filter((d) => d.ranking);
  const datasetId = rankable.some((d) => d.id === searchParams.dataset)
    ? searchParams.dataset!
    : "density";
  const dataset = getDataset(datasetId) ?? getDataset("density")!;

  const latest = latestByArea(await loadDataset(dataset.id));
  const byCode = new Map(latest.map((p) => [p.areaCode, p]));
  const max = Math.max(...latest.map((p) => p.value), 0);

  const categories = Array.from(new Set(rankable.map((d) => d.category)));

  return (
    <div>
      <p className="dm-eyebrow">3D Map</p>
      <h1>3D棒グラフ地図｜{dataset.title}を高さで比べる</h1>
      <p className="dm-lede">
        47都道府県の「{dataset.title}」を、地図の上に立つ棒の高さで表しています。
        棒が高い県ほど値が大きく、棒の上には値（{dataset.unit}）を表示しています。
        指標を変えると、棒の高さが変わります。
      </p>

      <form method="get" action="/map-3d" style={{ marginTop: 16 }}>
        <label>
          指標を選ぶ：{" "}
          <select name="dataset" defaultValue={dataset.id}>
            {categories.map((cat) => (
              <optgroup key={cat} label={cat}>
                {rankable
                  .filter((d) => d.category === cat)
                  .map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.title}
                    </option>
                  ))}
              </optgroup>
            ))}
          </select>
        </label>{" "}
        <button type="submit">表示する</button>
      </form>
      <p className="dm-doc-updated" style={{ marginTop: 8 }}>
        出典：{dataset.source}／{dataset.description}
        高さは値に比例しています（この指標の最大値 {formatNum(max)}
        {dataset.unit} を {MAX_BAR_H}pxとして線形に換算。最小 {MIN_BAR_H}px）。
        順位は
        <Link href={`/ranking/${dataset.id}`}> {dataset.title}ランキング</Link>
        でも確認できます。
      </p>

      <section style={{ marginTop: 24, overflowX: "auto" }}>
        <svg
          viewBox={`0 0 ${COLS * CELL_W} ${ROWS * ROW_H}`}
          role="img"
          aria-label={`${dataset.title}の3D棒グラフ地図。棒の高さが値を表します。`}
          style={{ width: "100%", maxWidth: 600, height: "auto", display: "block" }}
        >
          {PREFECTURES.map((p) => {
            const pos = TILE_POS[p.slug];
            if (!pos) return null;
            const [col, row] = pos;
            const point = byCode.get(p.code);
            if (!point) return null;
            const h = Math.max(MIN_BAR_H, max > 0 ? (point.value / max) * MAX_BAR_H : 0);
            const x = col * CELL_W + (TILE_W - BAR_W) / 2;
            const baseY = row * ROW_H + MAX_BAR_H + 36;
            const topY = baseY - h;
            return (
              <g key={p.slug}>
                <a href={`/prefecture/${p.slug}`}>
                  <title>
                    {p.name}：{dataset.title} {formatNum(point.value)}
                    {dataset.unit}
                  </title>
                  {/* 側面 */}
                  <polygon
                    points={`${x + BAR_W},${topY} ${x + BAR_W + DEPTH_X},${topY + DEPTH_Y} ${x + BAR_W + DEPTH_X},${baseY + DEPTH_Y} ${x + BAR_W},${baseY}`}
                    fill="#0b5c46"
                  />
                  {/* 上面 */}
                  <polygon
                    points={`${x},${topY} ${x + DEPTH_X},${topY + DEPTH_Y} ${x + BAR_W + DEPTH_X},${topY + DEPTH_Y} ${x + BAR_W},${topY}`}
                    fill="#5dbb9b"
                  />
                  {/* 前面 */}
                  <rect x={x} y={topY} width={BAR_W} height={h} fill="#0f8c6c" />
                  {/* 値ラベル */}
                  <text
                    x={x + BAR_W / 2 + DEPTH_X / 2}
                    y={topY + DEPTH_Y - 4}
                    textAnchor="middle"
                    fontSize={9}
                    fill="#0b3b33"
                  >
                    {formatNum(point.value)}
                  </text>
                  {/* 県名ラベル */}
                  <text
                    x={x + BAR_W / 2}
                    y={baseY + 14}
                    textAnchor="middle"
                    fontSize={10}
                    fill="#0b3b33"
                  >
                    {p.name}
                  </text>
                </a>
              </g>
            );
          })}
        </svg>
        <p className="dm-doc-updated" style={{ marginTop: 8 }}>
          ※ 模式図です。都道府県の位置はタイル地図（模式図）に沿っており、形・面積・距離は
          正確ではありません。沖縄は位置をずらして表示しています。
          各棒をクリックすると、その都道府県の統計ページに移動します。
        </p>
      </section>

      <section style={{ marginTop: 32 }}>
        <h2>上位5県（{dataset.title}）</h2>
        <ol>
          {[...latest]
            .sort((a, b) => b.value - a.value)
            .slice(0, 5)
            .map((p, i) => {
              const pref = PREFECTURES.find((x) => x.code === p.areaCode);
              if (!pref) return null;
              return (
                <li key={p.areaCode}>
                  {i + 1}位{" "}
                  <Link href={`/prefecture/${pref.slug}`}>{pref.name}</Link>：
                  {formatNum(p.value)}
                  {dataset.unit}
                </li>
              );
            })}
        </ol>
        <p style={{ marginTop: 16 }}>
          <Link href="/map">← 平面の都道府県マップ（各県の一番の強み一覧）に戻る</Link>
        </p>
      </section>
    </div>
  );
}
