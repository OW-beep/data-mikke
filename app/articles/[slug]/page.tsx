import Link from "next/link";
import { notFound } from "next/navigation";
import { ARTICLE_LIST, getArticle } from "@/articles";
import { getDataset } from "@/datasets";

export function generateStaticParams() {
  return ARTICLE_LIST.map((a) => ({ slug: a.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const article = getArticle(params.slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      publishedTime: article.publishedAt
    }
  };
}

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const article = getArticle(params.slug);
  if (!article) notFound();

  const relatedDataset = article.relatedDataset ? getDataset(article.relatedDataset) : undefined;

  return (
    <div>
      <p className="dm-eyebrow">Articles</p>
      <h1>{article.title}</h1>
      <p className="dm-article-meta">公開日: {article.publishedAt}</p>

      <div className="dm-article-body" style={{ marginTop: 24 }}>
        {article.body.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>

      {relatedDataset && (
        <div className="dm-back-link">
          <Link href={`/dashboard/${relatedDataset.id}`}>
            関連データ「{relatedDataset.title}」のダッシュボードを見る →
          </Link>
        </div>
      )}

      <div className="dm-back-link">
        <Link href="/articles">解説記事一覧に戻る →</Link>
      </div>
    </div>
  );
}
