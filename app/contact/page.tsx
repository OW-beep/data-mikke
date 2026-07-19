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
        データの誤りのご指摘、掲載してほしい統計のご要望、その他お問い合わせは、以下のメールアドレス宛にご連絡ください。
      </p>

      <p style={{ fontSize: 18 }}>
        <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>
      </p>

      <p className="dm-doc-updated">
        内容を確認の上、通常3〜5営業日以内にご返信します。返信をお約束できない場合があります。
      </p>
    </div>
  );
}
