import Link from "next/link";
import { notFound } from "next/navigation";
import { DATASET_LIST } from "@/datasets";
import { loadDataset, latestByArea } from "@/lib/loadData";
import { PREFECTURES, findPrefectureBySlug } from "@/lib/prefectures";

export function generateStaticParams() {
  return PREFECTURES.map((p) => ({ pref: p.slug }));
}

export default async function PrefecturePage({ params }: { params: { pref: string } }) {
  const prefecture = findPrefectureBySlug(params.pref);
  if (!prefecture) notFound();

  const rows = await Promise.all(
    DATASET_LIST.map(async (dataset) => {
      const points = await loadDataset(dataset.id);
      const latest = latestByArea(points).find((p) => p.areaCode === prefecture.code);
      return { dataset, latest };
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
          </tr>
        </thead>
        <tbody>
          {rows.map(({ dataset, latest }) => (
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
