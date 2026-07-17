import Link from "next/link";
import { notFound } from "next/navigation";
import { getDataset, DATASET_LIST } from "@/datasets";
import { loadDataset, latestByArea, rankDescending } from "@/lib/loadData";
import { findPrefectureByCode } from "@/lib/prefectures";

export function generateStaticParams() {
  return DATASET_LIST.filter((d) => d.ranking).map((d) => ({ dataset: d.id }));
}

export default async function RankingPage({ params }: { params: { dataset: string } }) {
  const dataset = getDataset(params.dataset);
  if (!dataset || !dataset.ranking) notFound();

  const points = await loadDataset(dataset.id);
  const ranked = rankDescending(latestByArea(points));

  return (
    <div>
      <p className="dm-eyebrow">
        <Link href={`/dashboard/${dataset.id}`}>{dataset.title}</Link>
      </p>
      <h1>{dataset.title}ランキング</h1>
      <p className="dm-lede">47都道府県を{dataset.title}の値が大きい順に並べています。</p>

      <table className="dm-table" style={{ marginTop: 24 }}>
        <thead>
          <tr>
            <th style={{ width: 40 }}>順位</th>
            <th>都道府県</th>
            <th className="dm-num">
              {dataset.title}（{dataset.unit}）
            </th>
            <th className="dm-num" style={{ width: 70 }}>
              年
            </th>
          </tr>
        </thead>
        <tbody>
          {ranked.map((p, i) => (
            <tr key={p.areaCode}>
              <td>
                <span className={`dm-rank ${i < 3 ? "top" : ""}`}>{i + 1}</span>
              </td>
              <td>
                <Link href={`/prefecture/${findPrefectureByCode(p.areaCode)?.slug ?? p.areaCode}`}>
                  {p.areaName}
                </Link>
              </td>
              <td className="dm-num dm-mono">{p.value.toLocaleString()}</td>
              <td className="dm-num dm-mono" style={{ color: "var(--dm-muted)" }}>
                {p.year}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
