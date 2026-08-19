import { readFile } from "node:fs/promises";
import path from "node:path";
import { Provider } from "@/providers/types";
import { DataPoint } from "@/types/data";
import { PREFECTURES } from "@/lib/prefectures";

/**
 * 「ものづくり・堅実度指数」Provider。
 *
 * 都市度指数(urbanityIndex)と同じ主成分分析(PCA)の第2主成分（寄与率16.8%）を
 * 都道府県別の指数として保存したもの。
 *
 * 製造品出荷額・貯蓄額・持ち家率・日照時間などが高いほどプラス、
 * 医師数・看護師数（いずれも人口あたり）・大学数・伝統的工芸品密度が高いほどマイナスになる。
 * 東京・大阪・福岡・沖縄・京都・北海道・鹿児島のように、都市度指数だけでは
 * 見えなかった「医療資源は豊富だが貯蓄・持ち家率は低い」という共通の性質を
 * このマイナス側の指数がまとめて捉えている。
 *
 * 算出はPython(pandas/scikit-learn)で一度きり実行し、結果をCSVとして固定している。
 */
export const manualMonozukuriIndexProvider: Provider = {
  id: "manual-monozukuri-index",
  datasetId: "monozukuriIndex",

  async fetch(): Promise<DataPoint[]> {
    const csvPath = path.join(process.cwd(), "data", "raw", "monozukuriindex.csv");
    let raw: string;
    try {
      raw = await readFile(csvPath, "utf-8");
    } catch {
      console.warn(
        "[manual/monozukuriIndex] data/raw/monozukuriindex.csv が無いためモックデータを使用します"
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
        dataset: "monozukuriIndex",
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
    dataset: "monozukuriIndex",
    areaCode: pref.code,
    areaName: pref.name,
    year: 2026,
    value: 0
  }));
}
