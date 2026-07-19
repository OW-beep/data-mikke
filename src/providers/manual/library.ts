import { readFile } from "node:fs/promises";
import path from "node:path";
import { Provider } from "@/providers/types";
import { DataPoint } from "@/types/data";
import { PREFECTURES } from "@/lib/prefectures";

/**
 * 文部科学省「社会教育調査」の図書館数CSVを読み込むProvider（教育カテゴリ）。
 * 想定運用: data/raw/library.csv を最新年のデータに差し替えて npm run sync。
 */
export const manualLibraryProvider: Provider = {
  id: "manual-library",
  datasetId: "library",

  async fetch(): Promise<DataPoint[]> {
    const csvPath = path.join(process.cwd(), "data", "raw", "library.csv");
    let raw: string;
    try {
      raw = await readFile(csvPath, "utf-8");
    } catch {
      console.warn("[manual/library] data/raw/library.csv が無いためモックデータを使用します");
      return mockLibrary();
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
        dataset: "library",
        areaCode: pref.code,
        areaName: pref.name,
        year: Number(yearRaw),
        value: Number(valueRaw)
      };
    })
    .filter((v): v is DataPoint => v !== null);
}

function mockLibrary(): DataPoint[] {
  return PREFECTURES.map((pref) => ({
    dataset: "library",
    areaCode: pref.code,
    areaName: pref.name,
    year: 2011,
    value: 20 + (Number(pref.code) % 15) * 8
  }));
}
