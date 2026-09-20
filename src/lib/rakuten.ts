/**
 * 楽天市場商品検索API（IchibaItem/Search）の薄いラッパー。
 *
 * 2026年の仕様変更で、エンドポイントが openapi.rakuten.co.jp に移行し、
 * applicationId に加えて accessKey が必須になっている（旧エンドポイントは停止済み）。
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

interface RakutenSearchResponse {
  Items?: { Item: RawItem }[];
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

const ENDPOINT = "https://openapi.rakuten.co.jp/ichibams/api/IchibaItem/Search/20220601";

export async function searchRakutenItems(keyword: string, hits = 3): Promise<RakutenItem[] | null> {
  const applicationId = process.env.RAKUTEN_APP_ID;
  const accessKey = process.env.RAKUTEN_ACCESS_KEY;
  // 2026年の仕様変更以降、applicationIdだけでは呼び出せず、accessKeyも必須になっている
  if (!applicationId || !accessKey) return null;

  const params = new URLSearchParams({
    format: "json",
    keyword,
    applicationId,
    accessKey,
    hits: String(hits),
    sort: "standard"
  });
  const affiliateId = process.env.RAKUTEN_AFFILIATE_ID;
  if (affiliateId) params.set("affiliateId", affiliateId);

  // 新APIは、アプリ登録時に指定した「Allowed websites」のドメインとRefererが一致しないと弾かれる
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://data-mikke-lab.vercel.app";

  try {
    const res = await fetch(`${ENDPOINT}?${params.toString()}`, {
      headers: { Referer: siteUrl, Origin: siteUrl },
      // 楽天APIの呼び出し回数を抑えるため、同じキーワードの結果は1日キャッシュする
      next: { revalidate: 60 * 60 * 24 }
    });
    if (!res.ok) return null;
    const data: RakutenSearchResponse = await res.json();
    if (!data.Items) return null;

    return data.Items.map(({ Item }) => ({
      name: Item.itemName,
      price: Item.itemPrice,
      url: Item.affiliateUrl || Item.itemUrl,
      imageUrl: Item.mediumImageUrls?.[0]?.imageUrl ?? null,
      shopName: Item.shopName
    }));
  } catch {
    // ネットワークエラー等で記事ページ自体が落ちないよう、失敗時は「表示なし」にフォールバックする
    return null;
  }
}
