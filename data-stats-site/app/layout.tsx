import Link from "next/link";
import { Shippori_Mincho_B1, Zen_Kaku_Gothic_New, JetBrains_Mono } from "next/font/google";
import { DATASET_LIST } from "@/datasets";
import { LogoMark } from "@/components/LogoMark";
import "./globals.css";

const display = Shippori_Mincho_B1({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-display"
});

const body = Zen_Kaku_Gothic_New({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-body"
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono"
});

export const metadata = {
  title: "データみっけ | 都道府県統計図鑑",
  description:
    "日本のオープンデータを都道府県ごとに見つけて、比べて、理解する統計メディア「データみっけ」。"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>
        <header className="dm-header">
          <div className="dm-header-inner">
            <Link href="/" className="dm-brand">
              <LogoMark size={30} />
              データみっけ
            </Link>
            <nav className="dm-nav">
              {DATASET_LIST.map((d) => (
                <Link key={d.id} href={`/dashboard/${d.id}`}>
                  {d.title}
                </Link>
              ))}
              <Link href="/compare">比較</Link>
            </nav>
          </div>
        </header>
        <main className="dm-main">{children}</main>
      </body>
    </html>
  );
}
