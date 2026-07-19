"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts";

interface RankingBarChartProps {
  data: { areaName: string; value: number }[];
  unit: string;
}

/**
 * 単年（スナップショット）データセット用のランキング棒グラフ。
 * 病院数・県民所得のように「今年の値」しか無いデータセットは、
 * 年ごとの推移を折れ線で描いても点が1つしか無く意味が無いため、
 * 代わりに上位都道府県を横棒グラフで見せる。
 */
export function RankingBarChart({ data, unit }: RankingBarChartProps) {
  if (data.length === 0) {
    return <p style={{ color: "var(--dm-muted)" }}>データがありません。</p>;
  }

  const height = Math.max(220, data.length * 34);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} layout="vertical" margin={{ left: 12, right: 24 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--dm-line)" horizontal={false} />
        <XAxis type="number" tickFormatter={(v) => v.toLocaleString()} tick={{ fill: "var(--dm-muted)", fontSize: 12 }} />
        <YAxis
          type="category"
          dataKey="areaName"
          width={72}
          tick={{ fill: "var(--dm-ink)", fontSize: 12 }}
        />
        <Tooltip formatter={(v: number) => [`${v.toLocaleString()} ${unit}`, "値"]} />
        <Bar dataKey="value" radius={[0, 4, 4, 0]}>
          {data.map((_, i) => (
            <Cell key={i} fill={i === 0 ? "var(--dm-coral)" : "var(--dm-teal)"} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
