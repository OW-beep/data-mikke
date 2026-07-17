import Link from "next/link";
import { notFound } from "next/navigation";
import { getDataset, DATASET_LIST } from "@/datasets";
import { loadDataset, latestByArea, rankDescending, seriesForArea } from "@/lib/loadData";
import { TrendChart } from "@/components/TrendChart";
import { findPrefectureByCode } from "@/lib/prefectures";

export function generateStaticParams() {
  return DATASET_LIST.map((d) => ({ dataset: d.id }));
}

export function generateMetadata({ params }: { params: { dataset: string } }) {
  const dataset = getDataset(params.dataset);
  if (!dataset) return {};
  return {
    title: `${dataset.title}の統計データ・都道府県別ダッシュボード`,
    description: `${dataset.description ?? dataset.title} 出典: ${dataset.source}（${dataset.frequency}）。都道府県別の推移・上位ランキングを掲載。`
  };
}

export default async function DashboardPage({ params }: { params: { dataset: string } }) {
  const dataset = getDataset(params.dataset);
  if (!dataset) notFound();

  const points = await loadDataset(dataset.id);
  const latest = latestByArea(points);
  const ranked = rankDescending(latest);
  const top5 = ranked.slice(0, 5);

  const total = latest.reduce((sum, p) => sum + p.value, 0);
  const topArea = ranked[0];
  const trend = topArea ? seriesForArea(points, topArea.areaCode) : [];

  return (
    <div>
      <p className="dm-eyebrow">{dataset.category}</p>
      <h1>{dataset.title}</h1>
      <p className="dm-lede">
        {dataset.description} 出典: {dataset.source}（{dataset.frequency}）
      </p>

      <div className="dm-stat-row">
        <div className="dm-stat">
          <div className="dm-stat-label">都道府県合計</div>
          <div className="dm-stat-value dm-mono">
            {total.toLocaleString()}
            <span className="dm-stat-unit">{dataset.unit}</span>
          </div>
        </div>
        <div className="dm-stat">
          <div className="dm-stat-label">最大: {topArea?.areaName ?? "-"}</div>
          <div className="dm-stat-value dm-mono">
            {topArea?.value.toLocaleString() ?? "-"}
            <span className="dm-stat-unit">{dataset.unit}</span>
          </div>
        </div>
      </div>

      <h2>推移（{topArea?.areaName ?? "-"}）</h2>
      <TrendChart data={trend} unit={dataset.unit} />

      <h2 style={{ marginTop: 40 }}>上位5位</h2>
      <table className="dm-table">
        <tbody>
          {top5.map((p, i) => (
            <tr key={p.areaCode}>
              <td style={{ width: 36 }}>
                <span className={`dm-rank ${i === 0 ? "top" : ""}`}>{i + 1}</span>
              </td>
              <td>
                <Link href={`/prefecture/${findPrefectureByCode(p.areaCode)?.slug ?? p.areaCode}`}>
                  {p.areaName}
                </Link>
              </td>
              <td className="dm-num dm-mono">
                {p.value.toLocaleString()} {dataset.unit}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {dataset.ranking && (
        <div className="dm-back-link">
          <Link href={`/ranking/${dataset.id}`}>全国ランキングを見る →</Link>
        </div>
      )}
    </div>
  );
}
