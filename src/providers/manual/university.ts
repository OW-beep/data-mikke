import { readFile } from "node:fs/promises";
import path from "node:path";
import { Provider } from "@/providers/types";
import { DataPoint } from "@/types/data";
import { PREFECTURES } from "@/lib/prefectures";

/**
 * 学校基本調査による都道府県別大学数CSVを読み込むProvider（教育カテゴリ）。
 * 想定運用: data/raw/university.csv を最新年のデータに差し替えて npm run sync。
 */
export const manualUniversityProvider: Provider = {
  id: "manual-university",
  datasetId: "university",

  async fetch(): Promise<DataPoint[]> {
    const csvPath = path.join(process.cwd(), "data", "raw", "university.csv");
    let raw: string;
    try {
      raw = await readFile(csvPath, "utf-8");
    } catch {
      console.warn("[manual/university] data/raw/university.csv が無いためモックデータを使用します");
      return mockUniversity();
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
        dataset: "university",
        areaCode: pref.code,
        areaName: pref.name,
        year: Number(yearRaw),
        value: Number(valueRaw)
      };
    })
    .filter((v): v is DataPoint => v !== null);
}

function mockUniversity(): DataPoint[] {
  return PREFECTURES.map((pref) => ({
    dataset: "university",
    areaCode: pref.code,
    areaName: pref.name,
    year: 2014,
    value: 2 + (Number(pref.code) % 15) * 3
  }));
}
