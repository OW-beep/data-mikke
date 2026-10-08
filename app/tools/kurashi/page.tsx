import { PREFECTURES } from "@/lib/prefectures";
import { KurashiToolClient } from "@/components/KurashiToolClient";
import { searchRakutenItems } from "@/lib/rakuten";
import { RakutenProductCard } from "@/components/RakutenProductCard";

export const metadata = {
  title: "くらしデータツール｜生活費比較・健康スコア診断",
  description:
    "家賃・電気代・ガソリンなどの生活費を2都道府県で比較し、野菜摂取量や歩数などから健康スコアを診断できるインタラクティブツールです。"
};

export default async function KurashiToolPage() {
  const rakutenItems = await searchRakutenItems("引っ越し ダンボール");
  return (
    <div>
      <p className="dm-eyebrow">ツール</p>
      <h1>くらしデータツール</h1>
      <p className="dm-lede">
        「生活費」カテゴリと「健康」カテゴリのデータを使って、都道府県同士のくらしを比べたり、生活習慣を診断したりできるツールです。数字はすべて
        <a href="/datasets">データ一覧</a>
        にある各データセットから、その場で取得しています。
      </p>

      <KurashiToolClient prefectures={PREFECTURES} />

      {rakutenItems && rakutenItems.length > 0 && (
        <RakutenProductCard heading="生活費を比べたあとの引っ越し準備に" items={rakutenItems} />
      )}
    </div>
  );
}
