"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Prefecture } from "@/lib/prefectures";
import { COST_ITEMS, EXTRA_COST_CATALOG, average, median } from "@/lib/kurashiCostItems";

interface ApiPoint {
  areaCode: string;
  areaName: string;
  year: number;
  value: number;
}
interface ApiResponse {
  data: ApiPoint[];
}

/** 生活費指数の算出に使う19品目（データセット化されている、全47都道府県で欠損のない品目のみ） */
const INDEX_ITEM_IDS = [...COST_ITEMS.map((i) => i.id), ...EXTRA_COST_CATALOG.map((i) => i.id)];

interface Row {
  code: string;
  name: string;
  incomeThousandYen: number;
  costIndex: number;
  ratio: number; // 所得(円) ÷ 生活費指数。大きいほど「所得に対して生活費が軽い」
}

export function CostPerformanceRanking({
  prefectures,
  highlightCodes
}: {
  prefectures: Prefecture[];
  highlightCodes: string[];
}) {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      fetch("/api/income").then((r) => r.json() as Promise<ApiResponse>),
      ...INDEX_ITEM_IDS.map((id) => fetch(`/api/${id}`).then((r) => r.json() as Promise<ApiResponse>))
    ])
      .then(([incomeRes, ...costResList]) => {
        if (cancelled) return;
        const costByCode = new Map<string, number>();
        let itemsWithFullCoverage = 0;
        costResList.forEach((res) => {
          if (res.data.length !== prefectures.length) return; // 47件揃っていない品目は指数から除外
          itemsWithFullCoverage++;
          res.data.forEach((d) => {
            costByCode.set(d.areaCode, (costByCode.get(d.areaCode) ?? 0) + d.value);
          });
        });

        const result: Row[] = incomeRes.data
          .map((d) => {
            const costIndex = costByCode.get(d.areaCode);
            if (costIndex === undefined) return null;
            return {
              code: d.areaCode,
              name: d.areaName,
              incomeThousandYen: d.value,
              costIndex,
              ratio: (d.value * 1000) / costIndex
            };
          })
          .filter((r): r is Row => r !== null)
          .sort((a, b) => b.ratio - a.ratio);

        if (itemsWithFullCoverage === 0 || result.length === 0) {
          setError(true);
        } else {
          setRows(result);
        }
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefectures.length]);

  const best5 = useMemo(() => rows?.slice(0, 5) ?? [], [rows]);
  const worst5 = useMemo(() => (rows ? rows.slice(-5).reverse() : []), [rows]);
  const highlighted = useMemo(
    () => (rows ? rows.filter((r) => highlightCodes.includes(r.code)) : []),
    [rows, highlightCodes]
  );

  if (error) {
    return (
      <p className="dm-doc-updated">
        ※ コスパ県ランキングの算出に必要なデータを取得できませんでした。ページを再読み込みしてみてください。
      </p>
    );
  }

  return (
    <div className="dm-card" style={{ marginTop: 16 }}>
      <p className="dm-card-eyebrow">④ 所得×生活費</p>
      <p style={{ fontSize: 13, color: "var(--dm-muted)", marginTop: 4 }}>
        「県民所得」（1人当たり、2022年度）を「生活費指数」（データセット化済みの{INDEX_ITEM_IDS.length}品目の合計）で割った、当サイト独自の
        <strong>コスパ指数</strong>
        。数値が大きいほど、生活費の負担に対して所得が高い＝「コスパが良い」とみなせます。
      </p>

      {!rows ? (
        <p style={{ color: "var(--dm-muted)" }}>読み込み中...</p>
      ) : (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 12 }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--dm-teal-deep)", marginBottom: 6 }}>
                コスパが良い県 TOP5
              </div>
              <ol style={{ margin: 0, paddingLeft: 20, fontSize: 13 }}>
                {best5.map((r) => (
                  <li key={r.code} style={{ marginBottom: 4 }}>
                    <Link href={`/prefecture/${prefSlugFromCode(prefectures, r.code)}`}>{r.name}</Link>
                    <span className="dm-mono" style={{ color: "var(--dm-muted)", marginLeft: 6 }}>
                      {r.ratio.toFixed(1)}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--dm-coral-deep)", marginBottom: 6 }}>
                コスパが厳しい県 TOP5
              </div>
              <ol style={{ margin: 0, paddingLeft: 20, fontSize: 13 }}>
                {worst5.map((r) => (
                  <li key={r.code} style={{ marginBottom: 4 }}>
                    <Link href={`/prefecture/${prefSlugFromCode(prefectures, r.code)}`}>{r.name}</Link>
                    <span className="dm-mono" style={{ color: "var(--dm-muted)", marginLeft: 6 }}>
                      {r.ratio.toFixed(1)}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {highlighted.length > 0 && (
            <div style={{ marginTop: 14, fontSize: 13 }}>
              {highlighted.map((r) => (
                <div key={r.code}>
                  今比較中の<strong>{r.name}</strong>は、47都道府県中
                  <strong className="dm-mono"> {rows.findIndex((x) => x.code === r.code) + 1}位</strong>
                  （コスパ指数 {r.ratio.toFixed(1)}）です。
                </div>
              ))}
            </div>
          )}

          <p className="dm-doc-updated" style={{ marginTop: 10 }}>
            ※ 所得は年額・生活費指数は月額の品目と単発の品目が混在した簡易的な合計のため、厳密な実質収入の比較ではありません。あくまで当サイト独自の目安です。全国の平均は
            {(() => {
              const avg = average(rows.map((r) => r.ratio));
              const med = median(rows.map((r) => r.ratio));
              return avg !== null && med !== null ? `平均 ${avg.toFixed(1)}・中央値 ${med.toFixed(1)}` : "-";
            })()}
            です。
          </p>
        </>
      )}
    </div>
  );
}

function prefSlugFromCode(prefectures: Prefecture[], code: string): string {
  return prefectures.find((p) => p.code === code)?.slug ?? "";
}
