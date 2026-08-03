import { readFile } from "node:fs/promises";
import path from "node:path";
import { Provider } from "@/providers/types";
import { DataPoint } from "@/types/data";
import { PREFECTURES } from "@/lib/prefectures";

/**
 * 総務省統計局「小売物価統計調査」の家賃（1ヶ月・1坪あたり）CSVを読み込むProvider（住宅カテゴリ）。
 * 想定運用: data/raw/rent.csv を最新年のデータに差し替えて npm run sync。
 */
export const manualRentProvider: Provider = {
  id: "manual-rent",
  datasetId: "rent",

  async fetch(): Promise<DataPoint[]> {
    const csvPath = path.join(process.cwd(), "data", "raw", "rent.csv");
    let raw: string;
    try {
      raw = await readFile(csvPath, "utf-8");
    } catch {
      console.warn("[manual/rent] data/raw/rent.csv が無いためモックデータを使用します");
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
        dataset: "rent",
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
    dataset: "rent",
    areaCode: pref.code,
    areaName: pref.name,
    year: 2022,
    value: 3200 + (Number(pref.code) % 15) * 250
  }));
}
