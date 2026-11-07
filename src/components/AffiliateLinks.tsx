import { RakutenItem } from "@/lib/rakuten";
import { SITE } from "@/lib/site";

/**
 * 記事末尾・ツール下に1箇所だけ置く商品リンク。必ず「PR」を明示する。
 * - note: その記事の内容と商品の関係を、記事ごとに書いた一文（定型文は使わない）
 * - Amazonは画像を取得できないため、検索結果へのテキストリンクのみ（tag付き）
 * - 楽天は、APIで商品が取得できたときだけ画像つきで表示する
 */
export function AffiliateLinks({
  keyword,
  note,
  items
}: {
  keyword: string;
  note?: string;
  items: RakutenItem[];
}) {
  const amazonUrl = SITE.amazonTag
    ? `https://www.amazon.co.jp/s?k=${encodeURIComponent(keyword)}&tag=${SITE.amazonTag}`
    : null;
  if (!amazonUrl && items.length === 0) return null;

  return (
    <div className="dm-card dm-rakuten-card">
      <p className="dm-card-eyebrow">PR｜関連する商品：「{keyword}」</p>
      {note && <p style={{ margin: "0 0 12px" }}>{note}</p>}
      {items.length > 0 && (
        <div className="dm-rakuten-grid">
          {items.map((item) => (
            <a key={item.url} href={item.url} target="_blank" rel="noopener noreferrer sponsored" className="dm-rakuten-item">
              {item.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.imageUrl} alt={item.name} loading="lazy" />
              )}
              <span className="dm-rakuten-item-name">{item.name}</span>
              <span className="dm-rakuten-item-price">{item.price.toLocaleString()}円</span>
              <span className="dm-rakuten-item-shop">{item.shopName}</span>
            </a>
          ))}
        </div>
      )}
      {amazonUrl && (
        <p style={{ margin: "12px 0 0" }}>
          <a
            href={amazonUrl}
            target="_blank"
            rel="noopener noreferrer sponsored"
            style={{
              display: "inline-block",
              padding: "8px 14px",
              border: "1px solid currentColor",
              borderRadius: 6,
              fontWeight: 600,
              textDecoration: "none"
            }}
          >
            Amazonで「{keyword}」を探す
          </a>
        </p>
      )}
      {amazonUrl && (
        <p className="dm-doc-updated" style={{ marginTop: 10 }}>
          Amazonのアソシエイトとして、{SITE.name}は適格販売により収入を得ています。価格・在庫は変わるため、リンク先でご確認ください。
        </p>
      )}
    </div>
  );
}
