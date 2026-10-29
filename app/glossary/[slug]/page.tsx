import Link from "next/link";
import { notFound } from "next/navigation";
import { SITE } from "@/lib/site";
import { GLOSSARY, getTerm, termHref } from "@/lib/glossary";
import { getArticle } from "@/articles";

export function generateStaticParams() {
  return GLOSSARY.filter((t) => t.page).map((t) => ({ slug: t.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const t = getTerm(params.slug);
  if (!t || !t.page) return {};
  const name = t.term.replace(/（.*$/, "");
  return {
    title: `${name}とは？意味・計算のしかた・読み方（${SITE.name}）`.slice(0, 60),
    description: `${t.summary} ${t.example}`.slice(0, 118)
  };
}

export default function GlossaryTermPage({ params }: { params: { slug: string } }) {
  const t = getTerm(params.slug);
  if (!t || !t.page) notFound();
  const term = t!;
  const name = term.term.replace(/（.*$/, "");
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    name: term.term,
    description: term.summary,
    inDefinedTermSet: `${SITE.url}/glossary`,
    url: `${SITE.url}/glossary/${term.slug}`
  };
  const related = term.related.map((r) => getTerm(r)).filter((x): x is NonNullable<typeof x> => !!x);
  const articles = term.articles.map((s) => getArticle(s)).filter((a): a is NonNullable<typeof a> => !!a);

  return (
    <div className="dm-doc">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <p className="dm-eyebrow">
        <Link href="/glossary">統計用語集</Link>
      </p>
      <h1>
        {name}とは？意味・読み方・注意点
      </h1>
      <section className="dm-keypoints" aria-label="ひとことで言うと">
        <p className="dm-keypoints-label">ひとことで言うと</p>
        <p>{term.summary}</p>
      </section>

      <h2>{name}の意味</h2>
      {term.body.map((p, i) => (
        <p key={i}>{p}</p>
      ))}

      {term.sections.map((s) => (
        <div key={s.h}>
          <h2>{s.h}</h2>
          {s.p.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      ))}

      <h2>読むときの注意</h2>
      <ul>
        {term.notes.map((n, i) => (
          <li key={i}>{n}</li>
        ))}
      </ul>

      <h2>当サイトのデータでの例</h2>
      <p>{term.example}</p>
      {term.opinion && <p>【運営者の考え方】{term.opinion}</p>}

      {term.faq.length > 0 && (
        <section className="dm-faq">
          <h2>よくある質問</h2>
          <dl>
            {term.faq.map((f, i) => (
              <div key={i}>
                <dt>{f.q}</dt>
                <dd>{f.a}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {(related.length > 0 || articles.length > 0) && (
        <section className="dm-topic-box">
          {related.length > 0 && (
            <>
              <p className="dm-topic-box-label">あわせて読みたい用語</p>
              <ul>
                {related.map((r) => (
                  <li key={r.slug}>
                    <Link href={termHref(r)}>{r.term}</Link>：{r.summary}
                  </li>
                ))}
              </ul>
            </>
          )}
          {articles.length > 0 && (
            <>
              <p className="dm-topic-box-label">この用語が出てくる記事</p>
              <ul>
                {articles.map((a) => (
                  <li key={a.slug}>
                    <Link href={`/articles/${a.slug}`}>{a.title}</Link>
                  </li>
                ))}
              </ul>
            </>
          )}
          <p>
            <Link href="/glossary">統計用語集の一覧へ →</Link>
          </p>
        </section>
      )}

      <p className="dm-doc-updated">最終更新: 2026-10-27</p>
    </div>
  );
}
