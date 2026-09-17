import Link from "next/link";
import { notFound } from "next/navigation";
import { DATASET_LIST, getDataset } from "@/datasets";
import { loadDataset, latestByArea, seriesForArea, rankDescending } from "@/lib/loadData";
import { PREFECTURES, findPrefectureBySlug } from "@/lib/prefectures";
import { COMPOSITE_METRICS, compositeComment } from "@/lib/composite";
import { median } from "@/lib/stats";
import { TrendChart } from "@/components/TrendChart";

export function generateStaticParams() {
  return PREFECTURES.map((p) => ({ pref: p.slug }));
}

export function generateMetadata({ params }: { params: { pref: string } }) {
  const prefecture = findPrefectureBySlug(params.pref);
  if (!prefecture) return {};
  return {
    title: `${prefecture.name}の統計データまとめ｜物価・家賃・年収・人口`,
    description: `${prefecture.name}の物価・家賃・生活費・平均年収・人口・医療などの統計データを、全国順位つきで一覧できます。出典・参照年つき。`
  };
}

export default async function PrefecturePage({ params }: { params: { pref: string } }) {
  const prefecture = findPrefectureBySlug(params.pref);
  if (!prefecture) notFound();

  const rows = await Promise.all(
    DATASET_LIST.map(async (dataset) => {
      const points = await loadDataset(dataset.id);
      const latestAll = latestByArea(points);
      const latest = latestAll.find((p) => p.areaCode === prefecture.code);
      const ranked = rankDescending(latestAll);
      const rank = ranked.findIndex((p) => p.areaCode === prefecture.code);
      const benchmark = median(latestAll.map((p) => p.value));
      const series =
        dataset.chart === "line"
          ? seriesForArea(points, prefecture.code).map((p) => ({ year: p.year, value: p.value }))
          : [];
      return { dataset, latest, benchmark, rank: rank === -1 ? null : rank + 1, series };
    })
  );

  const rowByDatasetId = new Map(rows.map((r) => [r.dataset.id, r]));

  const composite = COMPOSITE_METRICS.map((m) => {
    const row = rowByDatasetId.get(m.datasetId);
    const dataset = getDataset(m.datasetId);
    if (!row?.latest || row.benchmark === null || !dataset) return null;
    const favorable = m.direction === "up" ? row.latest.value > row.benchmark : row.latest.value < row.benchmark;
    return { title: dataset.title, favorable };
  }).filter((c): c is { title: string; favorable: boolean } => c !== null);

  const compositeScore = composite.filter((c) => c.favorable).length;
  const compositeTotal = composite.length;

  // 全指標の中で最も順位が高い/低い指標を実データから特定し、都道府県ごとに固有の一文を生成する。
  // ただし生活費指数は「値が小さいほど物価が安い＝良い」指標で、降順ランキングの順位をそのまま
  // 強み・弱みとして語ると逆の意味になってしまうため、この一文の対象からは除外し、
  // 専用の物価サマリー（下部）で安い順の順位を示す。
  const rankedRows = rows.filter(
    (r) => r.rank !== null && r.latest !== undefined && r.dataset.id !== "costIndex"
  );
  const bestRow =
    rankedRows.length > 0 ? rankedRows.reduce((a, b) => (a.rank! < b.rank! ? a : b)) : null;
  const worstRow =
    rankedRows.length > 0 ? rankedRows.reduce((a, b) => (a.rank! > b.rank! ? a : b)) : null;

  const categories = Array.from(new Set(DATASET_LIST.map((d) => d.category)));

  // 物価サマリー用。costIndexは「値が小さいほど物価が安い」ので、
  // 全国順位は降順ランキングではなく昇順（安い順）で数え直す。
  const costIndexPoints = latestByArea(await loadDataset("costIndex"));
  const costIndexAscending = [...costIndexPoints].sort((a, b) => a.value - b.value);
  const costIndexRank = costIndexAscending.findIndex((p) => p.areaCode === prefecture.code);
  const costIndexRow = rowByDatasetId.get("costIndex");
  const costIndexValue = costIndexRow?.latest?.value ?? null;
  const costIndexMedian = costIndexRow?.benchmark ?? null;
  const cheapRank = costIndexRank === -1 ? null : costIndexRank + 1;
  const costIndexTotal = costIndexAscending.length;

  // サマリーに並べる代表的な生活費の指標
  const costHighlightIds = ["rent", "electricityBill", "gasBill", "gasoline"];
  const costHighlights = costHighlightIds
    .map((id) => {
      const row = rowByDatasetId.get(id);
      if (!row?.latest) return null;
      return { title: row.dataset.title, unit: row.dataset.unit, value: row.latest.value };
    })
    .filter((v): v is { title: string; unit: string; value: number } => v !== null);

  return (
    <div>
      <p className="dm-eyebrow">都道府県ページ</p>
      <h1>{prefecture.name}</h1>

      {bestRow && worstRow && bestRow.dataset.id !== worstRow.dataset.id && (
        <p className="dm-lede">
          当サイトが掲載する{rankedRows.length}指標の中で、{prefecture.name}
          が全国で最も高い順位にあるのは「{bestRow.dataset.title}」（全国{bestRow.rank!}位）、
          逆に最も低い順位にあるのは「{worstRow.dataset.title}」（全国{worstRow.rank!}位）です。
        </p>
      )}

      {compositeTotal > 0 && (
        <>
          <div className="dm-composite">
            <div className="dm-composite-score">
              {compositeScore}
              <span> / {compositeTotal}</span>
            </div>
            <div className="dm-composite-body">
              <p>
                <strong>{prefecture.name}の総合力スコア</strong> — 県民所得・人口10万人あたり病院数・持ち家比率・年少人口割合・高齢化率の5指標のうち、全国の中央値より良い方向にある指標の数です。
              </p>
              <p style={{ marginTop: 6 }}>{compositeComment(compositeScore, compositeTotal)}</p>
              <div className="dm-composite-tags">
                {composite.map((c) => (
                  <span key={c.title} className={`dm-composite-tag ${c.favorable ? "dm-tag-up" : "dm-tag-down"}`}>
                    {c.favorable ? "◎" : "△"} {c.title}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <p className="dm-doc-updated">
            ※ 当サイトが独自に定義した簡易的な集計であり、学術的な評価指標ではありません。詳しくは
            <Link href="/articles/prefecture-composite-score-explained">解説記事</Link>
            をご覧ください。
          </p>
        </>
      )}

      {cheapRank !== null && costIndexValue !== null && (
        <>
          <div className="dm-composite" style={{ marginTop: 16 }}>
            <div className="dm-composite-score">
              {cheapRank}
              <span> / {costIndexTotal}</span>
            </div>
            <div className="dm-composite-body">
              <p>
                <strong>{prefecture.name}の物価</strong> — 家賃・電気代・ガソリン・食料品など19品目を合計した
                <Link href="/dashboard/costIndex">生活費指数</Link>
                は{costIndexValue.toLocaleString()}円で、物価が<strong>安い順で全国{cheapRank}位</strong>です
                {costIndexMedian !== null &&
                  `（全国の中央値は${Math.round(costIndexMedian).toLocaleString()}円）`}
                。
              </p>
              {costHighlights.length > 0 && (
                <div className="dm-composite-tags">
                  {costHighlights.map((h) => (
                    <span key={h.title} className="dm-composite-tag">
                      {h.title} {h.value.toLocaleString()}
                      {h.unit}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
          <p className="dm-doc-updated">
            ※ 月額の品目と単発の品目が混在した簡易的な指数で、実際の月間生活費そのものではありません。
            <Link href="/ranking/costIndex">物価が安い県ランキング</Link>で全国の並びを確認できます。
          </p>
        </>
      )}

      {categories.map((category) => (
        <div key={category} style={{ marginTop: 32 }}>
          <h2>{category}</h2>
          <table className="dm-table" style={{ marginTop: 12 }}>
            <thead>
              <tr>
                <th>指標</th>
                <th className="dm-num">値</th>
                <th className="dm-num" style={{ width: 70 }}>
                  年
                </th>
                <th className="dm-num" style={{ width: 90 }}>
                  全国順位
                </th>
              </tr>
            </thead>
            <tbody>
              {rows
                .filter((r) => r.dataset.category === category)
                .map(({ dataset, latest, rank }) => (
                  <tr key={dataset.id}>
                    <td>
                      <Link href={`/dashboard/${dataset.id}`}>{dataset.title}</Link>
                    </td>
                    <td className="dm-num dm-mono">
                      {latest ? `${latest.value.toLocaleString()} ${dataset.unit}` : "データなし"}
                    </td>
                    <td className="dm-num dm-mono" style={{ color: "var(--dm-muted)" }}>
                      {latest?.year ?? "-"}
                    </td>
                    <td className="dm-num dm-mono" style={{ color: "var(--dm-muted)" }}>
                      {rank ? `${rank}位 / 47` : "-"}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      ))}

      {rows.some((r) => r.dataset.chart === "line" && r.series.length > 0) && (
        <div style={{ marginTop: 40 }}>
          <h2>推移グラフ</h2>
          <div className="dm-chart-grid">
            {rows
              .filter((r) => r.dataset.chart === "line" && r.series.length > 0)
              .map(({ dataset, series }) => (
                <div key={dataset.id} className="dm-chart-card">
                  <h3>{dataset.title}</h3>
                  <TrendChart data={series} unit={dataset.unit} height={200} />
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
