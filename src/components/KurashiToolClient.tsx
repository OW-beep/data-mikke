"use client";

import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Prefecture } from "@/lib/prefectures";
import { CostPerformanceRanking } from "./CostPerformanceRanking";
import { GapFinder } from "./GapFinder";
import { RelocationDiagnosis } from "./RelocationDiagnosis";
import { CostItem, COST_ITEMS, FEATURED_CATEGORY, EXTRA_COST_CATALOG, median, average } from "@/lib/kurashiCostItems";

interface ApiPoint {
  areaCode: string;
  areaName: string;
  year: number;
  value: number;
}
interface ApiResponse {
  data: ApiPoint[];
}

interface CatalogEntry {
  label: string;
  category: string;
  values: Record<string, number>;
}
type CatalogMap = Record<string, CatalogEntry>;

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
  const [removedBaseIds, setRemovedBaseIds] = useState<string[]>([]);
  const [catalog, setCatalog] = useState<CatalogMap | null>(null);
  const [addCategory, setAddCategory] = useState<string>(FEATURED_CATEGORY);
  const [addSelect, setAddSelect] = useState(EXTRA_COST_CATALOG[0].id);
  const [costRows, setCostRows] = useState<
    { item: CostItem; a: number | null; b: number | null; avg: number | null; median: number | null }[]
  >([]);
  const [costLoading, setCostLoading] = useState(false);
  const [totalAvg, setTotalAvg] = useState<number | null>(null);
  const [totalMedian, setTotalMedian] = useState<number | null>(null);

  // くらしツール専用の大きな品目カタログ（500品目超）を初回だけ取得
  useEffect(() => {
    fetch("/api/kurashi-catalog")
      .then((r) => r.json() as Promise<CatalogMap>)
      .then(setCatalog)
      .catch(() => setCatalog({}));
  }, []);

  const BASE_CATEGORY = "🏠 基本の生活費品目";
  const visibleBaseItems = useMemo(() => COST_ITEMS.filter((i) => !removedBaseIds.includes(i.id)), [removedBaseIds]);
  const allCostItems = useMemo(() => [...visibleBaseItems, ...extraItems], [visibleBaseItems, extraItems]);

  // カテゴリ一覧：基本品目（削除した分のみ再追加可）→ おすすめ（データセット化済み12品目）→ カタログの32カテゴリ（品目数の多い順）
  const categoryList = useMemo(() => {
    if (!catalog) return [BASE_CATEGORY, FEATURED_CATEGORY];
    const counts = new Map<string, number>();
    Object.values(catalog).forEach((entry) => {
      counts.set(entry.category, (counts.get(entry.category) ?? 0) + 1);
    });
    const catalogCats = Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([cat]) => cat);
    return [BASE_CATEGORY, FEATURED_CATEGORY, ...catalogCats];
  }, [catalog]);

  // 選択中カテゴリに属する「追加できる品目」一覧（追加済みは除く）
  const addableInCategory: CostItem[] = useMemo(() => {
    if (addCategory === BASE_CATEGORY) {
      return COST_ITEMS.filter((i) => removedBaseIds.includes(i.id));
    }
    if (addCategory === FEATURED_CATEGORY) {
      return EXTRA_COST_CATALOG.filter((i) => !extraItems.some((e) => e.id === i.id));
    }
    if (!catalog) return [];
    return Object.entries(catalog)
      .filter(([, entry]) => entry.category === addCategory)
      .filter(([id]) => !extraItems.some((e) => e.id === id))
      .map(([id, entry]) => ({ id, label: entry.label, unit: "円", icon: "🏷️", kind: "catalog" as const }))
      .sort((a, b) => a.label.localeCompare(b.label, "ja"));
  }, [addCategory, catalog, extraItems, removedBaseIds]);

  const totalAddableCount = useMemo(() => {
    const base = removedBaseIds.length;
    const featured = EXTRA_COST_CATALOG.filter((i) => !extraItems.some((e) => e.id === i.id)).length;
    const catalogCount = catalog
      ? Object.keys(catalog).filter((id) => !extraItems.some((e) => e.id === id)).length
      : 0;
    return base + featured + catalogCount;
  }, [catalog, extraItems, removedBaseIds]);

  useEffect(() => {
    if (addableInCategory.length > 0 && !addableInCategory.some((i) => i.id === addSelect)) {
      setAddSelect(addableInCategory[0].id);
    }
  }, [addableInCategory, addSelect]);

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

    // 都道府県コードごとの「合計」を積み上げるためのマップ（品目ごとの全国値を使って算出）
    const totalByCode = new Map<string, number>();
    let itemsCountedForTotal = 0;

    Promise.all(
      allCostItems.map(async (item) => {
        if (item.kind === "catalog") {
          const entry = catalog?.[item.id];
          const values = entry ? Object.values(entry.values) : [];
          if (entry && values.length === prefectures.length) {
            itemsCountedForTotal++;
            Object.entries(entry.values).forEach(([code, v]) => {
              totalByCode.set(code, (totalByCode.get(code) ?? 0) + v);
            });
          }
          return {
            item,
            a: entry?.values[prefA] ?? null,
            b: entry?.values[prefB] ?? null,
            avg: average(values),
            median: median(values)
          };
        }
        const [a, b, all] = await Promise.all([
          fetchLatest(item.id, prefA),
          fetchLatest(item.id, prefB),
          fetch(`/api/${item.id}`).then((r) => r.json() as Promise<ApiResponse>)
        ]);
        const values = all.data.map((d) => d.value);
        if (values.length === prefectures.length) {
          itemsCountedForTotal++;
          all.data.forEach((d) => {
            totalByCode.set(d.areaCode, (totalByCode.get(d.areaCode) ?? 0) + d.value);
          });
        }
        return { item, a: a?.value ?? null, b: b?.value ?? null, avg: average(values), median: median(values) };
      })
    ).then((rows) => {
      if (!cancelled) {
        setCostRows(rows);
        if (itemsCountedForTotal === allCostItems.length && totalByCode.size > 0) {
          const totals = Array.from(totalByCode.values());
          setTotalAvg(average(totals));
          setTotalMedian(median(totals));
        } else {
          setTotalAvg(null);
          setTotalMedian(null);
        }
        setCostLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [prefA, prefB, allCostItems, prefectures.length, catalog]);

  const costTotalA = costRows.reduce((s, r) => s + (r.a ?? 0), 0);
  const costTotalB = costRows.reduce((s, r) => s + (r.b ?? 0), 0);
  const costDiff = costTotalB - costTotalA;
  const costCounted = costRows.filter((r) => r.a !== null && r.b !== null).length;
  const cheaperName = costDiff === 0 ? null : costDiff > 0 ? nameA : nameB;
  const pricierName = costDiff === 0 ? null : costDiff > 0 ? nameB : nameA;

  function addExtraItem() {
    const item = addableInCategory.find((i) => i.id === addSelect);
    if (!item) return;
    if (COST_ITEMS.some((i) => i.id === item.id)) {
      // 削除済みの基本品目を復元
      setRemovedBaseIds((prev) => prev.filter((id) => id !== item.id));
      return;
    }
    if (extraItems.some((e) => e.id === item.id)) return;
    setExtraItems((prev) => [...prev, item]);
  }
  function removeExtraItem(id: string) {
    if (COST_ITEMS.some((i) => i.id === id)) {
      setRemovedBaseIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
      return;
    }
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
        家賃・電気代・都市ガス代・水道料・ガソリン・理髪料・クリーニング代の基本7品目に加えて、
        <strong>食料品から学童保育料まで500品目超</strong>
        の中から選んで、2つの都道府県のくらしのコストを比べられます。基本品目も含め、各品目は「×削除」でいつでも外せます。
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

      <div className="dm-card" style={{ marginTop: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>
          🔍 他の品目も比べる（追加できる品目：残り{totalAddableCount}件）
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <div>
            <label className="dm-field-label">カテゴリ</label>
            <select
              className="dm-select"
              value={addCategory}
              onChange={(e) => {
                setAddCategory(e.target.value);
              }}
            >
              {categoryList.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div style={{ flex: 1, minWidth: 180 }}>
            <label className="dm-field-label">品目</label>
            {addableInCategory.length > 0 ? (
              <select className="dm-select" value={addSelect} onChange={(e) => setAddSelect(e.target.value)} style={{ width: "100%" }}>
                {addableInCategory.map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.icon} {i.label}
                  </option>
                ))}
              </select>
            ) : (
              <div style={{ fontSize: 12, color: "var(--dm-muted)", padding: "10px 0" }}>
                このカテゴリの品目はすべて追加済みです
              </div>
            )}
          </div>
          <button
            onClick={addExtraItem}
            disabled={addableInCategory.length === 0}
            className="dm-select"
            style={{
              cursor: addableInCategory.length === 0 ? "not-allowed" : "pointer",
              fontWeight: 700,
              background: "var(--dm-coral)",
              color: "#fffefa",
              border: "none",
              opacity: addableInCategory.length === 0 ? 0.5 : 1
            }}
          >
            追加
          </button>
        </div>
        {!catalog && <div style={{ fontSize: 11, color: "var(--dm-muted)", marginTop: 8 }}>品目カタログを読み込み中...</div>}
      </div>

      {!costLoading && costRows.length > 0 && (
        <div className="dm-scoreboard" style={{ marginTop: 16 }}>
          <div className="dm-scoreboard-side">
            <div className="dm-scoreboard-name">{nameA}</div>
          </div>
          <div className="dm-scoreboard-mid">
            {costDiff === 0 ? (
              <div style={{ fontWeight: 700 }}>{allCostItems.length}項目の合計はほぼ同じです</div>
            ) : (
              <>
                <div>
                  <strong style={{ color: "var(--dm-teal-deep)" }}>{cheaperName}</strong>
                  の方が
                  <strong style={{ color: "var(--dm-coral-deep)" }}>{Math.abs(Math.round(costDiff)).toLocaleString()}円</strong>
                  安い
                </div>
                <div style={{ fontSize: 11, marginTop: 2, color: "var(--dm-muted)" }}>
                  （{pricierName}の方が高い）
                </div>
              </>
            )}
            <div style={{ fontSize: 11, marginTop: 6 }}>{allCostItems.length}項目中{costCounted}項目で比較</div>
            {totalAvg !== null && totalMedian !== null && (
              <div style={{ fontSize: 11, marginTop: 4, color: "var(--dm-muted)" }}>
                全47都道府県の合計｜平均 {Math.round(totalAvg).toLocaleString()}円・中央値 {Math.round(totalMedian).toLocaleString()}円
              </div>
            )}
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
              const aCheaper = r.a !== null && r.b !== null && r.a < r.b;
              const bCheaper = r.a !== null && r.b !== null && r.b < r.a;
              return (
                <Fragment key={r.item.id}>
                  <tr>
                    <td>
                      <Link href={`/dashboard/${r.item.id}`}>
                        {r.item.icon} {r.item.label}
                      </Link>
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
                    </td>
                    <td className="dm-num dm-mono" style={{ fontWeight: aCheaper ? 700 : 400, color: aCheaper ? "var(--dm-teal-deep)" : undefined }}>
                      {r.a !== null ? `${r.a.toLocaleString()}${r.item.unit}` : "データなし"}
                      {aCheaper && <span style={{ fontSize: 11, marginLeft: 4 }}>▼安い</span>}
                      <div className="dm-compare-bar">
                        <div
                          className="dm-compare-bar-fill"
                          style={{
                            width: `${pctA}%`,
                            background: aCheaper ? "var(--dm-teal)" : bCheaper ? "var(--dm-coral)" : "var(--dm-line)",
                            marginLeft: "auto"
                          }}
                        />
                      </div>
                    </td>
                    <td style={{ textAlign: "center", color: "var(--dm-muted)", fontSize: 12 }}>vs</td>
                    <td className="dm-num dm-mono" style={{ fontWeight: bCheaper ? 700 : 400, color: bCheaper ? "var(--dm-teal-deep)" : undefined }}>
                      <div className="dm-compare-bar">
                        <div
                          className="dm-compare-bar-fill"
                          style={{
                            width: `${pctB}%`,
                            background: bCheaper ? "var(--dm-teal)" : aCheaper ? "var(--dm-coral)" : "var(--dm-line)"
                          }}
                        />
                      </div>
                      {r.b !== null ? `${r.b.toLocaleString()}${r.item.unit}` : "データなし"}
                      {bCheaper && <span style={{ fontSize: 11, marginLeft: 4 }}>安い▼</span>}
                    </td>
                  </tr>
                  <tr key={`${r.item.id}-benchmark`}>
                    <td colSpan={4} style={{ fontSize: 11, color: "var(--dm-muted)", paddingTop: 0, paddingBottom: 10, borderTop: "none" }}>
                      全47都道府県｜平均 {r.avg !== null ? `${Math.round(r.avg).toLocaleString()}${r.item.unit}` : "-"}
                      ・中央値 {r.median !== null ? `${Math.round(r.median).toLocaleString()}${r.item.unit}` : "-"}
                    </td>
                  </tr>
                </Fragment>
              );
            })}
          </tbody>
        </table>
      )}

      <CostPerformanceRanking prefectures={prefectures} highlightCodes={[prefA, prefB]} />


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

      <GapFinder prefectures={prefectures} />

      <RelocationDiagnosis prefectures={prefectures} prefA={prefA} prefB={prefB} />

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
