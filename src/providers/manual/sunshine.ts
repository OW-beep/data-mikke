import { readFile } from "node:fs/promises";
import path from "node:path";
import { Provider } from "@/providers/types";
import { DataPoint } from "@/types/data";
import { PREFECTURES } from "@/lib/prefectures";

/**
 * 気象庁観測データに基づく年間日照時間CSVを読み込むProvider（気候カテゴリ）。
 * 想定運用: data/raw/sunshine.csv を最新年のデータに差し替えて npm run sync。
 */
export const manualSunshineProvider: Provider = {
  id: "manual-sunshine",
  datasetId: "sunshine",

  async fetch(): Promise<DataPoint[]> {
    const csvPath = path.join(process.cwd(), "data", "raw", "sunshine.csv");
    let raw: string;
    try {
      raw = await readFile(csvPath, "utf-8");
    } catch {
      console.warn("[manual/sunshine] data/raw/sunshine.csv が無いためモックデータを使用します");
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
        dataset: "sunshine",
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
    dataset: "sunshine",
    areaCode: pref.code,
    areaName: pref.name,
    year: 2014,
    value: 1700 + (Number(pref.code) % 15) * 40
  }));
}
