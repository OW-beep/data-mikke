import Link from "next/link";
import { notFound } from "next/navigation";
import { SITE } from "@/lib/site";
import { TOPICS, getTopicArticles } from "@/lib/topics";

export function generateStaticParams() {
  return TOPICS.map((t) => ({ slug: t.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const topic = TOPICS.find((t) => t.slug === params.slug);
  if (!topic) return {};
  return {
    title: `${topic.title}のテーマ別ガイド`,
    description: `${topic.lead}`.slice(0, 120)
  };
}

export default function TopicPage({ params }: { params: { slug: string } }) {
  const topic = TOPICS.find((t) => t.slug === params.slug);
  if (!topic) notFound();
  const articles = getTopicArticles(topic!);
  const others = TOPICS.filter((t) => t.slug !== topic!.slug);

  return (
    <div>
      <p className="dm-eyebrow">
        <Link href="/topics">テーマ別ガイド</Link>
      </p>
      <h1>{topic!.title}</h1>
      <p className="dm-lede">{topic!.lead}</p>
      <p className="dm-article-meta">{articles.length}本の記事 ／ {SITE.name}</p>

      <div className="dm-article-list">
        {articles.map((a) => (
          <div key={a.slug} className="dm-article-item">
            <div className="dm-article-meta">{a.publishedAt}</div>
            <h3>
              <Link href={`/articles/${a.slug}`}>{a.title}</Link>
            </h3>
            <p className="dm-article-excerpt">{a.excerpt}</p>
          </div>
        ))}
      </div>

      <h2 style={{ marginTop: 40 }}>ほかのテーマ</h2>
      <p>
        {others.map((t, i) => (
          <span key={t.slug}>
            {i > 0 && " ・ "}
            <Link href={`/topics/${t.slug}`}>{t.title}</Link>
          </span>
        ))}
      </p>
    </div>
  );
}
