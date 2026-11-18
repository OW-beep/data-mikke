import Link from "next/link";
import { SITE } from "@/lib/site";
import {
  computePrefectureStrengths,
  type PrefectureStrength,
} from "@/lib/prefectureStrengths";
import PrefectureMap from "@/components/PrefectureMap";
import PrefectureAffiliateSlot from "@/components/PrefectureAffiliateSlot";

export const metadata = {
  title: `都道府県マップ｜47都道府県の「一番の強み」を地図から探す`,
  description: `47都道府県を地図から選んで、その県が全国で最も順位の高い指標（強み）を一覧で確認できます。人口・年収・温泉・国宝・日照時間など、当サイトのオープンデータのランキングから算出しています。`,
};

function formatValue(s: PrefectureStrength): string {
  const v = s.best.value;
  const num = Number.isInteger(v) ? v.toLocaleString("ja-JP") : v.toLocaleString("ja-JP");
  return `${num}${s.best.unit}`;
}

export default async function MapPage() {
  const strengths = await computePrefectureStrengths();
  const topNo1 = [...strengths].sort((a, b) => b.no1Count - a.no1Count).slice(0, 5);

  return (
    <div>
      <p className="dm-eyebrow">Map</p>
      <h1>都道府県マップ｜47都道府県の「一番の強み」</h1>
      <p className="dm-lede">
        地図から県を選ぶと、その県の統計ページに移動します。下の一覧では、各県が全国で
        最も順位の高い指標（＝その県の一番の強み）を、数字・出典・参照年つきで示しています。
        ランキングの値を棒の高さで比べたいときは、
        <Link href="/map-3d">3D棒グラフ地図</Link>もご覧ください。
      </p>

      <section style={{ marginTop: 24 }}>
        <h2>地図から選ぶ</h2>
        <PrefectureMap strengths={strengths} />
      </section>

      <section style={{ marginTop: 32 }}>
        <h2>全国1位の指標が多い県トップ5</h2>
        <p className="dm-doc-updated" style={{ marginTop: 4 }}>
          対象とした指標（値が高いほど良い指標と、安いほど良い指標）のうち、
          全国1位になっている指標の数が多い県です。
        </p>
        <ol>
          {topNo1.map((s) => (
            <li key={s.prefecture.slug}>
              <Link href={`/prefecture/${s.prefecture.slug}`}>{s.prefecture.name}</Link>
              ：全国1位の指標 {s.no1Count}件
              {s.no1Titles.length > 0 && `（${s.no1Titles.join("、")}）`}
            </li>
          ))}
        </ol>
      </section>

      <section style={{ marginTop: 32 }}>
        <h2>47都道府県の一番の強み一覧</h2>
        <p className="dm-doc-updated" style={{ marginTop: 4 }}>
          「最も順位が高い指標」は、その県が対象指標の中で全国で最も高い順位にあるものです。
          全国1位でない県もありますが、順位をそのまま表示しています。
          「安さ」は値が低いほど良い指標（生活費指数・家賃など）で全国1位の場合です。
        </p>
        <table className="dm-table">
          <thead>
            <tr>
              <th>都道府県</th>
              <th>一番の強み（最も順位が高い指標）</th>
              <th>値</th>
              <th>全国順位</th>
              <th>参照年</th>
              <th>出典</th>
            </tr>
          </thead>
          <tbody>
            {strengths.map((s) => (
              <tr key={s.prefecture.slug}>
                <td>
                  <Link href={`/prefecture/${s.prefecture.slug}`}>{s.prefecture.name}</Link>
                  <PrefectureAffiliateSlot slug={s.prefecture.slug} />
                </td>
                <td>
                  {s.best.title}
                  {s.best.direction === "low" ? "（安さ）" : ""}
                  <br />
                  <Link href={`/ranking/${s.best.datasetId}`} className="dm-doc-updated">
                    ランキングを見る
                  </Link>
                </td>
                <td>{formatValue(s)}</td>
                <td>{s.best.rank}位</td>
                <td>{s.best.year}年</td>
                <td className="dm-doc-updated">{s.best.source}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section style={{ marginTop: 32 }}>
        <h2>このページの作り方</h2>
        <ul>
          <li>
            数字はすべて当サイトが掲載しているオープンデータのランキングから算出しています。
            新しい外部データは使っていません。
          </li>
          <li>
            対象は「順位の意味がはっきりした指標」だけです。離婚率・犯罪発生件数・喫煙率・
            交通事故死者数・高齢化率など、「1位」を強みとして掲げるのが不適切な指標は
            除いています。
          </li>
          <li>
            地図は模式図（タイル地図）で、都道府県の形・面積・距離は正確ではありません。
          </li>
          <li>
            ライブ映像の埋め込みはありません。動画の埋め込みはページを重くし、
            多くの公式ライブカメラは転載・埋め込みが許可されていないためです。
            各県の観光情報は、都道府県ページの公式リンクからご確認ください。
          </li>
        </ul>
        <p className="dm-doc-updated" style={{ marginTop: 8 }}>
          出典の詳細とデータの更新方法は
          <Link href="/methodology">統計の読み方ガイド</Link>をご覧ください。
        </p>
      </section>

      <p className="dm-doc-updated" style={{ marginTop: 24 }}>
        {SITE.name}｜データは各出典元の公表値に基づきます。最新の値は各都道府県ページ・
        ランキングページでご確認ください。
      </p>
    </div>
  );
}
