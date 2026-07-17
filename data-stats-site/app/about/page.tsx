import { SITE } from "@/lib/site";

export const metadata = {
  title: "運営者情報",
  description: `${SITE.name}の運営者情報・サイトのコンセプトについて。`
};

export default function AboutPage() {
  return (
    <div className="dm-doc">
      <p className="dm-eyebrow">About</p>
      <h1>運営者情報</h1>

      <h2>{SITE.name}について</h2>
      <p>
        {SITE.name}は、e-Stat（政府統計の総合窓口）・気象庁・各府省庁や自治体が公開するオープンデータを、都道府県ごとに「見やすく・比較しやすく・理解しやすく」整理して届ける統計メディアです。
      </p>
      <p>
        単に数字を並べるだけでなく、ダッシュボード・全国ランキング・都道府県間の比較・解説記事を通じて、公的統計を日常の関心ごとに結びつけて読めることを目指しています。
      </p>

      <h2>運営者</h2>
      <p>{SITE.operatorName}（個人運営）</p>

      <h2>お問い合わせ</h2>
      <p>
        ご質問・データの誤りのご指摘・掲載のご相談などは
        <a href="/contact">お問い合わせページ</a>
        からご連絡ください。
      </p>

      <h2>掲載データの出典</h2>
      <p>
        各ページに出典元（e-Stat、気象庁など）と参照年を明記しています。数値の一次情報は各出典元の公式サイトをご確認ください。
      </p>
    </div>
  );
}
