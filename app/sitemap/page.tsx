import Link from "next/link";
import { SITE } from "@/lib/site";
import { TOPICS, getTopicArticles, getUncategorizedArticles } from "@/lib/topics";

export const metadata = {
  title: "サイトマップ",
  description: `${SITE.name}の全ページへの案内。テーマ別の解説記事、データ一覧、比較・分析ツール、運営者情報などをまとめています。`
};

export default function SitemapPage() {
  const other = getUncategorizedArticles();
  return (
    <div className="dm-doc">
      <p className="dm-eyebrow">Sitemap</p>
      <h1>サイトマップ</h1>

      <h2>主なページ</h2>
      <ul>
        <li><Link href="/">トップページ</Link></li>
        <li><Link href="/articles">解説記事（新着順）</Link></li>
        <li><Link href="/topics">テーマ別ガイド</Link></li>
        <li><Link href="/glossary">統計用語集</Link></li>
        <li><Link href="/datasets">データ一覧</Link></li>
        <li><Link href="/compare">都道府県の比較</Link></li>
        <li><Link href="/analysis">分析（相関・変動係数）</Link></li>
        <li><Link href="/tools/kurashi">くらしツール</Link></li>
        <li><Link href="/guide">使い方</Link></li>
        <li><Link href="/methodology">統計の読み方ガイド</Link></li>
        <li><Link href="/search">サイト内検索</Link></li>
        <li><Link href="/resources">無料の資料・ダウンロード</Link></li>
        <li><Link href="/consulting">データ分析・可視化のご相談</Link></li>
      </ul>

      {TOPICS.map((t) => (
        <div key={t.slug}>
          <h2>
            <Link href={`/topics/${t.slug}`}>{t.title}</Link>
          </h2>
          <ul>
            {getTopicArticles(t).map((a) => (
              <li key={a.slug}>
                <Link href={`/articles/${a.slug}`}>{a.title}</Link>
              </li>
            ))}
          </ul>
        </div>
      ))}

      {other.length > 0 && (
        <>
          <h2>運営者についての記事</h2>
          <ul>
            {other.map((a) => (
              <li key={a.slug}>
                <Link href={`/articles/${a.slug}`}>{a.title}</Link>
              </li>
            ))}
          </ul>
        </>
      )}

      <h2>サイトについて</h2>
      <ul>
        <li><Link href="/about">運営者情報</Link></li>
        <li><Link href="/editorial-policy">編集方針・データの取り扱い</Link></li>
        <li><Link href="/terms">利用規約・免責事項・著作権</Link></li>
        <li><Link href="/privacy">プライバシーポリシー</Link></li>
        <li><Link href="/contact">お問い合わせ</Link></li>
        <li><Link href="/updates">更新履歴</Link></li>
      </ul>
    </div>
  );
}
