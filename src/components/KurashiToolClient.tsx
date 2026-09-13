"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Prefecture } from "@/lib/prefectures";

interface ApiPoint {
  areaCode: string;
  areaName: string;
  year: number;
  value: number;
}
interface ApiResponse {
  data: ApiPoint[];
}

interface CostItem {
  id: string;
  label: string;
  unit: string;
  icon: string;
}

const COST_ITEMS: CostItem[] = [
  { id: "rent", label: "家賃（1ヶ月・1坪あたり）", unit: "円", icon: "🏠" },
  { id: "electricityBill", label: "電気代（1ヶ月）", unit: "円/月", icon: "⚡" },
  { id: "gasBill", label: "都市ガス代（1ヶ月）", unit: "円/月", icon: "🔥" },
  { id: "waterBill", label: "水道料（1ヶ月）", unit: "円/月", icon: "🚿" },
  { id: "gasoline", label: "ガソリン（1L）", unit: "円/L", icon: "⛽" },
  { id: "barberFee", label: "理髪料", unit: "円", icon: "💈" },
  { id: "cleaningFee", label: "クリーニング代（スーツ）", unit: "円", icon: "🧺" }
];

/** デフォルトでは表示せず、「品目を追加」から選んで比較に加えられる品目カタログ */
const EXTRA_COST_CATALOG: CostItem[] = [
  { id: "ricePrice", label: "米（うるち米・5kg）", unit: "円", icon: "🍚" },
  { id: "breadPrice", label: "食パン", unit: "円", icon: "🍞" },
  { id: "eggPrice", label: "鶏卵（1kg）", unit: "円", icon: "🥚" },
  { id: "milkPrice", label: "牛乳（1L）", unit: "円", icon: "🥛" },
  { id: "onionPrice", label: "たまねぎ（1kg）", unit: "円", icon: "🧅" },
  { id: "cabbagePrice", label: "キャベツ（1kg）", unit: "円", icon: "🥬" },
  { id: "applePrice", label: "りんご（1kg）", unit: "円", icon: "🍎" },
  { id: "bananaPrice", label: "バナナ（1kg）", unit: "円", icon: "🍌" },
  { id: "porkPrice", label: "豚肉（100g）", unit: "円", icon: "🥓" },
  { id: "beefPrice", label: "牛肉（100g）", unit: "円", icon: "🥩" },
  { id: "ramenPrice", label: "ラーメン（外食）", unit: "円", icon: "🍜" },
  { id: "coffeePrice", label: "コーヒー（外食）", unit: "円", icon: "☕" }
];

interface HealthItem {
  id: string;
  label: string;
  unit: string;
  icon: string;
  direction: "up" | "down";
}

const HEALTH_ITEMS: HealthItem[] = [
  { id: "vegetableIntake", label: "野菜摂取量", unit: "g/日", icon: "🥦", direction: "up" },
  { id: "saltIntake", label: "食塩摂取量", unit: "g/日", icon: "🧂", direction: "down" },
  { id: "steps", label: "歩数", unit: "歩/日", icon: "🚶", direction: "up" },
  { id: "smokingRate", label: "喫煙率（男性）", unit: "%", icon: "🚬", direction: "down" }
];

async function fetchLatest(id: string, areaCode: string): Promise<{ value: number; year: number } | null> {
  const res: ApiResponse = await fetch(`/api/${id}?areaCode=${areaCode}`).then((r) => r.json());
  if (!res.data || res.data.length === 0) return null;
  const sorted = [...res.data].sort((a, b) => b.year - a.year);
  return { value: sorted[0].value, year: sorted[0].year };
}

