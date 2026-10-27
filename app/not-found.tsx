import Link from "next/link";
import { TOPICS } from "@/lib/topics";

export const metadata = {
  title: "ページが見つかりません"
};

export default function NotFound() {
  return (
    <div>
      <p className="dm-eyebrow">404</p>
      <h1>ページが見つかりませんでした</h1>
      <p className="dm-lede">
        お探しのページは、移動または削除された可能性があります。下のテーマや検索から、知りたい数字を探してみてください。
      </p>
      <p>
        <Link href="/search">サイト内検索へ</Link> ／ <Link href="/articles">解説記事の一覧へ</Link> ／{" "}
        <Link href="/">トップページへ</Link>
      </p>
      <h2>テーマから探す</h2>
      <div className="dm-usecase-grid">
        {TOPICS.map((t) => (
          <Link key={t.slug} href={`/topics/${t.slug}`} className="dm-usecase-card">
            <p className="dm-usecase-title">{t.title}</p>
            <p className="dm-usecase-desc">{t.short}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
