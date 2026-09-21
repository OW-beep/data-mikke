/**
 * 楽天市場商品検索API（IchibaItem/Search）の薄いラッパー。
 *
 * 楽天は2026年に仕様変更を重ねており、現時点（2026-07-01版）の仕様は以下の通り。
 * 古いバージョンのURLを使うと "wrong_parameter / API Configuration not found" という
 * エラーになるため、バージョン番号が変わったら随時このファイルを更新すること。
 *
 * - エンドポイント: https://openapi.rakuten.co.jp/ichibams/api/IchibaItem/Search/20260701
 *   （旧 app.rakuten.co.jp/services/api/... は完全停止済み）
 * - applicationId に加えて accessKey が必須（クエリパラメータかヘッダーのどちらでも可。ここではクエリで送る）
 * - formatVersion=2 を指定すると、レスポンスが
 *     { items: [ { itemName, itemPrice, ... }, ... ] }
 *   というフラットな形式になる（指定しない場合は items[].item.itemName のようにネストする）
 *
 * - RAKUTEN_APP_ID / RAKUTEN_ACCESS_KEY が未設定の場合は何もせず null を返す
 *   （キー未登録でもビルド・他ページが壊れないようにするため）。
 * - サーバー側（Server Component）専用。キーをブラウザに渡さないよう、
 *   このモジュールをクライアントコンポーネントから直接importしないこと。
 * - 楽天APIは呼び出し頻度に上限があるため、Next.jsのfetchキャッシュで
 *   1日単位（86400秒）に再取得を抑える。
 */

export interface RakutenItem {
  name: string;
  price: number;
  url: string; // affiliateId設定時はアフィリエイトリンク、未設定時は通常の商品URL
  imageUrl: string | null;
  shopName: string;
}

// formatVersion=2 指定時のレスポンス形式（フラット）
interface RakutenSearchResponse {
  items?: RawItem[];
  error?: string;
  error_description?: string;
}
interface RawItem {
  itemName: string;
  itemPrice: number;
  itemUrl: string;
  affiliateUrl?: string;
  shopName: string;
  mediumImageUrls?: { imageUrl: string }[];
}

const ENDPOINT = "https://openapi.rakuten.co.jp/ichibams/api/IchibaItem/Search/20260701";

export async function searchRakutenItems(keyword: string, hits = 3): Promise<RakutenItem[] | null> {
  const applicationId = process.env.RAKUTEN_APP_ID;
  const accessKey = process.env.RAKUTEN_ACCESS_KEY;
  if (!applicationId || !accessKey) {
    console.warn(
      `[rakuten] RAKUTEN_APP_ID または RAKUTEN_ACCESS_KEY が未設定のため「${keyword}」の検索をスキップしました`
    );
    return null;
  }

  const params = new URLSearchParams({
    format: "json",
    formatVersion: "2",
    keyword,
    applicationId,
    accessKey,
    hits: String(hits),
    sort: "standard"
  });
  const affiliateId = process.env.RAKUTEN_AFFILIATE_ID;
  if (affiliateId) params.set("affiliateId", affiliateId);

  // アプリ登録時に指定した「Allowed websites」のドメインとRefererが一致しないと弾かれる
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://data-mikke-lab.vercel.app";

  try {
    const res = await fetch(`${ENDPOINT}?${params.toString()}`, {
      headers: { Referer: siteUrl, Origin: siteUrl },
      // 楽天APIの呼び出し回数を抑えるため、同じキーワードの結果は1日キャッシュする
      next: { revalidate: 60 * 60 * 24 }
    });
    const data: RakutenSearchResponse = await res.json().catch(() => ({}) as RakutenSearchResponse);

    if (!res.ok || data.error) {
      console.warn(
        `[rakuten] 「${keyword}」の検索が失敗しました。status=${res.status} error=${data.error} description=${data.error_description}`
      );
      return null;
    }
    if (!data.items || data.items.length === 0) {
      console.warn(`[rakuten] 「${keyword}」の検索結果が0件でした`);
      return null;
    }

    return data.items.map((item) => ({
      name: item.itemName,
      price: item.itemPrice,
      url: item.affiliateUrl || item.itemUrl,
      imageUrl: item.mediumImageUrls?.[0]?.imageUrl ?? null,
      shopName: item.shopName
    }));
  } catch (err) {
    // ネットワークエラー等で記事ページ自体が落ちないよう、失敗時は「表示なし」にフォールバックする
    console.warn(`[rakuten] 「${keyword}」の検索中に例外が発生しました:`, err);
    return null;
  }
}
