import Link from "next/link";
import { DATASET_LIST, getDataset } from "@/datasets";
import { loadDataset, latestByArea } from "@/lib/loadData";
import { pearsonCorrelation, coefficientOfVariation, describeCorrelationStrength } from "@/lib/stats";

export const metadata = {
  title: "データ分析（相関・変動係数）",
  description:
    "当サイトが持つ統計データ同士の相関係数や変動係数を、実データから自動計算して掲載しています。都道府県データを読み解くための統計的な視点を提供します。"
};

/** area別の最新値をMap化するヘルパー */
async function latestValueMap(datasetId: string): Promise<Map<string, number>> {
  const points = await loadDataset(datasetId);
  const latest = latestByArea(points);
  return new Map(latest.map((p) => [p.areaCode, p.value]));
}

/** 人口10万人あたりに変換する（生の件数を人口で調整するときに使う） */
function toPerCapita(values: Map<string, number>, population: Map<string, number>): Map<string, number> {
  const result = new Map<string, number>();
  for (const [code, value] of values) {
    const pop = population.get(code);
    if (pop && pop > 0) result.set(code, (value / pop) * 100000);
  }
  return result;
}

// 相関を見る組み合わせ。データセットが増えても、ここに1行足すだけで自動的に計算・表示される
const CORRELATION_PAIRS: { a: string; b: string; note?: string }[] = [
  { a: "income", b: "homeownership" },
  { a: "income", b: "crime" },
  { a: "homeownership", b: "crime" },
  { a: "density", b: "income" },
  { a: "density", b: "crime" },
  { a: "density", b: "homeownership" },
  { a: "library", b: "university", note: "生の件数同士（人口規模に強く影響されやすい組み合わせ）" },
  { a: "density", b: "car" },
  { a: "homeownership", b: "car" },
  { a: "density", b: "park" },
  { a: "income", b: "park" },
  { a: "car", b: "trafficAccident" },
  { a: "doctor", b: "hospital", note: "医師数は人口10万人あたり、病院数は生の件数（人口規模に影響されやすい組み合わせ）" },
  { a: "doctor", b: "income" }
];

export default async function AnalysisPage() {
  const population = await latestValueMap("population");

  // --- 変動係数: ranking対象の全データセットで計算 ---
  const cvRows = await Promise.all(
    DATASET_LIST.filter((d) => d.ranking).map(async (dataset) => {
      const points = await loadDataset(dataset.id);
      const latest = latestByArea(points);
      const cv = coefficientOfVariation(latest.map((p) => p.value));
      return { dataset, cv };
    })
  );
  const cvSorted = cvRows
    .filter((r): r is { dataset: (typeof cvRows)[number]["dataset"]; cv: number } => r.cv !== null)
    .sort((a, b) => b.cv - a.cv);

  // --- 相関係数: 生の値同士 + 人口10万人あたりに調整した場合の両方を計算 ---
  const correlationRows = await Promise.all(
    CORRELATION_PAIRS.map(async ({ a, b, note }) => {
      const [mapA, mapB] = await Promise.all([latestValueMap(a), latestValueMap(b)]);
      const raw = pearsonCorrelation(mapA, mapB);

      const perCapitaA = toPerCapita(mapA, population);
      const perCapitaB = toPerCapita(mapB, population);
      const adjusted = pearsonCorrelation(perCapitaA, perCapitaB);

      return {
        datasetA: getDataset(a),
        datasetB: getDataset(b),
        raw,
        adjusted,
        note
      };
    })
  );

  return (
    <div>
      <p className="dm-eyebrow">Analysis</p>
      <h1>データ分析（相関・変動係数）</h1>
      <p className="dm-lede">
        当サイトが持つ統計データ同士の関係性を、その時点の実データから毎回自動計算しています。数値は
        <code>npm run sync</code>
        を実行するたびに更新されるため、掲載している数値は常にデータセットの現在の状態を反映しています。
      </p>

      <h2>相関係数</h2>
      <p>
        ピアソンの相関係数（-1〜1）で、2つの指標がどれだけ連動しているかを見ます。「人口10万人あたり」に調整した場合の相関係数もあわせて計算しており、両者に大きな差がある場合は、人口規模という交絡変数の影響を疑う目安になります。
      </p>
      <table className="dm-table">
        <thead>
          <tr>
            <th>指標A</th>
            <th>指標B</th>
            <th className="dm-num">相関係数(生値)</th>
            <th className="dm-num">相関係数(人口調整後)</th>
          </tr>
        </thead>
        <tbody>
          {correlationRows.map(({ datasetA, datasetB, raw, adjusted, note }, i) => (
            <tr key={i}>
              <td>{datasetA ? <Link href={`/dashboard/${datasetA.id}`}>{datasetA.title}</Link> : "-"}</td>
              <td>{datasetB ? <Link href={`/dashboard/${datasetB.id}`}>{datasetB.title}</Link> : "-"}</td>
              <td className="dm-num dm-mono">
                {raw ? `${raw.r.toFixed(3)}（${describeCorrelationStrength(raw.r)}, n=${raw.n}）` : "算出不可"}
              </td>
              <td className="dm-num dm-mono">
                {adjusted ? `${adjusted.r.toFixed(3)}（n=${adjusted.n}）` : "算出不可"}
                {note && <div className="dm-composite-tags-note">{note}</div>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="dm-doc-updated">
        ※ n=47（都道府県数）と少ないため、外れ値1つで相関係数が大きく動くことがあります。相関は因果関係を意味しません。都道府県単位の集計データから個人単位の関係を推測すること（生態学的誤謬）にも注意してください。
      </p>

      <h2 style={{ marginTop: 40 }}>変動係数（都道府県間のばらつきが大きい指標）</h2>
      <p>
        変動係数（標準偏差 ÷ 平均）が大きいほど、都道府県によって値が大きくばらついている指標です。単位や桁数が違う指標同士でも、相対的なばらつきの大きさを比較できます。
      </p>
      <table className="dm-table">
        <thead>
          <tr>
            <th>指標</th>
            <th>カテゴリ</th>
            <th className="dm-num">変動係数</th>
          </tr>
        </thead>
        <tbody>
          {cvSorted.map(({ dataset, cv }) => (
            <tr key={dataset.id}>
              <td>
                <Link href={`/dashboard/${dataset.id}`}>{dataset.title}</Link>
              </td>
              <td>{dataset.category}</td>
              <td className="dm-num dm-mono">{cv.toFixed(3)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="dm-back-link">
        より詳しい解説は
        <Link href="/articles/coefficient-of-variation-regional-disparity-ranking"> こちらの記事</Link>
        や
        <Link href="/articles/spurious-correlation-library-university-population"> こちらの記事</Link>
        も参考にしてください。
      </p>
    </div>
  );
}
