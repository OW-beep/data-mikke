import { readFile } from "node:fs/promises";
import path from "node:path";
import { Provider } from "@/providers/types";
import { DataPoint } from "@/types/data";
import { PREFECTURES } from "@/lib/prefectures";

/**
 * 農林水産省「牛乳乳製品統計調査」の生乳生産量CSVを読み込むProvider。
 * ニッチだが都道府県差が非常に大きい（北海道が全国の過半数を占める）ため、
 * 独自性のあるコンテンツとして採用。
 *
 * 想定運用: data/raw/milk.csv を最新年のデータに差し替えて npm run sync。
 */
export const manualMilkProvider: Provider = {
  id: "manual-milk",
  datasetId: "milk",

  async fetch(): Promise<DataPoint[]> {
    const csvPath = path.join(process.cwd(), "data", "raw", "milk.csv");
    let raw: string;
    try {
      raw = await readFile(csvPath, "utf-8");
    } catch {
      console.warn("[manual/milk] data/raw/milk.csv が無いためモックデータを使用します");
      return mockMilk();
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
        dataset: "milk",
        areaCode: pref.code,
        areaName: pref.name,
        year: Number(yearRaw),
        value: Number(valueRaw)
      };
    })
    .filter((v): v is DataPoint => v !== null);
}

function mockMilk(): DataPoint[] {
  return PREFECTURES.map((pref) => ({
    dataset: "milk",
    areaCode: pref.code,
    areaName: pref.name,
    year: 2011,
    value: pref.code === "01" ? 3876 : 10 + (Number(pref.code) % 20) * 5
  }));
}
