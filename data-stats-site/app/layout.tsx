import Link from "next/link";
import Script from "next/script";
import { Shippori_Mincho_B1, Zen_Kaku_Gothic_New, JetBrains_Mono } from "next/font/google";
import { DATASET_LIST } from "@/datasets";
import { LogoMark } from "@/components/LogoMark";
import { SITE } from "@/lib/site";
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
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} | 都道府県統計図鑑`,
    template: `%s | ${SITE.name}`
  },
  description: SITE.description,
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: SITE.name,
    title: `${SITE.name} | 都道府県統計図鑑`,
    description: SITE.description
  },
  twitter: {
    card: "summary",
    title: `${SITE.name} | 都道府県統計図鑑`,
    description: SITE.description
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>
        {SITE.adsenseClientId && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${SITE.adsenseClientId}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
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
              <Link href="/articles">解説記事</Link>
            </nav>
          </div>
        </header>
        <main className="dm-main">{children}</main>
        <footer className="dm-footer">
          <div className="dm-footer-inner">
            <nav className="dm-footer-nav">
              <Link href="/about">運営者情報</Link>
              <Link href="/privacy">プライバシーポリシー</Link>
              <Link href="/contact">お問い合わせ</Link>
            </nav>
            <p className="dm-footer-copy">
              &copy; {new Date().getFullYear()} {SITE.name}
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
