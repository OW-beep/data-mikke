import { RakutenItem } from "@/lib/rakuten";

/**
 * 記事末尾・ツール結果表示の下などに1箇所だけ置く想定の商品カード。
 * 本文の主張とは切り離し、必ず「PR」の明示をセットで出す。
 */
export function RakutenProductCard({ heading, items }: { heading: string; items: RakutenItem[] }) {
  if (items.length === 0) return null;
  return (
    <div className="dm-card dm-rakuten-card">
      <p className="dm-card-eyebrow">PR｜{heading}</p>
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
    </div>
  );
}
