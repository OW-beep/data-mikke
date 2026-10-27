import { ARTICLE_LIST } from "@/articles";
import { SITE } from "@/lib/site";

export const dynamic = "force-static";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** RSSフィード。検索対象の記事のうち、新しい順に30本を配信する */
export async function GET() {
  const items = ARTICLE_LIST.filter((a) => !a.noindex)
    .slice(0, 30)
    .map(
      (a) => `    <item>
      <title>${esc(a.title)}</title>
      <link>${SITE.url}/articles/${a.slug}</link>
      <guid>${SITE.url}/articles/${a.slug}</guid>
      <pubDate>${new Date(a.publishedAt + "T00:00:00+09:00").toUTCString()}</pubDate>
      <description>${esc(a.excerpt)}</description>
    </item>`
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${esc(SITE.name)}</title>
    <link>${SITE.url}</link>
    <description>${esc("公的統計を都道府県別に比べやすく整理して届ける、統計データの解説記事。")}</description>
    <language>ja</language>
${items}
  </channel>
</rss>`;

  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
