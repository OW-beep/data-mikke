export interface Article {
  slug: string; // URL: /articles/{slug}
  title: string;
  excerpt: string; // 一覧ページに表示する要約
  publishedAt: string; // "2026-07-17"
  relatedDataset?: string; // 関連するdatasets/のid（あれば内部リンクを自動生成）
  /** 記事本文の末尾に、このdataset idの47都道府県ランキング表を自動生成して埋め込む */
  embedRanking?: string;
  /** 本文。段落ごとに配列で持つ（改行で分割してレンダリングする） */
  body: string[];
}
