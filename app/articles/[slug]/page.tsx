import Link from "next/link";
import { notFound } from "next/navigation";
import { SITE } from "@/lib/site";
import { ARTICLE_LIST, getArticle } from "@/articles";
import { getDataset } from "@/datasets";
import { loadDataset, latestByArea, rankDescending } from "@/lib/loadData";
import { PREFECTURES } from "@/lib/prefectures";
import { ScatterPlot } from "@/components/ScatterPlot";
import { RankingBarChart } from "@/components/RankingBarChart";
import { pearsonCorrelation, describeCorrelationStrength } from "@/lib/stats";
import { linkifyPrefectures } from "@/lib/linkifyPrefectures";
import { searchRakutenItems } from "@/lib/rakuten";
import { RakutenProductCard } from "@/components/RakutenProductCard";
import { AdSlot } from "@/components/AdSlot";
import { OPERATOR_BIO, NOTES_ADDED_DATE, FAQ_ADDED_DATE } from "@/lib/operator";
import { renderSourceWithLinks } from "@/lib/sourceLinks";
import { findTopicForArticle, getTopicArticles } from "@/lib/topics";
import { findTermsInText, termHref } from "@/lib/glossary";
import { StaticRankFigure } from "@/components/StaticRankFigure";

export function generateStaticParams() {
  return ARTICLE_LIST.map((a) => ({ slug: a.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const article = getArticle(params.slug);
  if (!article) return {};
  return {
    title: article.seoTitle ?? article.title,
    description: article.metaDescription ?? article.excerpt,
    openGraph: {
      title: article.seoTitle ?? article.title,
      description: article.metaDescription ?? article.excerpt,
      type: "article",
      publishedTime: article.publishedAt
    },
    ...(article.noindex ? { robots: { index: false, follow: true } } : {})
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

  // 静的な図（SVG）: ランキングのグラフがない記事に、上位5県・下位5県の図を出す
  const figureRows =
    relatedDataset && !article.embedRanking ? rankDescending(latestByArea(await loadDataset(relatedDataset.id))) : null;

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

  const rakutenItems = article.affiliateKeyword
    ? await searchRakutenItems(article.affiliateKeyword)
    : null;

  // この記事で使った統計の出典を、記事の末尾に明示する（E-E-A-T: 出典の透明性）
  const sourceDatasets = Array.from(
    new Set(
      [article.relatedDataset, article.embedRanking, article.embedScatter?.a, article.embedScatter?.b].filter(
        (x): x is string => Boolean(x)
      )
    )
  )
    .map((id) => getDataset(id))
    .filter((d): d is NonNullable<typeof d> => Boolean(d));

  // 分析メモ・運営者の視点を追記した記事は、追記日を最終更新日とする
  const hasAddedNotes = Boolean((article.analysisNote && article.analysisNote.length) || (article.operatorNote && article.operatorNote.length));
  const hasFaq = Boolean(article.faq && article.faq.length);
  const updatedAt = hasFaq && article.publishedAt < FAQ_ADDED_DATE ? FAQ_ADDED_DATE : hasAddedNotes && article.publishedAt < NOTES_ADDED_DATE ? NOTES_ADDED_DATE : article.publishedAt;

  // 本文の「【見出し】本文」形式の段落を、見出し（h2）と本文に分ける。目次（TOC）にも使う
  const parsedBody = article.body.map((p) => {
    const m = p.match(/^【([^】]{1,40})】([\s\S]*)$/);
    return m ? { heading: m[1], text: m[2].trim() } : { heading: undefined as string | undefined, text: p };
  });
  const linkedBody = linkifyPrefectures(parsedBody.map((x) => x.text));
  const tocItems: { id: string; label: string }[] = [
    ...parsedBody.flatMap((x, i) => (x.heading ? [{ id: `sec-${i}`, label: x.heading }] : [])),
    ...(article.faq && article.faq.length ? [{ id: "faq", label: "よくある質問" }] : []),
    ...(article.analysisNote && article.analysisNote.length ? [{ id: "analysis", label: "データみっけの分析メモ" }] : []),
    ...(article.operatorNote && article.operatorNote.length ? [{ id: "operator", label: "運営者の視点" }] : []),
    { id: "sources", label: "この記事で使ったデータの出典" }
  ];

  // 同じテーマの、ほかの記事（記事末尾の導線）
  const topic = findTopicForArticle(article.slug);
  const topicPeers = topic ? getTopicArticles(topic).filter((a) => a.slug !== article.slug).slice(0, 4) : [];

  // 記事に出てくる統計用語（用語集へのリンク）
  const termText = [article.title, ...article.body, ...(article.analysisNote ?? []), ...(article.faq ?? []).map((f) => f.q + f.a)].join("\n");
  const articleTerms = findTermsInText(termText, 5);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    datePublished: article.publishedAt,
    dateModified: updatedAt,
    author: { "@type": "Person", name: SITE.operatorName, url: `${SITE.url}/about`, description: OPERATOR_BIO },
    publisher: { "@type": "Organization", name: SITE.name, url: SITE.url },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE.url}/articles/${article.slug}` }
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: SITE.name, item: SITE.url },
      { "@type": "ListItem", position: 2, name: "解説記事", item: `${SITE.url}/articles` },
      { "@type": "ListItem", position: 3, name: article.title, item: `${SITE.url}/articles/${article.slug}` }
    ]
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <p className="dm-eyebrow">Articles</p>
      <h1>{article.title}</h1>
      <p className="dm-article-meta">
        公開日: {article.publishedAt}
        {updatedAt !== article.publishedAt && <> ／ 最終更新日: {updatedAt}</>}
      </p>
      <p className="dm-article-byline">
        執筆: <Link href="/about">{SITE.operatorName}</Link>
        （元地方公務員・データサイエンティスト）
      </p>

      <section className="dm-keypoints" aria-label="この記事のポイント">
        <p className="dm-keypoints-label">この記事のポイント</p>
        <p>{article.excerpt}</p>
      </section>

      {tocItems.length >= 3 && (
        <nav className="dm-toc" aria-label="目次">
          <p className="dm-toc-label">目次</p>
          <ol>
            {tocItems.map((t) => (
              <li key={t.id}>
                <a href={`#${t.id}`}>{t.label}</a>
              </li>
            ))}
          </ol>
        </nav>
      )}

      <div className="dm-article-body" style={{ marginTop: 24 }}>
        {parsedBody.map((x, i) => (
          <div key={i}>
            {x.heading && <h2 id={`sec-${i}`}>{x.heading}</h2>}
            <p>{linkedBody[i]}</p>
          </div>
        ))}
      </div>

      {relatedDataset && figureRows && figureRows.length >= 10 && (
        <StaticRankFigure title={relatedDataset.title} unit={relatedDataset.unit} rows={figureRows} />
      )}

      {article.faq && article.faq.length > 0 && (
        <section className="dm-faq" id="faq">
          <h2>よくある質問</h2>
          <dl>
            {article.faq.map((f, i) => (
              <div key={i}>
                <dt>{f.q}</dt>
                <dd>{f.a}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {article.analysisNote && article.analysisNote.length > 0 && (
        <section className="dm-note" id="analysis">
          <h2>データみっけの分析メモ</h2>
          {article.analysisNote.map((t, i) => (
            <p key={i}>{t}</p>
          ))}
        </section>
      )}

      {article.operatorNote && article.operatorNote.length > 0 && (
        <section className="dm-note dm-note-operator" id="operator">
          <h2>運営者の視点</h2>
          {article.operatorNote.map((t, i) => (
            <p key={i}>{t}</p>
          ))}
        </section>
      )}

      <section className="dm-source-box" id="sources" aria-label="データの出典と訂正について">
        {sourceDatasets.length > 0 && (
          <>
            <h2>この記事で使ったデータの出典</h2>
            <ul>
              {sourceDatasets.map((d) => (
                <li key={d.id}>
                  <strong>{d.title}</strong>
                  {d.unit ? `（単位: ${d.unit}）` : ""} ／ 出典: {renderSourceWithLinks(d.source)}
                </li>
              ))}
            </ul>
          </>
        )}
        <p>
          数値の扱い方（分母・年次・加工の方法）は<Link href="/editorial-policy">編集方針</Link>に、
          運営者の経歴は<Link href="/about">運営者情報</Link>にまとめています。
          記事の内容に誤りや疑問を見つけた場合は、<Link href="/contact">お問い合わせ</Link>からご連絡ください。確認のうえ、修正して更新日に反映します。
        </p>
      </section>

      {articleTerms.length > 0 && (
        <section className="dm-source-box" aria-label="この記事に出てくる用語">
          <h2>この記事に出てくる用語</h2>
          <ul>
            {articleTerms.map((t) => (
              <li key={t.slug}>
                <Link href={termHref(t)}>{t.term}</Link>：{t.summary}
              </li>
            ))}
          </ul>
          <p>
            ほかの用語は、<Link href="/glossary">統計用語集</Link>で確認できます。
          </p>
        </section>
      )}

      {topic && topicPeers.length > 0 && (
        <section className="dm-topic-box" aria-label="同じテーマの記事">
          <p className="dm-topic-box-label">
            テーマ別ガイド「<Link href={`/topics/${topic.slug}`}>{topic.title}</Link>」の、次に読む記事
          </p>
          <ul>
            {topicPeers.map((a) => (
              <li key={a.slug}>
                <Link href={`/articles/${a.slug}`}>{a.title}</Link>
              </li>
            ))}
          </ul>
          <p>
            <Link href={`/topics/${topic.slug}`}>このテーマの記事を、すべて見る →</Link>
          </p>
        </section>
      )}

      <AdSlot slotId={SITE.adsenseSlots.articleMid} clientId={SITE.adsenseClientId} />

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
          <RankingBarChart
            data={rankedRows.slice(0, 10).map((p) => ({ areaName: p.areaName, value: p.value }))}
            unit={embedDataset.unit}
          />
          <details className="dm-ranking-details">
            <summary>47都道府県すべての順位を表で見る</summary>
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
          </details>
        </div>
      )}

      {relatedDataset && (
        <div className="dm-back-link">
          <Link href={`/dashboard/${relatedDataset.id}`}>
            関連データ「{relatedDataset.title}」のダッシュボードを見る →
          </Link>
        </div>
      )}

      {article.table && (
        <div style={{ marginTop: 32 }}>
          <h2>{article.table.title}</h2>
          <details className="dm-ranking-details">
            <summary>47都道府県すべてを表で見る</summary>
            <table className="dm-table">
              <thead>
                <tr>
                  {article.table.columns.map((col, i) => (
                    <th key={i} className={i === 0 ? undefined : "dm-num"}>
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {article.table.rows.map((row, i) => {
                  const pref = PREFECTURES.find((p) => p.name === row[0]);
                  return (
                    <tr key={i}>
                      {row.map((cell, j) => (
                        <td key={j} className={j === 0 ? undefined : "dm-num dm-mono"}>
                          {j === 0 && pref ? <Link href={`/prefecture/${pref.slug}`}>{cell}</Link> : cell}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </details>
        </div>
      )}

      <AdSlot slotId={SITE.adsenseSlots.articleEnd} clientId={SITE.adsenseClientId} />

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

      {rakutenItems && rakutenItems.length > 0 && (
        <RakutenProductCard heading={`「${article.affiliateKeyword}」を探す`} items={rakutenItems} />
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
