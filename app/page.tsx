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

      <div className="dm-usecase-grid" style={{ marginTop: 24 }}>
        <Link href="/compare" className="dm-usecase-card">
          <p className="dm-usecase-title">引っ越し・移住先を比べる</p>
          <p className="dm-usecase-desc">気になる2つの都道府県を、家賃・治安・医療などまとめて比較</p>
        </Link>
        <Link href="/articles" className="dm-usecase-card">
          <p className="dm-usecase-title">自由研究・レポートの下調べ</p>
          <p className="dm-usecase-desc">出典付きのデータと解説記事を、そのまま資料に使える形で</p>
        </Link>
        <Link href="/prefecture/tokyo" className="dm-usecase-card">
          <p className="dm-usecase-title">地元・出身地を数字で知る</p>
          <p className="dm-usecase-desc">都道府県ごとのページで、全指標の順位を一気に確認</p>
        </Link>
        <Link href="/analysis" className="dm-usecase-card">
          <p className="dm-usecase-title">地域選定・企画の下調べ</p>
          <p className="dm-usecase-desc">相関・変動係数から、地域ごとの特徴や関連性を確認</p>
        </Link>
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

      <hr className="dm-divider" />

      <h2>データをカテゴリから探す</h2>
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
    </div>
  );
}
