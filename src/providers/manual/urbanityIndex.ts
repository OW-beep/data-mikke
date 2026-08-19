import { readFile } from "node:fs/promises";
import path from "node:path";
import { Provider } from "@/providers/types";
import { DataPoint } from "@/types/data";
import { PREFECTURES } from "@/lib/prefectures";

/**
 * 「都市度指数」Provider。
 *
 * 当サイトが保有する20指標（経済・医療・治安・自然・生活・文化・教育・産業・気候）を
 * 標準化した上で主成分分析(PCA)を実施し、第1主成分（寄与率31.9%）をそのまま
 * 都道府県別の指数として保存したもの。
 *
 * 県民所得・平均年収・家賃・人口密度・刑法犯認知件数などの「都市集積型」の指標が
 * まとまって高いほどプラス、森林率・看護師数（人口あたり）・持ち家率などの
 * 「地方型」の指標が高いほどマイナスになる。
 *
 * 算出はPython(pandas/scikit-learn)で一度きり実行し、結果をCSVとして固定している。
 * 元データが更新された場合は再計算が必要（他の manual データセットと同じ運用）。
 * 算出スクリプトの再現手順はdata/raw/urbanityindex.csvのヘッダーコメントを参照。
 */
export const manualUrbanityIndexProvider: Provider = {
  id: "manual-urbanity-index",
  datasetId: "urbanityIndex",

  async fetch(): Promise<DataPoint[]> {
    const csvPath = path.join(process.cwd(), "data", "raw", "urbanityindex.csv");
    let raw: string;
    try {
      raw = await readFile(csvPath, "utf-8");
    } catch {
      console.warn(
        "[manual/urbanityIndex] data/raw/urbanityindex.csv が無いためモックデータを使用します"
      );
      return mockData();
    }
    return parseCsv(raw);
  }
};

function parseCsv(raw: string): DataPoint[] {
  const lines = raw
    .trim()
    .split("\n")
    .filter((line) => line.length > 0 && !line.startsWith("#"));

  return lines
    .map((line): DataPoint | null => {
      const [areaCodeRaw, yearRaw, valueRaw] = line.split(",").map((s) => s.trim());
      const areaCode = areaCodeRaw.padStart(2, "0");
      const pref = PREFECTURES.find((p) => p.code === areaCode);
      if (!pref) return null;
      return {
        dataset: "urbanityIndex",
        areaCode: pref.code,
        areaName: pref.name,
        year: Number(yearRaw),
        value: Number(valueRaw)
      };
    })
    .filter((v): v is DataPoint => v !== null);
}

function mockData(): DataPoint[] {
  return PREFECTURES.map((pref) => ({
    dataset: "urbanityIndex",
    areaCode: pref.code,
    areaName: pref.name,
    year: 2026,
    value: 0
  }));
}
