import { SITE } from "@/lib/site";

export const metadata = {
  title: "お問い合わせ",
  description: `${SITE.name}へのお問い合わせ方法。記事・データの誤りのご指摘、掲載や転載のご相談などは、こちらからご連絡ください。`
};

export default function ContactPage() {
  return (
    <div className="dm-doc">
      <p className="dm-eyebrow">Contact</p>
      <h1>お問い合わせ</h1>

      <p>
        データの誤りのご指摘、掲載してほしい統計のご要望、記事に関するご質問、その他お問い合わせは、以下のメールアドレス宛にお送りください。お問い合わせフォームは設けていません。
      </p>

      <p style={{ fontSize: 14, color: "var(--dm-muted)", marginBottom: 4 }}>【メールアドレス】</p>
      <p style={{ fontSize: 18 }}>
        <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>
      </p>

      <ul style={{ marginTop: 20 }}>
        <li>内容を確認のうえ、通常1週間以内にご返信いたします。</li>
        <li>データや記事の誤りのご指摘は、確認のうえ修正し、記事の更新日に反映します。</li>
        <li>データ分析・可視化のご相談は、<a href="/consulting">こちらのページ</a>をご覧ください。</li>
        <li>
          スパム防止のため、件名に「{SITE.name}問い合わせ」と記載いただけると助かります。
        </li>
      </ul>

      <p className="dm-doc-updated">
        ※ 広告・取材・大量のデータ提供依頼など、内容によっては対応できない場合がございます。
      </p>
    </div>
  );
}
