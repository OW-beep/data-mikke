import { DATASET_LIST } from "@/datasets";
import { ARTICLE_LIST } from "@/articles";
import { PREFECTURES } from "@/lib/prefectures";
import { SearchClient } from "@/components/SearchClient";

export const metadata = {
  title: "サイト内検索",
  description: "データみっけのデータセット・解説記事・都道府県ページを横断して検索できます。",
  // サイト内検索結果ページは、Googleのガイドラインでインデックス非推奨とされているためnoindexにする。
  // （参照: https://developers.google.com/search/docs/crawling-indexing/301-redirects#internal-search）
  robots: { index: false, follow: true }
};

export default function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const datasetItems = DATASET_LIST.map((d) => ({
    type: "データ" as const,
    title: d.title,
    description: d.description ?? d.category,
    href: `/dashboard/${d.id}`
  }));

  const articleItems = ARTICLE_LIST.filter((a) => !a.noindex).map((a) => ({
    type: "記事" as const,
    title: a.title,
    description: a.excerpt,
    href: `/articles/${a.slug}`
  }));

  const prefectureItems = PREFECTURES.map((p) => ({
    type: "都道府県" as const,
    title: p.name,
    description: "都道府県別の全指標をまとめて見る",
    href: `/prefecture/${p.slug}`
  }));

  return (
    <div>
      <p className="dm-eyebrow">検索</p>
      <h1>サイト内検索</h1>
      <p className="dm-lede">
        データみっけに掲載しているデータセット・解説記事・都道府県ページを、まとめて検索できます。
      </p>
      <div style={{ marginTop: 24 }}>
        <SearchClient items={[...datasetItems, ...articleItems, ...prefectureItems]} initialQuery={searchParams.q ?? ""} />
      </div>
    </div>
  );
}