export function KurashiToolClient({ prefectures }: { prefectures: Prefecture[] }) {
  const chiba = prefectures.find((p) => p.slug === "chiba")?.code ?? prefectures[0].code;
  const osaka = prefectures.find((p) => p.slug === "osaka")?.code ?? prefectures[1].code;

  const [prefA, setPrefA] = useState(chiba);
  const [prefB, setPrefB] = useState(osaka);
  const [extraItems, setExtraItems] = useState<CostItem[]>([]);
  const [addSelect, setAddSelect] = useState(EXTRA_COST_CATALOG[0].id);
  const [costRows, setCostRows] = useState<{ item: CostItem; a: number | null; b: number | null }[]>([]);
  const [costLoading, setCostLoading] = useState(false);

  const allCostItems = useMemo(() => [...COST_ITEMS, ...extraItems], [extraItems]);
  const addableItems = useMemo(
    () => EXTRA_COST_CATALOG.filter((i) => !extraItems.some((e) => e.id === i.id)),
    [extraItems]
  );

  const [healthPref, setHealthPref] = useState(chiba);
  const [healthRows, setHealthRows] = useState<{ item: HealthItem; value: number | null; benchmark: number | null }[]>(
    []
  );
  const [healthScore, setHealthScore] = useState<number | null>(null);
  const [healthLoading, setHealthLoading] = useState(false);

  const nameA = prefectures.find((p) => p.code === prefA)?.name ?? "-";
  const nameB = prefectures.find((p) => p.code === prefB)?.name ?? "-";
  const healthName = prefectures.find((p) => p.code === healthPref)?.name ?? "-";

  // --- 生活費比較 ---
  useEffect(() => {
    let cancelled = false;
    setCostLoading(true);
    Promise.all(
      allCostItems.map(async (item) => {
        const [a, b] = await Promise.all([fetchLatest(item.id, prefA), fetchLatest(item.id, prefB)]);
        return { item, a: a?.value ?? null, b: b?.value ?? null };
      })
    ).then((rows) => {
      if (!cancelled) {
        setCostRows(rows);
        setCostLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [prefA, prefB, allCostItems]);

  const costTotalA = costRows.reduce((s, r) => s + (r.a ?? 0), 0);
  const costTotalB = costRows.reduce((s, r) => s + (r.b ?? 0), 0);
  const costDiff = costTotalB - costTotalA;
  const costCounted = costRows.filter((r) => r.a !== null && r.b !== null).length;

  function addExtraItem() {
    const item = EXTRA_COST_CATALOG.find((i) => i.id === addSelect);
    if (!item || extraItems.some((e) => e.id === item.id)) return;
    setExtraItems((prev) => [...prev, item]);
  }
  function removeExtraItem(id: string) {
    setExtraItems((prev) => prev.filter((i) => i.id !== id));
  }

  // --- 健康スコア診断 ---
  useEffect(() => {
    let cancelled = false;
    setHealthLoading(true);
    Promise.all(
      HEALTH_ITEMS.map(async (item) => {
        // 全国の中央値の代わりに、全47都道府県の値を取得してその場で中央値を計算する
        const [own, all] = await Promise.all([
          fetchLatest(item.id, healthPref),
          fetch(`/api/${item.id}`).then((r) => r.json() as Promise<ApiResponse>)
        ]);
        const values = all.data.map((d) => d.value).sort((x, y) => x - y);
        const mid = Math.floor(values.length / 2);
        const median = values.length === 0 ? null : values.length % 2 === 0 ? (values[mid - 1] + values[mid]) / 2 : values[mid];
        return { item, value: own?.value ?? null, benchmark: median };
      })
    ).then((rows) => {
      if (!cancelled) {
        setHealthRows(rows);
        const score = rows.filter((r) => {
          if (r.value === null || r.benchmark === null) return false;
          return r.item.direction === "up" ? r.value > r.benchmark : r.value < r.benchmark;
        }).length;
        setHealthScore(score);
        setHealthLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [healthPref]);

  return (
    <div>
      {/* 生活費比較シミュレーター */}
      <h2>🛒 総合生活費比較シミュレーター</h2>
      <p className="dm-lede">
        家賃・電気代・都市ガス代・水道料・ガソリン・理髪料・クリーニング代を基本項目に、必要に応じて食料品など他の品目も追加して、2つの都道府県のくらしのコストを比べます。
      </p>

      <div className="dm-compare-picker">
        <div>
          <label className="dm-field-label">都道府県A</label>
          <select className="dm-select" value={prefA} onChange={(e) => setPrefA(e.target.value)}>
            {prefectures.map((p) => (
              <option key={p.code} value={p.code}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        <div className="dm-compare-vs">VS</div>
        <div>
          <label className="dm-field-label">都道府県B</label>
          <select className="dm-select" value={prefB} onChange={(e) => setPrefB(e.target.value)}>
            {prefectures.map((p) => (
              <option key={p.code} value={p.code}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {!costLoading && costRows.length > 0 && (
        <div className="dm-scoreboard">
          <div className="dm-scoreboard-side">
            <div className="dm-scoreboard-name">{nameA}</div>
          </div>
          <div className="dm-scoreboard-mid">
            <div>生活費指数の差（B − A）</div>
            <div className="dm-mono" style={{ fontSize: 20, fontWeight: 700, marginTop: 4, color: "var(--dm-coral-deep)" }}>
              {costDiff >= 0 ? "+" : ""}
              {Math.round(costDiff).toLocaleString()}円
            </div>
            <div style={{ fontSize: 11, marginTop: 2 }}>{allCostItems.length}項目中{costCounted}項目で比較</div>
          </div>
          <div className="dm-scoreboard-side">
            <div className="dm-scoreboard-name">{nameB}</div>
          </div>
        </div>
      )}
      <p className="dm-doc-updated">
        ※ 家賃は総務省統計局「小売物価統計調査」（1ヶ月・1坪あたり）、他の項目も同調査（都道府県庁所在市等の価格）に基づく簡易的な指数です。
      </p>

      {costLoading && <p style={{ color: "var(--dm-muted)" }}>読み込み中...</p>}

      {!costLoading && (
        <table className="dm-table" style={{ marginTop: 12 }}>
          <thead>
            <tr>
              <th>品目</th>
              <th className="dm-num">{nameA}</th>
              <th style={{ width: 40 }}></th>
              <th className="dm-num">{nameB}</th>
            </tr>
          </thead>
          <tbody>
            {costRows.map((r) => {
              const max = Math.max(r.a ?? 0, r.b ?? 0) || 1;
              const pctA = r.a !== null ? Math.max(4, (r.a / max) * 100) : 0;
              const pctB = r.b !== null ? Math.max(4, (r.b / max) * 100) : 0;
              const aWins = r.a !== null && r.b !== null && r.a > r.b;
              const bWins = r.a !== null && r.b !== null && r.b > r.a;
              return (
                <tr key={r.item.id}>
                  <td>
                    <Link href={`/dashboard/${r.item.id}`}>
                      {r.item.icon} {r.item.label}
                    </Link>
                    {extraItems.some((e) => e.id === r.item.id) && (
                      <button
                        onClick={() => removeExtraItem(r.item.id)}
                        aria-label="この品目を削除"
                        style={{
                          marginLeft: 6,
                          border: "none",
                          background: "none",
                          color: "var(--dm-muted)",
                          cursor: "pointer",
                          fontSize: 12
                        }}
                      >
                        ×削除
                      </button>
                    )}
                  </td>
                  <td className="dm-num dm-mono" style={{ fontWeight: aWins ? 700 : 400 }}>
                    {r.a !== null ? `${r.a.toLocaleString()}${r.item.unit}` : "データなし"}
                    <div className="dm-compare-bar">
                      <div
                        className="dm-compare-bar-fill"
                        style={{ width: `${pctA}%`, background: aWins ? "var(--dm-coral)" : "var(--dm-line)", marginLeft: "auto" }}
                      />
                    </div>
                  </td>
                  <td style={{ textAlign: "center", color: "var(--dm-muted)", fontSize: 12 }}>vs</td>
                  <td className="dm-num dm-mono" style={{ fontWeight: bWins ? 700 : 400 }}>
                    <div className="dm-compare-bar">
                      <div
                        className="dm-compare-bar-fill"
                        style={{ width: `${pctB}%`, background: bWins ? "var(--dm-coral)" : "var(--dm-line)" }}
                      />
                    </div>
                    {r.b !== null ? `${r.b.toLocaleString()}${r.item.unit}` : "データなし"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {addableItems.length > 0 && (
        <div className="dm-card" style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <span style={{ fontSize: 13, fontWeight: 700 }}>🔍 他の品目も比べる：</span>
          <select className="dm-select" value={addSelect} onChange={(e) => setAddSelect(e.target.value)} style={{ flex: "0 0 auto" }}>
            {addableItems.map((i) => (
              <option key={i.id} value={i.id}>
                {i.icon} {i.label}
              </option>
            ))}
          </select>
          <button
            onClick={addExtraItem}
            className="dm-select"
            style={{ cursor: "pointer", fontWeight: 700, background: "var(--dm-coral)", color: "#fffefa", border: "none" }}
          >
            追加
          </button>
        </div>
      )}

      {/* 健康スコア診断 */}
      <h2 style={{ marginTop: 48 }}>❤️ 都道府県健康スコア診断</h2>
      <p className="dm-lede">
        野菜摂取量・食塩摂取量・歩数・喫煙率（男性）の4指標のうち、全国の中央値より良好な方向にある指標の数を見られます。
      </p>

      <div style={{ maxWidth: 260 }}>
        <label className="dm-field-label">都道府県</label>
        <select className="dm-select" value={healthPref} onChange={(e) => setHealthPref(e.target.value)}>
          {prefectures.map((p) => (
            <option key={p.code} value={p.code}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      {!healthLoading && healthScore !== null && (
        <div className="dm-composite" style={{ marginTop: 20 }}>
          <div className="dm-composite-score">
            {healthScore}
            <span> / {HEALTH_ITEMS.length}</span>
          </div>
          <div className="dm-composite-body">
            <p>
              <strong>{healthName}の健康スコア</strong> — 4指標のうち、全国の中央値より良い方向にある指標の数です。
            </p>
            <div className="dm-composite-tags">
              {healthRows.map((r) => {
                const favorable =
                  r.value !== null && r.benchmark !== null
                    ? r.item.direction === "up"
                      ? r.value > r.benchmark
                      : r.value < r.benchmark
                    : null;
                return (
                  <span
                    key={r.item.id}
                    className={`dm-composite-tag ${favorable ? "dm-tag-up" : "dm-tag-down"}`}
                  >
                    {favorable ? "◎" : "△"} {r.item.icon} {r.item.label}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      )}
      <p className="dm-doc-updated">
        ※ 当サイトが独自に定義した簡易的な集計です。詳しくは
        <Link href="/articles/health-score-explained">解説記事</Link>
        をご覧ください。
      </p>

      {healthLoading && <p style={{ color: "var(--dm-muted)" }}>読み込み中...</p>}

      {!healthLoading && healthRows.length > 0 && (
        <table className="dm-table" style={{ marginTop: 12 }}>
          <thead>
            <tr>
              <th>指標</th>
              <th className="dm-num">{healthName}</th>
              <th className="dm-num">全国の中央値</th>
            </tr>
          </thead>
          <tbody>
            {healthRows.map((r) => (
              <tr key={r.item.id}>
                <td>
                  <Link href={`/dashboard/${r.item.id}`}>
                    {r.item.icon} {r.item.label}
                  </Link>
                </td>
                <td className="dm-num dm-mono">{r.value !== null ? `${r.value.toLocaleString()}${r.item.unit}` : "-"}</td>
                <td className="dm-num dm-mono" style={{ color: "var(--dm-muted)" }}>
                  {r.benchmark !== null ? `${r.benchmark.toLocaleString()}${r.item.unit}` : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <ShareCard prefName={healthName} score={healthScore} total={HEALTH_ITEMS.length} rows={healthRows} />
    </div>
  );
}

function ShareCard({
  prefName,
  score,
  total,
  rows
}: {
  prefName: string;
  score: number | null;
  total: number;
  rows: { item: HealthItem; value: number | null; benchmark: number | null }[];
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (score === null || rows.length === 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const W = canvas.width;
    const H = canvas.height;

    ctx.fillStyle = "#f4f6ee"; // --dm-bg
    ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = "#0b3b33"; // --dm-ink
    ctx.lineWidth = 6;
    ctx.strokeRect(3, 3, W - 6, H - 6);

    ctx.fillStyle = "#d6604d"; // 健康カテゴリカラー
    roundRect(ctx, 60, 60, 320, 56, 10);
    ctx.fill();
    ctx.fillStyle = "#fffefa";
    ctx.font = "700 26px sans-serif";
    ctx.textBaseline = "middle";
    ctx.fillText("健康スコア診断", 84, 88);

    ctx.fillStyle = "#0b3b33";
    ctx.font = "700 64px sans-serif";
    ctx.textBaseline = "alphabetic";
    ctx.fillText(prefName, 60, 220);

    ctx.font = "500 26px sans-serif";
    ctx.fillStyle = "#6f7669";
    ctx.fillText("全国の中央値より良好な指標", 60, 270);
    ctx.font = "700 120px sans-serif";
    ctx.fillStyle = "#d6604d";
    ctx.fillText(`${score} / ${total}`, 60, 390);

    let y = 460;
    rows.forEach((r) => {
      const favorable =
        r.value !== null && r.benchmark !== null
          ? r.item.direction === "up"
            ? r.value > r.benchmark
            : r.value < r.benchmark
          : null;
      ctx.font = "500 28px sans-serif";
      ctx.fillStyle = "#0b3b33";
      ctx.fillText(`${favorable ? "◎" : "△"} ${r.item.icon} ${r.item.label}`, 60, y);
      ctx.font = "400 22px sans-serif";
      ctx.fillStyle = "#6f7669";
      ctx.textAlign = "right";
      ctx.fillText(
        r.value !== null ? `${r.value.toLocaleString()}${r.item.unit}（全国中央値 ${r.benchmark?.toLocaleString() ?? "-"}${r.item.unit}）` : "-",
        W - 60,
        y
      );
      ctx.textAlign = "left";
      y += 60;
    });

    ctx.font = "500 20px sans-serif";
    ctx.fillStyle = "#6f7669";
    ctx.fillText("出典：厚生労働省「令和6年国民健康・栄養調査」", 60, H - 40);
    ctx.font = "700 24px sans-serif";
    ctx.fillStyle = "#0f8c6c";
    ctx.textAlign = "right";
    ctx.fillText("データみっけ", W - 60, H - 40);
    ctx.textAlign = "left";

    setPreviewUrl(canvas.toDataURL("image/png"));
  }, [prefName, score, total, rows]);

  function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function download() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `健康スコア診断_${prefName}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  return (
    <div className="dm-card" style={{ marginTop: 24, maxWidth: 360 }}>
      <p className="dm-card-eyebrow">共有用カード</p>
      <canvas ref={canvasRef} width={1080} height={1080} style={{ display: "none" }} />
      {previewUrl && (
        <img
          src={previewUrl}
          alt={`${prefName}の健康スコア診断カード`}
          style={{ width: "100%", borderRadius: 8, border: "1px solid var(--dm-line)" }}
        />
      )}
      <button onClick={download} className="dm-select" style={{ marginTop: 12, cursor: "pointer", fontWeight: 700 }}>
        画像を保存
      </button>
    </div>
  );
}
