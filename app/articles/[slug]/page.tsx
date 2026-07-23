import Link from "next/link";
import { notFound } from "next/navigation";
import { ARTICLE_LIST, getArticle } from "@/articles";
import { getDataset } from "@/datasets";
import { loadDataset, latestByArea, rankDescending } from "@/lib/loadData";
import { PREFECTURES } from "@/lib/prefectures";
import { ScatterPlot } from "@/components/ScatterPlot";
import { pearsonCorrelation, describeCorrelationStrength } from "@/lib/stats";

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

  // 散布図の埋め込み: 2つのデータセットの最新値を都道府県コードで突き合わせる
  let scatterData: { areaName: string; x: number; y: number }[] | null = null;
  let scatterDatasetA = undefined;
  let scatterDatasetB = undefined;
  let scatterR: { r: number; n: number } | null = null;
  if (article.embedScatter) {
    scatterDatasetA = getDataset(article.embedScatter.a);
    scatterDatasetB = getDataset(article.embedScatter.b);
    if (scatterDatasetA && scatterDatasetB) {
      const [pointsA, pointsB] = await Promise.all([
        loadDataset(scatterDatasetA.id),
        loadDataset(scatterDatasetB.id)
      ]);
      const mapA = new Map(latestByArea(pointsA).map((p) => [p.areaCode, p]));
      const mapB = new Map(latestByArea(pointsB).map((p) => [p.areaCode, p]));
      scatterData = [...mapA.keys()]
        .filter((code) => mapB.has(code))
        .map((code) => ({
          areaName: mapA.get(code)!.areaName,
          x: mapA.get(code)!.value,
          y: mapB.get(code)!.value
        }));
      scatterR = pearsonCorrelation(
        new Map([...mapA].map(([c, p]) => [c, p.value])),
        new Map([...mapB].map(([c, p]) => [c, p.value]))
      );
    }
  }

  const relatedArticles = (article.relatedArticles ?? [])
    .map((slug) => getArticle(slug))
    .filter((a): a is NonNullable<typeof a> => Boolean(a));

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

      {scatterData && scatterDatasetA && scatterDatasetB && (
        <div style={{ marginTop: 32 }}>
          <h2>
            {scatterDatasetA.title} × {scatterDatasetB.title}（都道府県別散布図）
          </h2>
          <ScatterPlot data={scatterData} xLabel={scatterDatasetA.title} yLabel={scatterDatasetB.title} />
          {scatterR && (
            <p className="dm-doc-updated">
              相関係数 r = {scatterR.r.toFixed(3)}（{describeCorrelationStrength(scatterR.r)}相関、n=
              {scatterR.n}）。点1つが1つの都道府県を表しています。
              {article.embedScatter?.note && <> {article.embedScatter.note}</>}
            </p>
          )}
        </div>
      )}

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

      {relatedArticles.length > 0 && (
        <div className="dm-related-articles">
          <h2>あわせて読みたい</h2>
          <ul>
            {relatedArticles.map((a) => (
              <li key={a.slug}>
                <Link href={`/articles/${a.slug}`}>{a.title}</Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="dm-cta-box">
        <p className="dm-cta-title">この指標を、もっと自分ごとに。</p>
        <div className="dm-cta-links">
          {relatedDataset && <Link href={`/ranking/${relatedDataset.id}`}>全47都道府県のランキングを見る →</Link>}
          <Link href="/compare">気になる2つの都道府県を比較する →</Link>
          <Link href="/analysis">相関・変動係数を分析する →</Link>
        </div>
      </div>

      <div className="dm-back-link">
        <Link href="/articles">解説記事一覧に戻る →</Link>
      </div>
    </div>
  );
}
