import { readFile } from "node:fs/promises";
import path from "node:path";
import { Provider } from "@/providers/types";
import { DataPoint } from "@/types/data";
import { PREFECTURES } from "@/lib/prefectures";

/**
 * 警察庁「犯罪統計」の人口1千人あたり刑法犯認知件数CSVを読み込むProvider。
 * 想定運用: data/raw/crime.csv を最新年のデータに差し替えて npm run sync。
 */
export const manualCrimeProvider: Provider = {
  id: "manual-crime",
  datasetId: "crime",

  async fetch(): Promise<DataPoint[]> {
    const csvPath = path.join(process.cwd(), "data", "raw", "crime.csv");
    let raw: string;
    try {
      raw = await readFile(csvPath, "utf-8");
    } catch {
      console.warn("[manual/crime] data/raw/crime.csv が無いためモックデータを使用します");
      return mockCrime();
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
        dataset: "crime",
        areaCode: pref.code,
        areaName: pref.name,
        year: Number(yearRaw),
        value: Number(valueRaw)
      };
    })
    .filter((v): v is DataPoint => v !== null);
}

function mockCrime(): DataPoint[] {
  return PREFECTURES.map((pref) => ({
    dataset: "crime",
    areaCode: pref.code,
    areaName: pref.name,
    year: 2011,
    value: 5 + (Number(pref.code) % 12) * 0.8
  }));
}
