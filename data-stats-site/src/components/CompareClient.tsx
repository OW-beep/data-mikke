"use client";

import { useEffect, useMemo, useState } from "react";
import { DatasetConfig } from "@/types/data";
import { Prefecture } from "@/lib/prefectures";

interface ApiResponse {
  unit: string;
  data: { areaCode: string; areaName: string; year: number; value: number }[];
}

export function CompareClient({
  datasets,
  prefectures
}: {
  datasets: DatasetConfig[];
  prefectures: Prefecture[];
}) {
  const [datasetId, setDatasetId] = useState(datasets[0]?.id ?? "");
  const [prefA, setPrefA] = useState(prefectures.find((p) => p.slug === "tokyo")?.code ?? prefectures[0]?.code);
  const [prefB, setPrefB] = useState(prefectures.find((p) => p.slug === "osaka")?.code ?? prefectures[1]?.code);
  const [dataA, setDataA] = useState<ApiResponse | null>(null);
  const [dataB, setDataB] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const dataset = useMemo(() => datasets.find((d) => d.id === datasetId), [datasets, datasetId]);

  useEffect(() => {
    if (!datasetId || !prefA || !prefB) return;
    setLoading(true);
    Promise.all([
      fetch(`/api/${datasetId}?areaCode=${prefA}`).then((r) => r.json()),
      fetch(`/api/${datasetId}?areaCode=${prefB}`).then((r) => r.json())
    ])
      .then(([a, b]) => {
        setDataA(a);
        setDataB(b);
      })
      .finally(() => setLoading(false));
  }, [datasetId, prefA, prefB]);

  const latest = (res: ApiResponse | null) =>
    res && res.data.length > 0 ? [...res.data].sort((x, y) => y.year - x.year)[0] : null;

  const latestA = latest(dataA);
  const latestB = latest(dataB);

  return (
    <div>
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap", margin: "24px 0" }}>
        <div>
          <label className="dm-field-label">指標</label>
          <select className="dm-select" value={datasetId} onChange={(e) => setDatasetId(e.target.value)}>
            {datasets.map((d) => (
              <option key={d.id} value={d.id}>
                {d.title}
              </option>
            ))}
          </select>
        </div>
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

      {loading && <p style={{ color: "var(--dm-muted)" }}>読み込み中...</p>}

      {!loading && dataset && (
        <table className="dm-table">
          <thead>
            <tr>
              <th></th>
              <th>{latestA?.areaName ?? "-"}</th>
              <th>{latestB?.areaName ?? "-"}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                {dataset.title}（{dataset.unit}）
              </td>
              <td className="dm-mono">{latestA?.value.toLocaleString() ?? "-"}</td>
              <td className="dm-mono">{latestB?.value.toLocaleString() ?? "-"}</td>
            </tr>
            <tr>
              <td>年</td>
              <td className="dm-mono" style={{ color: "var(--dm-muted)" }}>
                {latestA?.year ?? "-"}
              </td>
              <td className="dm-mono" style={{ color: "var(--dm-muted)" }}>
                {latestB?.year ?? "-"}
              </td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
}
