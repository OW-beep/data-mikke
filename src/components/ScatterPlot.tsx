"use client";

import { ScatterChart, Scatter, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ZAxis } from "recharts";

interface ScatterPlotProps {
  data: { areaName: string; x: number; y: number }[];
  xLabel: string;
  yLabel: string;
}

/**
 * 2つの指標の関係を都道府県ごとの散布図で見せるコンポーネント。
 * 相関係数を言葉だけで説明するより、実際の分布を見たほうが説得力が上がるため、
 * 相関・疑似相関を扱う記事で使う。
 */
export function ScatterPlot({ data, xLabel, yLabel }: ScatterPlotProps) {
  if (data.length === 0) {
    return <p style={{ color: "var(--dm-muted)" }}>データがありません。</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={340}>
      <ScatterChart margin={{ top: 10, right: 20, bottom: 10, left: 10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--dm-line)" />
        <XAxis
          type="number"
          dataKey="x"
          name={xLabel}
          tickFormatter={(v) => v.toLocaleString()}
          tick={{ fill: "var(--dm-muted)", fontSize: 11 }}
          label={{ value: xLabel, position: "insideBottom", offset: -6, fill: "var(--dm-ink-soft)", fontSize: 12 }}
        />
        <YAxis
          type="number"
          dataKey="y"
          name={yLabel}
          tickFormatter={(v) => v.toLocaleString()}
          tick={{ fill: "var(--dm-muted)", fontSize: 11 }}
          width={70}
          label={{ value: yLabel, angle: -90, position: "insideLeft", fill: "var(--dm-ink-soft)", fontSize: 12 }}
        />
        <ZAxis range={[60, 60]} />
        <Tooltip
          cursor={{ strokeDasharray: "3 3" }}
          formatter={(value: number, name: string) => [value.toLocaleString(), name]}
          labelFormatter={() => ""}
          content={({ active, payload }) => {
            if (!active || !payload || payload.length === 0) return null;
            const p = payload[0].payload as { areaName: string; x: number; y: number };
            return (
              <div
                style={{
                  background: "var(--dm-bg-card)",
                  border: "1px solid var(--dm-line)",
                  borderRadius: 4,
                  padding: "6px 10px",
                  fontSize: 12
                }}
              >
                <div style={{ fontWeight: 700 }}>{p.areaName}</div>
                <div>
                  {xLabel}: {p.x.toLocaleString()}
                </div>
                <div>
                  {yLabel}: {p.y.toLocaleString()}
                </div>
              </div>
            );
          }}
        />
        <Scatter data={data} fill="var(--dm-teal)" fillOpacity={0.75} />
      </ScatterChart>
    </ResponsiveContainer>
  );
}
