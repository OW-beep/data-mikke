import Link from "next/link";
import { DATASET_LIST } from "@/datasets";
import { ARTICLE_LIST } from "@/articles";
import { getCategoryColor, getCategoryEmoji } from "@/lib/categoryColors";

export default function HomePage() {
  const latestArticles = ARTICLE_LIST.slice(0, 8);
  const featuredArticles = ARTICLE_LIST.filter((a) => a.featured).slice(0, 4);

  const categories = Array.from(new Set(DATASET_LIST.map((d) => d.category))).map((category) => ({
    category,
    count: DATASET_LIST.filter((d) => d.category === category).length
  }));

  return (
    <div>
      <p className="dm-eyebrow">都道府県統計図鑑</p>
      <h1>
        知りたい数字を、
        <br />
        みっけ。
      </h1>
      <p className="dm-lede">
        e-Stat・総務省統計局・国土地理院などが公開するオープンデータを、都道府県ごとに見つけて、比べて、
        意味を読み解ける形に整えました。数字は標本のように、出典・年・単位をつけてお届けします。
      </p>

      <div className="dm-cta-box" style={{ marginTop: 20 }}>
        <p className="dm-cta-title">まずはここから</p>
        <div className="dm-cta-links">
          <Link href="/datasets">全データセットを見る →</Link>
          <Link href="/articles/prefecture-livability-ranking-five-metrics">住みやすさランキングを見る →</Link>
          <Link href="/compare">2つの都道府県を比較する →</Link>
          <Link href="/analysis">相関・変動係数を分析する →</Link>
        </div>
      </div>

      <hr className="dm-divider" />

      <h2>カテゴリから探す</h2>
      <div className="dm-category-grid">
        {categories.map(({ category, count }) => {
          const color = getCategoryColor(category);
          return (
            <Link
              key={category}
              href={`/datasets#${encodeURIComponent(category)}`}
              className="dm-category-pill"
              style={{ borderColor: color }}
            >
              <span className="dm-category-pill-emoji">{getCategoryEmoji(category)}</span>
              <span className="dm-category-pill-name">{category}</span>
              <span className="dm-category-pill-count">{count}</span>
            </Link>
          );
        })}
      </div>

      <hr className="dm-divider" />

      <div className="dm-grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 32 }}>
        <div>
          <h2>新着記事</h2>
          <div className="dm-article-row-list">
            {latestArticles.map((a, i) => (
              <div key={a.slug} className="dm-article-row">
                {i === 0 && <span className="dm-article-row-badge dm-badge-new">NEW</span>}
                <Link href={`/articles/${a.slug}`}>{a.title}</Link>
              </div>
            ))}
          </div>
          <div className="dm-back-link">
            <Link href="/articles">解説記事をすべて見る →</Link>
          </div>
        </div>

        <div>
          <h2>おすすめ記事</h2>
          <div className="dm-article-row-list">
            {featuredArticles.map((a) => (
              <div key={a.slug} className="dm-article-row">
                <span className="dm-article-row-badge dm-badge-hot">PICK</span>
                <Link href={`/articles/${a.slug}`}>{a.title}</Link>
              </div>
            ))}
          </div>
          <p className="dm-doc-updated" style={{ marginTop: 8 }}>
            ※ アクセス解析データではなく、当サイトが選んだおすすめ記事です。
          </p>
        </div>
      </div>
    </div>
  );
}
