export interface Article {
  slug: string; // URL: /articles/{slug}
  title: string;
  excerpt: string; // 一覧ページに表示する要約
  publishedAt: string; // "2026-07-17"
  relatedDataset?: string; // 関連するdatasets/のid（あれば内部リンクを自動生成）
  /** 本文。段落ごとに配列で持つ（改行で分割してレンダリングする） */
  body: string[];
}
