/**
 * 都道府県ページ用の旅行アフィリエイト差し込み口（フック）。
 *
 * 現状はリンクが1件も登録されていないため、何も表示しません。
 * ユーザーが Travelpayouts / 楽天トラベル等で取得した都道府県別の
 * アフィリエイトURLを下の PREFECTURE_TRAVEL_LINKS に登録すると、
 * その県のページ（/map の一覧と、将来の都道府県ページ）に
 * 「（PR）」表示つきで1件だけ表示されます。
 *
 * 運用ルール：
 * - URLはユーザーがアフィリエイト管理画面で発行したものだけを使う。
 *   推測・自作のURLは絶対に入れない。
 * - 表示は都道府県と関連する旅行リンクだけにする。無関係なリンクは入れない。
 * - rel="nofollow sponsored" と「（PR）」表示は必須。
 */
import Link from "next/link";

/** 都道府県スラッグ → アフィリエイトURL。未登録の県は何も表示されません。 */
export const PREFECTURE_TRAVEL_LINKS: Record<string, { url: string; label: string }> = {
  // 例： tokyo: { url: "https://...", label: "東京のホテルを探す" },
};

export default function PrefectureAffiliateSlot({ slug }: { slug: string }) {
  const link = PREFECTURE_TRAVEL_LINKS[slug];
  if (!link) return null;
  return (
    <p className="dm-doc-updated">
      <Link href={link.url} rel="nofollow sponsored">
        {link.label}
      </Link>{" "}
      （PR）
    </p>
  );
}
