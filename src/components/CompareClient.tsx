"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { DatasetConfig } from "@/types/data";
import { Prefecture } from "@/lib/prefectures";
import { getCategoryColor, getCategoryEmoji } from "@/lib/categoryColors";

interface ApiResponse {
  data: { areaCode: string; areaName: string; year: number; value: number }[];
}

interface Row {
  dataset: DatasetConfig;
  valueA: number | null;
  valueB: number | null;
  year: number | null;
}

function latestValue(res: ApiResponse | null): { value: number; year: number } | null {
  if (!res || res.data.length === 0) return null;
  const sorted = [...res.data].sort((x, y) => y.year - x.year);
  return { value: sorted[0].value, year: sorted[0].year };
}

export function CompareClient({
  datasets,
  prefectures
}: {
  datasets: DatasetConfig[];
  prefectures: Prefecture[];
}) {
  const [prefA, setPrefA] = useState(prefectures.find((p) => p.slug === "tokyo")?.code ?? prefectures[0]?.code);
  const [prefB, setPrefB] = useState(prefectures.find((p) => p.slug === "osaka")?.code ?? prefectures[1]?.code);
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);

  const nameA = prefectures.find((p) => p.code === prefA)?.name ?? "-";
  const nameB = prefectures.find((p) => p.code === prefB)?.name ?? "-";

  useEffect(() => {
    if (!prefA || !prefB) return;
    let cancelled = false;
    setLoading(true);

    Promise.all(
      datasets.map(async (dataset) => {
        const [resA, resB] = await Promise.all([
          fetch(`/api/${dataset.id}?areaCode=${prefA}`).then((r) => r.json() as Promise<ApiResponse>),
          fetch(`/api/${dataset.id}?areaCode=${prefB}`).then((r) => r.json() as Promise<ApiResponse>)
        ]);
        const a = latestValue(resA);
        const b = latestValue(resB);
        return {
          dataset,
          valueA: a?.value ?? null,
          valueB: b?.value ?? null,
          year: a?.year ?? b?.year ?? null
        };
      })
    ).then((results) => {
      if (!cancelled) {
        setRows(results);
        setLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [datasets, prefA, prefB]);

  const { countA, countB } = useMemo(() => {
    let a = 0;
    let b = 0;
    for (const r of rows) {
      if (r.valueA === null || r.valueB === null) continue;
      if (r.valueA > r.valueB) a++;
      else if (r.valueB > r.valueA) b++;
    }
    return { countA: a, countB: b };
  }, [rows]);

  const categories = useMemo(() => Array.from(new Set(datasets.map((d) => d.category))), [datasets]);

  return (
    <div>
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

      {!loading && rows.length > 0 && (
        <div className="dm-scoreboard">
          <div className="dm-scoreboard-side">
            <div className="dm-scoreboard-name">{nameA}</div>
            <div className="dm-scoreboard-count dm-mono">{countA}</div>
          </div>
          <div className="dm-scoreboard-mid">
            <div>数値が上回った指標の数</div>
          </div>
          <div className="dm-scoreboard-side">
            <div className="dm-scoreboard-name">{nameB}</div>
            <div className="dm-scoreboard-count dm-mono">{countB}</div>
          </div>
        </div>
      )}
      <p className="dm-doc-updated">
        ※ 「数値が大きいほど良い」とは限りません（例: 犯罪発生件数・高齢化率は低い方が望ましい指標です）。あくまで数値の大小の集計です。
      </p>

      {loading && <p style={{ color: "var(--dm-muted)" }}>読み込み中...（{datasets.length}指標を取得しています）</p>}

      {!loading &&
        categories.map((category) => {
          const color = getCategoryColor(category);
          const categoryRows = rows.filter((r) => r.dataset.category === category);
          if (categoryRows.length === 0) return null;

          return (
            <div key={category} style={{ marginTop: 32 }}>
              <h2 style={{ color }}>
                {getCategoryEmoji(category)} {category}
              </h2>
              <table className="dm-table">
                <thead>
                  <tr>
                    <th>指標</th>
                    <th className="dm-num">{nameA}</th>
                    <th style={{ width: 90 }}></th>
                    <th className="dm-num">{nameB}</th>
                  </tr>
                </thead>
                <tbody>
                  {categoryRows.map((r) => {
                    const { valueA, valueB } = r;
                    const max = Math.max(Math.abs(valueA ?? 0), Math.abs(valueB ?? 0)) || 1;
                    const pctA = valueA !== null ? Math.max(4, (Math.abs(valueA) / max) * 100) : 0;
                    const pctB = valueB !== null ? Math.max(4, (Math.abs(valueB) / max) * 100) : 0;
                    const aWins = valueA !== null && valueB !== null && valueA > valueB;
                    const bWins = valueA !== null && valueB !== null && valueB > valueA;

                    return (
                      <tr key={r.dataset.id}>
                        <td>
                          <Link href={`/dashboard/${r.dataset.id}`}>{r.dataset.title}</Link>
                          <div style={{ fontSize: 11, color: "var(--dm-muted)" }}>
                            {r.dataset.unit}・{r.year ?? "-"}年
                          </div>
                        </td>
                        <td className="dm-num dm-mono" style={{ fontWeight: aWins ? 700 : 400 }}>
                          {valueA?.toLocaleString() ?? "-"}
                          <div className="dm-compare-bar">
                            <div
                              className="dm-compare-bar-fill"
                              style={{ width: `${pctA}%`, background: aWins ? color : "var(--dm-line)", marginLeft: "auto" }}
                            />
                          </div>
                        </td>
                        <td style={{ textAlign: "center", color: "var(--dm-muted)", fontSize: 12 }}>vs</td>
                        <td className="dm-num dm-mono" style={{ fontWeight: bWins ? 700 : 400 }}>
                          <div className="dm-compare-bar">
                            <div className="dm-compare-bar-fill" style={{ width: `${pctB}%`, background: bWins ? color : "var(--dm-line)" }} />
                          </div>
                          {valueB?.toLocaleString() ?? "-"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          );
        })}
    </div>
  );
}
