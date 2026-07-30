import { DATASET_LIST } from "@/datasets";
import { PREFECTURES } from "@/lib/prefectures";
import { CompareClient } from "@/components/CompareClient";

export const metadata = {
  title: "都道府県を比べる",
  description: "2つの都道府県を選ぶと、全指標を一括で比較できます。どちらが多くの指標で上回っているか、スコアボード形式で確認できます。"
};

export default function ComparePage() {
  const comparableDatasets = DATASET_LIST.filter((d) => d.compare);

  return (
    <div>
      <p className="dm-eyebrow">見比べる</p>
      <h1>都道府県を比べる</h1>
      <p className="dm-lede">
        2つの都道府県を選ぶと、{comparableDatasets.length}
        個の指標を一括で比較できます。どちらの数値が多くの指標で上回っているか、スコアボード形式で確認できます。
      </p>
      <CompareClient datasets={comparableDatasets} prefectures={PREFECTURES} />
    </div>
  );
}
