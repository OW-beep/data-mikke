export interface Article {
  slug: string; // URL: /articles/{slug}
  title: string;
  excerpt: string; // 一覧ページに表示する要約
  /**
   * 検索結果に表示するタイトル（<title>）。未指定ならtitleを使う。
   * 検索結果では全角30文字前後で切れるため、狙う検索語と数字を前に出した短い文にする（CTR改善用）。
   */
  seoTitle?: string;
  /** 検索結果のスニペット（meta description）。未指定ならexcerptを使う。全角110文字以内を目安に、答え（数字）を先に書く */
  metaDescription?: string;
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
  /**
   * 記事末尾に、この検索語で楽天市場の商品検索APIを呼び出した結果をPRカードとして埋め込む。
   * RAKUTEN_APP_ID が未設定の環境では自動的に非表示になる。
   */
  affiliateKeyword?: string;
  /**
   * 商品リンクの前に表示する一文。その記事の内容と、紹介する商品の関係を、記事ごとに具体的に書く。
   * 定型文を使い回さない（量産型と見なされないため）。
   */
  affiliateNote?: string;
  /** trueの場合、検索エンジンにインデックスさせない（統合元の記事など、内容の重複を避けたい場合に使用） */
  noindex?: boolean;
  /**
   * 「データみっけの分析メモ」。本文の数字をもとに、当サイトで追加計算した独自の分析（面積あたりへの換算、
   * 順位相関、上位の占有率など）を段落ごとに書く。本文の繰り返しではなく、新しい数字・見方を入れること。
   */
  analysisNote?: string[];
  /**
   * 「運営者の視点」。運営者自身の実務経験・実体験・判断に基づくコメントを段落ごとに書く。
   * 事実でないことは書かない（実際に経験したことだけを書く）。
   */
  operatorNote?: string[];
  /**
   * 「こんな疑問・悩みに答えます」。読者が検索するときの言葉（困りごと）で、2〜3個書く。
   * 記事冒頭のポイント欄に表示される。
   */
  worries?: string[];
  /**
   * 「この数字を、自分の判断にどう使うか」。記事の数字をもとにした、読者の次の行動・確認のしかたを2〜4個書く。
   * 本文の繰り返しではなく、記事内の数字だけを根拠に、事実でないことは書かない。
   */
  howToUse?: string[];
  /** よくある質問（Q&A）。検索で調べられやすい疑問に、記事内の数字で答える形で書く */
  faq?: { q: string; a: string }[];
  /** 本文。段落ごとに配列で持つ（改行で分割してレンダリングする） */
  body: string[];
}
