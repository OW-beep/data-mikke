import Link from "next/link";

export const metadata = {
  title: "使い方ガイド",
  description:
    "データみっけの4つの使い方（引っ越し比較・自由研究・地元を知る・地域選定）を、具体的な手順つきで紹介します。"
};

export default function GuidePage() {
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "データみっけの使い方",
    description: "都道府県の統計データを、目的別に活用する4つの方法。"
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <p className="dm-eyebrow">使い方ガイド</p>
      <h1>データみっけの使い方</h1>
      <p className="dm-lede">
        「都道府県の数字が気になったとき」の使い道を、具体的な手順つきで4つ紹介します。目的に近いものから読んでみてください。
      </p>

      <h2>① 引っ越し・移住先を比べる</h2>
      <p>
        気になる2つの都道府県が決まったら、まず
        <Link href="/compare">比較ページ</Link>
        で家賃・治安・医療・気候などをまとめて突き合わせます。どちらが何項目で上回っているか、スコアボード形式で一目で分かります。個別の指標をさらに深掘りしたい場合は、各都道府県の
        <Link href="/prefecture/tokyo">都道府県ページ</Link>
        で全指標の順位を確認してください。「総合力スコア」から、生活のしやすさをざっくり把握することもできます。
      </p>

      <h2>② 自由研究・レポートの下調べ</h2>
      <p>
        <Link href="/articles">解説記事一覧</Link>
        から気になるテーマ（人口・農業・工業・文化など）の記事を探すのがおすすめです。各記事は出典・年・単位を明記しているので、そのまま資料の脚注に使えます。特定のデータそのものが欲しい場合は、
        <Link href="/datasets">データ一覧</Link>
        から該当のダッシュボードを開き、CSV形式でのダウンロードも可能です。
      </p>

      <h2>③ 地元・出身地を数字で知る</h2>
      <p>
        自分の出身地や住んでいる都道府県のページを開くと、掲載している全指標の順位と、その県が全国で最も高い順位にある指標・最も低い順位にある指標が一目で分かります。意外な強み・弱みを発見できることがあります。似た県同士を
        <Link href="/compare">比較ページ</Link>
        で見比べるのもおすすめです。
      </p>

      <h2>④ 地域選定・企画の下調べ</h2>
      <p>
        <Link href="/analysis">分析ページ</Link>
        では、2つの指標同士の相関係数や、都道府県ごとのばらつきの大きさ（変動係数）を確認できます。「この指標とこの指標は関係がありそうか」という仮説を、実際のデータで確かめる際に使ってください。相関が見つからない場合も、それ自体が意味のある発見です。相関係数・変動係数の意味がよく分からない場合は、
        <Link href="/methodology">統計の読み方ガイド</Link>
        もあわせてご覧ください。
      </p>

      <p className="dm-back-link">
        <Link href="/">トップページに戻る</Link>
      </p>
    </div>
  );
}
