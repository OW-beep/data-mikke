import Link from "next/link";
import { PREFECTURES } from "@/lib/prefectures";

// 名前が長い順に並べ替え（"山口県"と"山梨県"のような部分一致を避けるため）
const SORTED_PREFS = [...PREFECTURES].sort((a, b) => b.name.length - a.name.length);
const PATTERN = new RegExp(`(${SORTED_PREFS.map((p) => p.name).join("|")})`, "g");

/**
 * 記事本文（段落の配列）の中に出てくる都道府県名を、最初に登場した1回だけ
 * 都道府県ページへの内部リンクに変換する。同じ県名が何度も出てきても
 * 2回目以降はリンクにしない（記事が青リンクだらけになるのを防ぐため）。
 */
export function linkifyPrefectures(paragraphs: string[]): React.ReactNode[][] {
  const linked = new Set<string>();

  return paragraphs.map((paragraph, pIndex) => {
    const parts = paragraph.split(PATTERN);
    return parts.map((part, i) => {
      const pref = PREFECTURES.find((p) => p.name === part);
      if (pref && !linked.has(pref.code)) {
        linked.add(pref.code);
        return (
          <Link key={`${pIndex}-${i}`} href={`/prefecture/${pref.slug}`}>
            {part}
          </Link>
        );
      }
      return part;
    });
  });
}
