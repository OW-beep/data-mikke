import Link from "next/link";
import { getArticle } from "@/articles";
import { getDataset } from "@/datasets";

export const metadata = {
  title: "観光・地域文化 特集｜データみっけ",
  description:
    "国宝・重要文化財、伝統的工芸品、温泉地、喫茶店の軒数など、都道府県の観光・地域文化にまつわる統計を、データセットと解説記事でまとめて見られる特集ページです。"
};

const ARTICLE_SLUGS = [
  "cultural-property-four-ways-to-see-it",
  "traditional-crafts-tokyo-niigata-kyoto",
  "onsen-count-hokkaido-nagano-niigata",
  "cafe-count-nagano-hidden-kingdom"
];

const DATASET_IDS = [
  "culturalProperty",
  "culturalPropertyBuilding",
  "culturalPropertyPerCapita",
  "culturalPropertyPerArea",
  "craft",
  "onsen",
  "cafe",
  "cafePerCapita"
];

export default function TourismCultureFeaturePage() {
  const articles = ARTICLE_SLUGS.map((slug) => getArticle(slug)).filter(
    (a): a is NonNullable<typeof a> => !!a && !a.noindex
  );
  const datasets = DATASET_IDS.map((id) => getDataset(id)).filter(
    (d): d is NonNullable<typeof d> => !!d
  );

  return (
    <div>
      <p className="dm-eyebrow">特集</p>
      <h1>観光・地域文化 特集</h1>
      <p className="dm-lede">
        国宝・重要文化財、伝統的工芸品、温泉地、喫茶店文化など、都道府県ごとの「観光・地域文化」にまつわる数字を集めた特集です。総数・人口あたり・面積あたりと、同じデータでも切り口を変えると1位の顔ぶれが入れ替わる面白さを、当サイトの中でも特に厚く扱っているテーマです。
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
