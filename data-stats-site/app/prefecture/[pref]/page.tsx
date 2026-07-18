import Link from "next/link";
import { notFound } from "next/navigation";
import { DATASET_LIST } from "@/datasets";
import { loadDataset, latestByArea, seriesForArea, rankDescending } from "@/lib/loadData";
import { PREFECTURES, findPrefectureBySlug } from "@/lib/prefectures";
import { TrendChart } from "@/components/TrendChart";

export function generateStaticParams() {
  return PREFECTURES.map((p) => ({ pref: p.slug }));
}

export function generateMetadata({ params }: { params: { pref: string } }) {
  const prefecture = findPrefectureBySlug(params.pref);
  if (!prefecture) return {};
  return {
    title: `${prefecture.name}の統計データまとめ`,
    description: `${prefecture.name}の人口・医療などの統計データを、出典・参照年つきで一覧できます。`
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
      const series =
        dataset.chart === "line"
          ? seriesForArea(points, prefecture.code).map((p) => ({ year: p.year, value: p.value }))
          : [];
      return { dataset, latest, rank: rank === -1 ? null : rank + 1, series };
    })
  );

  return (
    <div>
      <p className="dm-eyebrow">都道府県ページ</p>
      <h1>{prefecture.name}</h1>

      <table className="dm-table" style={{ marginTop: 24 }}>
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
          {rows.map(({ dataset, latest, rank }) => (
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

      {rows
        .filter((r) => r.dataset.chart === "line" && r.series.length > 0)
        .map(({ dataset, series }) => (
          <div key={dataset.id} style={{ marginTop: 40 }}>
            <h2>
              {prefecture.name}の{dataset.title}の推移
            </h2>
            <TrendChart data={series} unit={dataset.unit} />
          </div>
        ))}
    </div>
  );
}
