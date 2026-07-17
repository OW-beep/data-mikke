import Link from "next/link";
import { ARTICLE_LIST } from "@/articles";
import { SITE } from "@/lib/site";

export const metadata = {
  title: "解説記事",
  description: `${SITE.name}が公開する、統計データの読み方・比較のポイントに関する解説記事の一覧。`
};

export default function ArticlesIndexPage() {
  return (
    <div>
      <p className="dm-eyebrow">Articles</p>
      <h1>解説記事</h1>
      <p className="dm-lede">
        数字だけでは伝わらない「読み方」や「比較するときの注意点」を、記事としてまとめています。
      </p>

      <div className="dm-article-list">
        {ARTICLE_LIST.map((article) => (
          <div key={article.slug} className="dm-article-item">
            <div className="dm-article-meta">{article.publishedAt}</div>
            <h3>
              <Link href={`/articles/${article.slug}`}>{article.title}</Link>
            </h3>
            <p className="dm-article-excerpt">{article.excerpt}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
