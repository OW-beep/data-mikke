"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type SearchItem = {
  type: "データ" | "記事" | "都道府県";
  title: string;
  description: string;
  href: string;
};

export function SearchClient({ items, initialQuery = "" }: { items: SearchItem[]; initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return items
      .filter(
        (item) =>
          item.title.toLowerCase().includes(q) || item.description.toLowerCase().includes(q)
      )
      .slice(0, 40);
  }, [items, query]);

  return (
    <div>
      <input
        type="search"
        className="dm-search-input"
        placeholder="データ・記事・都道府県を検索（例: 人口、喫茶店、京都）"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        autoFocus
      />

      {query.trim() === "" ? (
        <p className="dm-lede" style={{ marginTop: 16 }}>
          キーワードを入力すると、データセット・解説記事・都道府県ページを横断して検索できます。
        </p>
      ) : results.length === 0 ? (
        <p className="dm-lede" style={{ marginTop: 16 }}>
          「{query}」に一致する結果は見つかりませんでした。別のキーワードでお試しください。
        </p>
      ) : (
        <div className="dm-search-results">
          {results.map((item) => (
            <Link key={item.type + item.href} href={item.href} className="dm-search-result">
              <span className="dm-search-result-type">{item.type}</span>
              <span className="dm-search-result-title">{item.title}</span>
              {item.description && <span className="dm-search-result-desc">{item.description}</span>}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
