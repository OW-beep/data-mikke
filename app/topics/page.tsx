import Link from "next/link";
import { SITE } from "@/lib/site";
import { TOPICS, getTopicArticles } from "@/lib/topics";

export const metadata = {
  title: "テーマ別ガイド",
  description: `${SITE.name}の解説記事を、人口・所得・物価・健康・産業などのテーマ別にまとめた一覧です。知りたいテーマから、関連する記事をまとめて読めます。`
};

export default function TopicsIndexPage() {
  return (
    <div>
      <p className="dm-eyebrow">Topics</p>
      <h1>テーマ別ガイド</h1>
      <p className="dm-lede">
        解説記事を、テーマごとにまとめました。知りたい分野から、関連する記事を順に読めます。
      </p>
      <div className="dm-usecase-grid" style={{ marginTop: 24 }}>
        {TOPICS.map((t) => (
          <Link key={t.slug} href={`/topics/${t.slug}`} className="dm-usecase-card">
            <p className="dm-usecase-title">{t.title}</p>
            <p className="dm-usecase-desc">
              {t.short}（{getTopicArticles(t).length}本）
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
