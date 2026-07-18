import Link from "next/link";
import { DATASET_LIST } from "@/datasets";

export const metadata = {
  title: "データ一覧",
  description: "データみっけが掲載している全ての統計データセットの一覧。カテゴリ別にまとめています。"
};

export default function DatasetsIndexPage() {
  const categories = Array.from(new Set(DATASET_LIST.map((d) => d.category)));

  return (
    <div>
      <p className="dm-eyebrow">Datasets</p>
      <h1>データ一覧</h1>
      <p className="dm-lede">掲載している統計データセットの一覧です。カテゴリごとにまとめています。</p>

      {categories.map((category) => (
        <div key={category} style={{ marginTop: 32 }}>
          <h2>{category}</h2>
          <div className="dm-grid">
            {DATASET_LIST.filter((d) => d.category === category).map((d) => (
              <div key={d.id} className="dm-card">
                <p className="dm-card-eyebrow">{d.source}</p>
                <h3>
                  <Link href={`/dashboard/${d.id}`}>{d.title}</Link>
                </h3>
                <p className="dm-card-meta">{d.description}</p>
                <div className="dm-card-links">
                  <Link href={`/dashboard/${d.id}`}>ダッシュボード</Link>
                  {d.ranking && <Link href={`/ranking/${d.id}`}>ランキング</Link>}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
