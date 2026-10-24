import type { ReactNode } from "react";

/**
 * 出典の文字列に含まれる公的機関名を、その機関の公式サイトへのリンクにする。
 * 読者が一次情報にたどり着けるようにするための設定（E-E-A-T: 出典の透明性）。
 * リンク先は各機関のトップページのみ（個別の統計表のURLは変わりやすいため）。
 * 同じ機関名が何度も出る場合は、最初の1回だけリンクにする。
 */
const SOURCE_LINKS: { name: string; url: string }[] = [
  { name: "総務省統計局", url: "https://www.stat.go.jp/" },
  { name: "厚生労働省", url: "https://www.mhlw.go.jp/" },
  { name: "経済産業省", url: "https://www.meti.go.jp/" },
  { name: "資源エネルギー庁", url: "https://www.enecho.meti.go.jp/" },
  { name: "農林水産省", url: "https://www.maff.go.jp/" },
  { name: "林野庁", url: "https://www.rinya.maff.go.jp/" },
  { name: "気象庁", url: "https://www.jma.go.jp/" },
  { name: "警察庁", url: "https://www.npa.go.jp/" },
  { name: "国土交通省", url: "https://www.mlit.go.jp/" },
  { name: "国土地理院", url: "https://www.gsi.go.jp/" },
  { name: "文化庁", url: "https://www.bunka.go.jp/" },
  { name: "文部科学省", url: "https://www.mext.go.jp/" },
  { name: "内閣府", url: "https://www.cao.go.jp/" },
  { name: "環境省", url: "https://www.env.go.jp/" },
  { name: "e-Stat", url: "https://www.e-stat.go.jp/" }
];

const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export function renderSourceWithLinks(source: string): ReactNode[] {
  // 長い名前から先に照合する（「総務省統計局」を「総務省」より先に）
  const names = [...SOURCE_LINKS].sort((a, b) => b.name.length - a.name.length).map((l) => escapeRegExp(l.name));
  const pattern = new RegExp(`(${names.join("|")})`, "g");
  const used = new Set<string>();
  return source.split(pattern).map((part, i) => {
    const link = SOURCE_LINKS.find((l) => l.name === part);
    if (link && !used.has(part)) {
      used.add(part);
      return (
        <a key={i} href={link.url} target="_blank" rel="noopener noreferrer">
          {part}
        </a>
      );
    }
    return part;
  });
}
