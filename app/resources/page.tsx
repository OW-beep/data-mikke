import Link from "next/link";
import { SITE } from "@/lib/site";

export const metadata = {
  title: "無料の資料・ダウンロード",
  description: `${SITE.name}が公開している無料の資料。都道府県のデータを比べるときの確認項目と、順位・平均・中央値・ばらつきを自動計算するExcelシート（チェックシート）をダウンロードできます。`
};

export default function ResourcesPage() {
  return (
    <div className="dm-doc">
      <p className="dm-eyebrow">Resources</p>
      <h1>無料の資料・ダウンロード</h1>
      <p>
        都道府県の数字を比べるときに、そのまま使える資料を公開しています。順位だけを見て誤解しないための確認項目と、計算の手間を省く比較シートです。
      </p>

      <h2>都道府県データ比較チェックシート（Excel）</h2>
      <p>
        <a href="/downloads/prefecture-data-check-sheet.xlsx" download>
          prefecture-data-check-sheet.xlsx をダウンロード
        </a>
        （Excel形式・約20KB）
      </p>
      <p>データの比較でつまずきやすい点を、3つのシートにまとめました。</p>
      <ul>
        <li>
          <strong>チェックリスト</strong>：出典、調査年、単位、定義、分母、調査の範囲、欠損値、外れ値、平均と中央値、地域の区分、相関と因果、解釈の限界の12項目を、「OK／要確認／該当なし」で確認できます。
        </li>
        <li>
          <strong>比較シート</strong>：47都道府県の値を貼り付けると、順位（大きい順・小さい順）、平均との差、平均・中央値・最大と最小の県・倍率・変動係数、地方別の平均、分布の偏りの判定が自動で計算されます。
        </li>
        <li>
          <strong>使い方</strong>：入力するセル、地方の区分、入力例を載せています。
        </li>
      </ul>
      <p>
        数式を使っているため、Excelなどの表計算ソフトで開くと、自動で計算されます。黄色いセルが入力欄です。
      </p>

      <h2>使うときの注意</h2>
      <ul>
        <li>集計の結果は、入力した値にもとづく参考情報です。出典と調査年は、必ず入力欄に記録してください。</li>
        <li>地方別の平均は、各県の値の単純平均で、人口の重みづけはしていません。</li>
        <li>ご自身の業務・学習で、自由にお使いください。ファイルそのものの再配布・販売はご遠慮ください。</li>
      </ul>

      <h2>データそのものを探す</h2>
      <p>
        当サイトに掲載している各データは、<Link href="/datasets">データ一覧</Link>から、ダッシュボードとランキングで見られます。数値はCSVでも取得できます。数字の読み方は、
        <Link href="/methodology">統計の読み方ガイド</Link>と<Link href="/editorial-policy">編集方針</Link>にまとめています。
      </p>

      <p className="dm-doc-updated">最終更新: 2026-10-27</p>
    </div>
  );
}
