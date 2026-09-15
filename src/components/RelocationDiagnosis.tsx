"use client";

import { useEffect, useState } from "react";
import { Prefecture } from "@/lib/prefectures";
import { COST_ITEMS, EXTRA_COST_CATALOG } from "@/lib/kurashiCostItems";

interface ApiPoint {
  areaCode: string;
  areaName: string;
  year: number;
  value: number;
}
interface ApiResponse {
  data: ApiPoint[];
}

const COST_INDEX_IDS = [...COST_ITEMS.map((i) => i.id), ...EXTRA_COST_CATALOG.map((i) => i.id)];

async function fetchOne(id: string, areaCode: string): Promise<number | null> {
  const res: ApiResponse = await fetch(`/api/${id}?areaCode=${areaCode}`).then((r) => r.json());
  return res.data[0]?.value ?? null;
}

async function fetchCostIndex(areaCode: string): Promise<number | null> {
  const values = await Promise.all(COST_INDEX_IDS.map((id) => fetchOne(id, areaCode)));
  if (values.some((v) => v === null)) return null;
  return (values as number[]).reduce((s, v) => s + v, 0);
}

interface Metrics {
  temperature: number | null;
  sunshine: number | null;
  income: number | null;
  costIndex: number | null;
  healthScore: number | null;
}

async function fetchMetrics(areaCode: string): Promise<Metrics> {
  const [temperature, sunshine, income, healthScore, costIndex] = await Promise.all([
    fetchOne("temperature", areaCode),
    fetchOne("sunshine", areaCode),
    fetchOne("income", areaCode),
    fetchOne("healthScore", areaCode),
    fetchCostIndex(areaCode)
  ]);
  return { temperature, sunshine, income, healthScore, costIndex };
}

interface Row {
  label: string;
  icon: string;
  unit: string;
  a: number | null;
  b: number | null;
  higherIsBetter: boolean | null; // nullなら「良し悪し」を判定しない（気候は好み次第のため）
}

export function RelocationDiagnosis({
  prefectures,
  prefA,
  prefB
}: {
  prefectures: Prefecture[];
  prefA: string;
  prefB: string;
}) {
  const [metricsA, setMetricsA] = useState<Metrics | null>(null);
  const [metricsB, setMetricsB] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(false);

  const nameA = prefectures.find((p) => p.code === prefA)?.name ?? "-";
  const nameB = prefectures.find((p) => p.code === prefB)?.name ?? "-";

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all([fetchMetrics(prefA), fetchMetrics(prefB)]).then(([a, b]) => {
      if (cancelled) return;
      setMetricsA(a);
      setMetricsB(b);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [prefA, prefB]);

  const rows: Row[] = metricsA && metricsB
    ? [
        { label: "年平均気温", icon: "🌡️", unit: "℃", a: metricsA.temperature, b: metricsB.temperature, higherIsBetter: null },
        { label: "年間日照時間", icon: "☀️", unit: "時間", a: metricsA.sunshine, b: metricsB.sunshine, higherIsBetter: null },
        { label: "県民所得（1人あたり）", icon: "💰", unit: "千円", a: metricsA.income, b: metricsB.income, higherIsBetter: true },
        { label: "生活費指数（19品目合計）", icon: "🛒", unit: "円", a: metricsA.costIndex, b: metricsB.costIndex, higherIsBetter: false },
        { label: "健康スコア", icon: "❤️", unit: "/4", a: metricsA.healthScore, b: metricsB.healthScore, higherIsBetter: true }
      ]
    : [];

  return (
    <div className="dm-card" style={{ marginTop: 16 }}>
      <p className="dm-card-eyebrow">⑥ 移住ミニ診断</p>
      <p style={{ fontSize: 13, color: "var(--dm-muted)", marginTop: 4 }}>
        今比較している<strong>{nameA}</strong>と<strong>{nameB}</strong>を、気候・所得・生活費・健康の5指標でまとめて見比べます。
      </p>

      {loading && <p style={{ color: "var(--dm-muted)", marginTop: 10 }}>読み込み中...</p>}

      {!loading && rows.length > 0 && (
        <table className="dm-table" style={{ marginTop: 12 }}>
          <thead>
            <tr>
              <th>指標</th>
              <th className="dm-num">{nameA}</th>
              <th className="dm-num">{nameB}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const aBetter =
                r.higherIsBetter === null || r.a === null || r.b === null
                  ? false
                  : r.higherIsBetter
                  ? r.a > r.b
                  : r.a < r.b;
              const bBetter =
                r.higherIsBetter === null || r.a === null || r.b === null
                  ? false
                  : r.higherIsBetter
                  ? r.b > r.a
                  : r.b < r.a;
              return (
                <tr key={r.label}>
                  <td>
                    {r.icon} {r.label}
                  </td>
                  <td
                    className="dm-num dm-mono"
                    style={{ fontWeight: aBetter ? 700 : 400, color: aBetter ? "var(--dm-teal-deep)" : undefined }}
                  >
                    {r.a !== null ? `${r.a.toLocaleString(undefined, { maximumFractionDigits: 1 })}${r.unit}` : "-"}
                    {aBetter && " ◎"}
                  </td>
                  <td
                    className="dm-num dm-mono"
                    style={{ fontWeight: bBetter ? 700 : 400, color: bBetter ? "var(--dm-teal-deep)" : undefined }}
                  >
                    {r.b !== null ? `${r.b.toLocaleString(undefined, { maximumFractionDigits: 1 })}${r.unit}` : "-"}
                    {bBetter && " ◎"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      <p className="dm-doc-updated" style={{ marginTop: 10 }}>
        ※ 気温・日照時間は好みが分かれるため◎の判定はしていません。所得は高い方、生活費は低い方、健康スコアは高い方に◎を付けています。あくまで簡易的な目安です。
      </p>
    </div>
  );
}
