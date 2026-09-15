"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
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

interface Choice {
  id: string;
  label: string;
  icon: string;
}

const HEALTH_CHOICES: Choice[] = [
  { id: "vegetableIntake", label: "野菜摂取量", icon: "🥦" },
  { id: "saltIntake", label: "食塩摂取量", icon: "🧂" },
  { id: "steps", label: "歩数", icon: "🚶" },
  { id: "bmi", label: "BMI", icon: "⚖️" },
  { id: "smokingRate", label: "喫煙率（男性）", icon: "🚬" }
];

const COST_CHOICES: Choice[] = [...COST_ITEMS, ...EXTRA_COST_CATALOG];

function pearsonCorrelation(xs: number[], ys: number[]): number {
  const n = xs.length;
  const meanX = xs.reduce((a, b) => a + b, 0) / n;
  const meanY = ys.reduce((a, b) => a + b, 0) / n;
  let cov = 0;
  let varX = 0;
  let varY = 0;
  for (let i = 0; i < n; i++) {
    const dx = xs[i] - meanX;
    const dy = ys[i] - meanY;
    cov += dx * dy;
    varX += dx * dx;
    varY += dy * dy;
  }
  if (varX === 0 || varY === 0) return 0;
  return cov / Math.sqrt(varX * varY);
}

function linearRegression(xs: number[], ys: number[]): { slope: number; intercept: number } {
  const n = xs.length;
  const meanX = xs.reduce((a, b) => a + b, 0) / n;
  const meanY = ys.reduce((a, b) => a + b, 0) / n;
  let cov = 0;
  let varX = 0;
  for (let i = 0; i < n; i++) {
    cov += (xs[i] - meanX) * (ys[i] - meanY);
    varX += (xs[i] - meanX) ** 2;
  }
  const slope = varX === 0 ? 0 : cov / varX;
  return { slope, intercept: meanY - slope * meanX };
}

interface GapRow {
  code: string;
  name: string;
  x: number;
  y: number;
  predicted: number;
  residual: number;
}

export function GapFinder({ prefectures }: { prefectures: Prefecture[] }) {
  const [healthId, setHealthId] = useState(HEALTH_CHOICES[0].id);
  const [costId, setCostId] = useState(COST_CHOICES[0].id);
  const [rows, setRows] = useState<GapRow[] | null>(null);
  const [correlation, setCorrelation] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const healthChoice = HEALTH_CHOICES.find((c) => c.id === healthId)!;
  const costChoice = COST_CHOICES.find((c) => c.id === costId)!;

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all([
      fetch(`/api/${healthId}`).then((r) => r.json() as Promise<ApiResponse>),
      fetch(`/api/${costId}`).then((r) => r.json() as Promise<ApiResponse>)
    ]).then(([healthRes, costRes]) => {
      if (cancelled) return;
      const costByCode = new Map(costRes.data.map((d) => [d.areaCode, d.value]));
      const paired = healthRes.data
        .map((h) => {
          const x = costByCode.get(h.areaCode);
          if (x === undefined) return null;
          return { code: h.areaCode, name: h.areaName, x, y: h.value };
        })
        .filter((v): v is { code: string; name: string; x: number; y: number } => v !== null);

      if (paired.length < 5) {
        setRows(null);
        setCorrelation(null);
        setLoading(false);
        return;
      }

      const xs = paired.map((p) => p.x);
      const ys = paired.map((p) => p.y);
      const r = pearsonCorrelation(xs, ys);
      const { slope, intercept } = linearRegression(xs, ys);
      const gapRows: GapRow[] = paired.map((p) => {
        const predicted = intercept + slope * p.x;
        return { ...p, predicted, residual: p.y - predicted };
      });
      gapRows.sort((a, b) => b.residual - a.residual);

      setRows(gapRows);
      setCorrelation(r);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [healthId, costId]);

  const aboveExpected = useMemo(() => rows?.slice(0, 4) ?? [], [rows]);
  const belowExpected = useMemo(() => (rows ? rows.slice(-4).reverse() : []), [rows]);

  return (
    <div className="dm-card" style={{ marginTop: 16 }}>
      <p className="dm-card-eyebrow">⑤ 健康×生活費のギャップ検出</p>
      <p style={{ fontSize: 13, color: "var(--dm-muted)", marginTop: 4 }}>
        健康指標と生活費の品目を1つずつ選ぶと、両者の関係（相関）を計算し、その関係から「予想される値」より大きく外れている都道府県を見つけます。
      </p>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 10 }}>
        <div>
          <label className="dm-field-label">健康指標</label>
          <select className="dm-select" value={healthId} onChange={(e) => setHealthId(e.target.value)}>
            {HEALTH_CHOICES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.icon} {c.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="dm-field-label">生活費品目</label>
          <select className="dm-select" value={costId} onChange={(e) => setCostId(e.target.value)}>
            {COST_CHOICES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.icon} {c.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading && <p style={{ color: "var(--dm-muted)", marginTop: 10 }}>計算中...</p>}

      {!loading && rows === null && (
        <p className="dm-doc-updated" style={{ marginTop: 10 }}>
          ※ この組み合わせでは、両方のデータが揃っている都道府県が少なすぎるため計算できませんでした。
        </p>
      )}

      {!loading && rows !== null && correlation !== null && (
        <>
          <div style={{ marginTop: 12, fontSize: 13 }}>
            {costChoice.label}と{healthChoice.label}の相関係数：
            <strong className="dm-mono" style={{ marginLeft: 4 }}>
              {correlation.toFixed(2)}
            </strong>
            <span style={{ color: "var(--dm-muted)", marginLeft: 6 }}>
              （{Math.abs(correlation) >= 0.5 ? "比較的はっきりした" : Math.abs(correlation) >= 0.25 ? "ゆるやかな" : "ほとんど"}
              {correlation >= 0 ? "正の相関" : "負の相関"}）
            </span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 12 }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--dm-teal-deep)", marginBottom: 6 }}>
                予想より{healthChoice.label}が多い県
              </div>
              <ol style={{ margin: 0, paddingLeft: 20, fontSize: 13 }}>
                {aboveExpected.map((r) => (
                  <li key={r.code} style={{ marginBottom: 4 }}>
                    <Link href={`/prefecture/${prefSlug(prefectures, r.code)}`}>{r.name}</Link>
                  </li>
                ))}
              </ol>
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--dm-coral-deep)", marginBottom: 6 }}>
                予想より{healthChoice.label}が少ない県
              </div>
              <ol style={{ margin: 0, paddingLeft: 20, fontSize: 13 }}>
                {belowExpected.map((r) => (
                  <li key={r.code} style={{ marginBottom: 4 }}>
                    <Link href={`/prefecture/${prefSlug(prefectures, r.code)}`}>{r.name}</Link>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <p className="dm-doc-updated" style={{ marginTop: 10 }}>
            ※「予想される値」は47都道府県の単純な回帰直線から算出した簡易的なものです。相関係数が0に近い場合、この予想自体があまり意味を持たない点にご注意ください。
          </p>
        </>
      )}
    </div>
  );
}

function prefSlug(prefectures: Prefecture[], code: string): string {
  return prefectures.find((p) => p.code === code)?.slug ?? "";
}
