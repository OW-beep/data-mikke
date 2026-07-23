export interface Article {
  slug: string; // URL: /articles/{slug}
  title: string;
  excerpt: string; // 一覧ページに表示する要約
  publishedAt: string; // "2026-07-17"
  relatedDataset?: string; // 関連するdatasets/のid（あれば内部リンクを自動生成）
  /** 記事本文の末尾に、このdataset idの47都道府県ランキング表を自動生成して埋め込む */
  embedRanking?: string;
  /** 記事本文の末尾に、2つのdataset間の散布図を自動生成して埋め込む */
  embedScatter?: { a: string; b: string; note?: string };
  /** 回遊率向上のための関連記事リンク（slugの配列） */
  relatedArticles?: string[];
  /** 一覧ページ・トップページで「おすすめ」として優先表示するためのフラグ（手動キュレーション） */
  featured?: boolean;
  /** 本文。段落ごとに配列で持つ（改行で分割してレンダリングする） */
  body: string[];
}
