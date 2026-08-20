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
  /**
   * 記事固有の一覧表（47都道府県の対応表など、既存datasetのランキングでは表現できないもの）。
   * デフォルトは折りたたみ表示（<details>）。columns/rowsの列数は揃えること。
   */
  table?: { title: string; columns: string[]; rows: string[][] };
  /** 回遊率向上のための関連記事リンク（slugの配列） */
  relatedArticles?: string[];
  /** 一覧ページ・トップページで「おすすめ」として優先表示するためのフラグ（手動キュレーション） */
  featured?: boolean;
  /** trueの場合、検索エンジンにインデックスさせない（統合元の記事など、内容の重複を避けたい場合に使用） */
  noindex?: boolean;
  /** 本文。段落ごとに配列で持つ（改行で分割してレンダリングする） */
  body: string[];
}
