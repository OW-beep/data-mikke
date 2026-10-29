import Link from "next/link";
import { SITE } from "@/lib/site";
import { GLOSSARY, GLOSSARY_CATEGORIES, getTerm, termHref } from "@/lib/glossary";
import { getArticle } from "@/articles";

export const metadata = {
  title: "統計用語集｜平均・中央値・相関係数・人口密度など31語",
  description: `${SITE.name}の記事に出てくる統計用語を、例つきで解説。平均値と中央値、変動係数、相関係数、外れ値、実数と割合、人口密度、合計特殊出生率、県民所得、最低賃金などを、都道府県データの実例で説明します。`
};

export default function GlossaryPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    name: `${SITE.name} 統計用語集`,
    url: `${SITE.url}/glossary`,
    hasDefinedTerm: GLOSSARY.map((t) => ({
      "@type": "DefinedTerm",
      name: t.term,
      description: t.summary,
      url: `${SITE.url}${termHref(t)}`
    }))
  };
  return (
    <div className="dm-doc">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <p className="dm-eyebrow">Glossary</p>
      <h1>統計用語集</h1>
      <p>
        解説記事に出てくる統計の用語を、当サイトのデータを使った例つきで説明します。平均や相関の読み方から、人口密度・県民所得・最低賃金など、指標の名前まで、{GLOSSARY.length}語を載せています。
        数字の扱い方の方針は、<Link href="/editorial-policy">編集方針</Link>にもまとめています。
      </p>

      <nav className="dm-toc" aria-label="用語の目次">
        <p className="dm-toc-label">用語の目次</p>
        {GLOSSARY_CATEGORIES.map((c) => (
          <p key={c} style={{ margin: "6px 0" }}>
            <strong>{c}</strong>：
            {GLOSSARY.filter((t) => t.category === c).map((t, i) => (
              <span key={t.slug}>
                {i > 0 && "・"}
                <a href={`#${t.slug}`}>{t.term.replace(/（.*$/, "")}</a>
              </span>
            ))}
          </p>
        ))}
      </nav>

      {GLOSSARY_CATEGORIES.map((c) => (
        <section key={c}>
          <h2>{c}</h2>
          {GLOSSARY.filter((t) => t.category === c).map((t) => (
            <article key={t.slug} id={t.slug} style={{ marginBottom: 32, scrollMarginTop: 16 }}>
              <h3>
                {t.term}
                <span style={{ fontSize: 13, fontWeight: 400, marginLeft: 8, color: "var(--dm-muted)" }}>（{t.kana}）</span>
              </h3>
              <p>
                <strong>{t.summary}</strong>
              </p>
              {t.body.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
              {t.notes.length > 0 && (
                <ul>
                  {t.notes.map((n, i) => (
                    <li key={i}>{n}</li>
                  ))}
                </ul>
              )}
              <p>
                <strong>例：</strong>
                {t.example}
              </p>
              {t.opinion && <p>【運営者の考え方】{t.opinion}</p>}
              <p style={{ fontSize: 14 }}>
                {t.page && (
                  <>
                    <Link href={`/glossary/${t.slug}`}>「{t.term}」を、くわしく読む →</Link>
                    {"　"}
                  </>
                )}
                {t.related.length > 0 && (
                  <>
                    関連用語：
                    {t.related.map((r, i) => {
                      const rt = getTerm(r);
                      return rt ? (
                        <span key={r}>
                          {i > 0 && "・"}
                          <Link href={termHref(rt)}>{rt.term.replace(/（.*$/, "")}</Link>
                        </span>
                      ) : null;
                    })}
                  </>
                )}
              </p>
              {t.articles.length > 0 && (
                <p style={{ fontSize: 14 }}>
                  関連記事：
                  {t.articles
                    .map((s) => getArticle(s))
                    .filter((a): a is NonNullable<typeof a> => !!a)
                    .map((a, i) => (
                      <span key={a.slug}>
                        {i > 0 && " ／ "}
                        <Link href={`/articles/${a.slug}`}>{a.title.length > 34 ? a.title.slice(0, 34) + "…" : a.title}</Link>
                      </span>
                    ))}
                </p>
              )}
            </article>
          ))}
        </section>
      ))}

      <p className="dm-doc-updated">最終更新: 2026-10-27</p>
    </div>
  );
}
