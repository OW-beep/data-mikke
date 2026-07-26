import { SITE } from "@/lib/site";

export const metadata = {
  title: "お問い合わせ",
  description: `${SITE.name}へのお問い合わせ方法。`
};

export default function ContactPage() {
  return (
    <div className="dm-doc">
      <p className="dm-eyebrow">Contact</p>
      <h1>お問い合わせ</h1>

      <p>
        データの誤りのご指摘、掲載してほしい統計のご要望、記事に関するご質問、その他お問い合わせは、以下のメールアドレスまでご連絡ください。
      </p>

      <p style={{ fontSize: 14, color: "var(--dm-muted)", marginBottom: 4 }}>【メールアドレス】</p>
      <p style={{ fontSize: 18 }}>
        <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>
      </p>

      <ul style={{ marginTop: 20 }}>
        <li>内容を確認の上、通常3〜5営業日以内にご返信いたします。</li>
        <li>返信をお約束できない場合もありますので、あらかじめご了承ください。</li>
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
