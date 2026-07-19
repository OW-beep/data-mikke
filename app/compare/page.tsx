import { DATASET_LIST } from "@/datasets";
import { PREFECTURES } from "@/lib/prefectures";
import { CompareClient } from "@/components/CompareClient";

export const metadata = {
  title: "都道府県を比べる",
  description: "指標と2つの都道府県を選んで、人口・医療などの統計データを比較できます。"
};

export default function ComparePage() {
  const comparableDatasets = DATASET_LIST.filter((d) => d.compare);

  return (
    <div>
      <p className="dm-eyebrow">見比べる</p>
      <h1>都道府県を比べる</h1>
      <p className="dm-lede">指標と2つの都道府県を選ぶと、標本を並べるように数字を比較できます。</p>
      <CompareClient datasets={comparableDatasets} prefectures={PREFECTURES} />
    </div>
  );
}
