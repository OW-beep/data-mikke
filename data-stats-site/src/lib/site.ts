/**
 * サイト全体で使う共通設定。
 * 本番ドメインや連絡先はここだけ直せば全ページに反映される。
 */
export const SITE = {
  name: "データみっけ",
  description:
    "日本のオープンデータを都道府県ごとに見つけて、比べて、理解する統計メディア「データみっけ」。",
  // Vercelにデプロイ後のドメインに差し替える（例: https://data-mikke-lab.vercel.app）
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://data-mikke-lab.vercel.app",
  // お問い合わせ用メールアドレス。取得したら書き換える
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "contact@example.com",
  // 運営者名（個人運営の場合は氏名 or 屋号）。プライバシーポリシー/運営者情報に表示
  operatorName: process.env.NEXT_PUBLIC_OPERATOR_NAME ?? "サイト運営者",
  // Google AdSenseの発行者ID（例: "ca-pub-1234567890123456"）。
  // 審査申請前にVercelの環境変数に設定しておくと、全ページに確認用スクリプトが自動挿入される
  adsenseClientId: process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? "ca-pub-4630812027939211"
};
