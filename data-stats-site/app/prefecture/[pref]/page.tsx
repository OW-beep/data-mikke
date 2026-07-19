import Link from "next/link";
import { notFound } from "next/navigation";
import { DATASET_LIST, getDataset } from "@/datasets";
import { loadDataset, latestByArea, seriesForArea, rankDescending } from "@/lib/loadData";
import { PREFECTURES, findPrefectureBySlug } from "@/lib/prefectures";
import { COMPOSITE_METRICS, compositeComment } from "@/lib/composite";
import { TrendChart } from "@/components/TrendChart";

export function generateStaticParams() {
  return PREFECTURES.map((p) => ({ pref: p.slug }));
}

export function generateMetadata({ params }: { params: { pref: string } }) {
  const prefecture = findPrefectureBySlug(params.pref);
  if (!prefecture) return {};
  return {
    title: `${prefecture.name}の統計データまとめ`,
    description: `${prefecture.name}の人口・医療・経済などの統計データを、出典・参照年つきで一覧できます。`
  };
}

export default async function PrefecturePage({ params }: { params: { pref: string } }) {
  const prefecture = findPrefectureBySlug(params.pref);
  if (!prefecture) notFound();

  const rows = await Promise.all(
    DATASET_LIST.map(async (dataset) => {
      const points = await loadDataset(dataset.id);
      const latestAll = latestByArea(points);
      const latest = latestAll.find((p) => p.areaCode === prefecture.code);
      const ranked = rankDescending(latestAll);
      const rank = ranked.findIndex((p) => p.areaCode === prefecture.code);
      const average = latestAll.length > 0 ? latestAll.reduce((s, p) => s + p.value, 0) / latestAll.length : null;
      const series =
        dataset.chart === "line"
          ? seriesForArea(points, prefecture.code).map((p) => ({ year: p.year, value: p.value }))
          : [];
      return { dataset, latest, average, rank: rank === -1 ? null : rank + 1, series };
    })
  );

  const rowByDatasetId = new Map(rows.map((r) => [r.dataset.id, r]));

  const composite = COMPOSITE_METRICS.map((m) => {
    const row = rowByDatasetId.get(m.datasetId);
    const dataset = getDataset(m.datasetId);
    if (!row?.latest || row.average === null || !dataset) return null;
    const favorable = m.direction === "up" ? row.latest.value > row.average : row.latest.value < row.average;
    return { title: dataset.title, favorable };
  }).filter((c): c is { title: string; favorable: boolean } => c !== null);

  const compositeScore = composite.filter((c) => c.favorable).length;
  const compositeTotal = composite.length;

  const categories = Array.from(new Set(DATASET_LIST.map((d) => d.category)));

  return (
    <div>
      <p className="dm-eyebrow">都道府県ページ</p>
      <h1>{prefecture.name}</h1>

      {compositeTotal > 0 && (
        <>
          <div className="dm-composite">
            <div className="dm-composite-score">
              {compositeScore}
              <span> / {compositeTotal}</span>
            </div>
            <div className="dm-composite-body">
              <p>
                <strong>{prefecture.name}の総合力スコア</strong> — 県民所得・人口10万人あたり病院数・持ち家比率・年少人口割合・高齢化率の5指標のうち、全国平均より良い方向にある指標の数です。
              </p>
              <p style={{ marginTop: 6 }}>{compositeComment(compositeScore, compositeTotal)}</p>
              <div className="dm-composite-tags">
                {composite.map((c) => (
                  <span key={c.title} className={`dm-composite-tag ${c.favorable ? "dm-tag-up" : "dm-tag-down"}`}>
                    {c.favorable ? "◎" : "△"} {c.title}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <p className="dm-doc-updated">
            ※ 当サイトが独自に定義した簡易的な集計であり、学術的な評価指標ではありません。詳しくは
            <Link href="/articles/prefecture-composite-score-explained">解説記事</Link>
            をご覧ください。
          </p>
        </>
      )}

      {categories.map((category) => (
        <div key={category} style={{ marginTop: 32 }}>
          <h2>{category}</h2>
          <table className="dm-table" style={{ marginTop: 12 }}>
            <thead>
              <tr>
                <th>指標</th>
                <th className="dm-num">値</th>
                <th className="dm-num" style={{ width: 70 }}>
                  年
                </th>
                <th className="dm-num" style={{ width: 90 }}>
                  全国順位
                </th>
              </tr>
            </thead>
            <tbody>
              {rows
                .filter((r) => r.dataset.category === category)
                .map(({ dataset, latest, rank }) => (
                  <tr key={dataset.id}>
                    <td>
                      <Link href={`/dashboard/${dataset.id}`}>{dataset.title}</Link>
                    </td>
                    <td className="dm-num dm-mono">
                      {latest ? `${latest.value.toLocaleString()} ${dataset.unit}` : "データなし"}
                    </td>
                    <td className="dm-num dm-mono" style={{ color: "var(--dm-muted)" }}>
                      {latest?.year ?? "-"}
                    </td>
                    <td className="dm-num dm-mono" style={{ color: "var(--dm-muted)" }}>
                      {rank ? `${rank}位 / 47` : "-"}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      ))}

      {rows.some((r) => r.dataset.chart === "line" && r.series.length > 0) && (
        <div style={{ marginTop: 40 }}>
          <h2>推移グラフ</h2>
          <div className="dm-chart-grid">
            {rows
              .filter((r) => r.dataset.chart === "line" && r.series.length > 0)
              .map(({ dataset, series }) => (
                <div key={dataset.id} className="dm-chart-card">
                  <h3>{dataset.title}</h3>
                  <TrendChart data={series} unit={dataset.unit} height={200} />
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
