import Link from "next/link";
import { getArticle } from "@/articles";
import { getDataset } from "@/datasets";

export const metadata = {
  title: "人口統計 特集｜データみっけ",
  description:
    "人口・人口密度・高齢化率・出生率・離婚率など、都道府県の「人」にまつわる統計を、データセットと解説記事でまとめて見られる特集ページです。"
};

const ARTICLE_SLUGS = [
  "population-ranking-how-to-read",
  "population-density-meaning",
  "density-and-income-relation",
  "population-density-correlates-income-crime-homeownership",
  "aging-ratio-top-prefectures",
  "children-ratio-and-regional-future",
  "divorce-rate-regional-gap",
  "birthrate-smallest-gap-okinawa-tokyo",
  "population-does-not-equal-convenience-per-capita-lesson"
];

const DATASET_IDS = ["population", "density", "agingRatio", "childrenRatio", "birthrate", "divorce"];

export default function PopulationFeaturePage() {
  const articles = ARTICLE_SLUGS.map((slug) => getArticle(slug)).filter(
    (a): a is NonNullable<typeof a> => !!a && !a.noindex
  );
  const datasets = DATASET_IDS.map((id) => getDataset(id)).filter(
    (d): d is NonNullable<typeof d> => !!d
  );

  return (
    <div>
      <p className="dm-eyebrow">特集</p>
      <h1>人口統計 特集</h1>
      <p className="dm-lede">
        都道府県別の「人」に関わる数字を集めた特集です。単純な人口の大小だけでなく、人口密度・高齢化率・出生率・離婚率といった指標を組み合わせることで、その県の実態がより立体的に見えてきます。当サイトの中でも、記事・データセットともに最も厚く扱っているテーマです。
      </p>

      <h2>関連データセット</h2>
      <div className="dm-grid">
        {datasets.map((d) => (
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

      <h2 style={{ marginTop: 32 }}>関連記事</h2>
      <div className="dm-article-row-list">
        {articles.map((a) => (
          <div key={a.slug} className="dm-article-row">
            <Link href={`/articles/${a.slug}`}>{a.title}</Link>
          </div>
        ))}
      </div>

      <p className="dm-back-link" style={{ marginTop: 24 }}>
        <Link href="/articles">解説記事一覧に戻る</Link>
      </p>
    </div>
  );
}
