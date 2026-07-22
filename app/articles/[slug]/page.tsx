import Link from "next/link";
import { notFound } from "next/navigation";
import { ARTICLE_LIST, getArticle } from "@/articles";
import { getDataset } from "@/datasets";
import { loadDataset, latestByArea, rankDescending } from "@/lib/loadData";
import { PREFECTURES } from "@/lib/prefectures";

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

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const article = getArticle(params.slug);
  if (!article) notFound();

  const relatedDataset = article.relatedDataset ? getDataset(article.relatedDataset) : undefined;
  const embedDataset = article.embedRanking ? getDataset(article.embedRanking) : undefined;

  const rankedRows = embedDataset
    ? rankDescending(latestByArea(await loadDataset(embedDataset.id)))
    : null;

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

      {embedDataset && rankedRows && (
        <div style={{ marginTop: 32 }}>
          <h2>
            {embedDataset.title}ランキング（全{rankedRows.length}都道府県・{rankedRows[0]?.year ?? "-"}年時点）
          </h2>
          <table className="dm-table">
            <thead>
              <tr>
                <th style={{ width: 60 }}>順位</th>
                <th>都道府県</th>
                <th className="dm-num">値</th>
              </tr>
            </thead>
            <tbody>
              {rankedRows.map((row, i) => {
                const pref = PREFECTURES.find((p) => p.code === row.areaCode);
                return (
                  <tr key={row.areaCode}>
                    <td className="dm-mono">{i + 1}</td>
                    <td>{pref ? <Link href={`/prefecture/${pref.slug}`}>{row.areaName}</Link> : row.areaName}</td>
                    <td className="dm-num dm-mono">
                      {row.value.toLocaleString()} {embedDataset.unit}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

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
