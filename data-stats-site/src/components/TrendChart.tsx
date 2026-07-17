"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export function TrendChart({ data, unit }: { data: { year: number; value: number }[]; unit: string }) {
  if (data.length === 0) {
    return <p style={{ color: "var(--dm-muted)" }}>データがありません。</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--dm-line)" />
        <XAxis dataKey="year" tick={{ fill: "var(--dm-muted)", fontSize: 12 }} />
        <YAxis
          tickFormatter={(v) => v.toLocaleString()}
          width={80}
          tick={{ fill: "var(--dm-muted)", fontSize: 12 }}
        />
        <Tooltip formatter={(v: number) => [`${v.toLocaleString()} ${unit}`, "値"]} />
        <Line type="monotone" dataKey="value" stroke="var(--dm-teal)" strokeWidth={2} dot={{ r: 3, fill: "var(--dm-coral)" }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
