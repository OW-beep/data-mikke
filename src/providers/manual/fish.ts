import { readFile } from "node:fs/promises";
import path from "node:path";
import { Provider } from "@/providers/types";
import { DataPoint } from "@/types/data";
import { PREFECTURES } from "@/lib/prefectures";

/**
 * 農林水産省「漁業・養殖業生産統計」の海面漁業漁獲量CSVを読み込むProvider（農林水産カテゴリ）。
 * 内陸県は海に面していないため0（欠損ではなく実際の値として扱う）。
 * 想定運用: data/raw/fish.csv を最新年のデータに差し替えて npm run sync。
 */
export const manualFishProvider: Provider = {
  id: "manual-fish",
  datasetId: "fish",

  async fetch(): Promise<DataPoint[]> {
    const csvPath = path.join(process.cwd(), "data", "raw", "fish.csv");
    let raw: string;
    try {
      raw = await readFile(csvPath, "utf-8");
    } catch {
      console.warn("[manual/fish] data/raw/fish.csv が無いためモックデータを使用します");
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
        dataset: "fish",
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
    dataset: "fish",
    areaCode: pref.code,
    areaName: pref.name,
    year: 2013,
    value: (Number(pref.code) % 3 === 0) ? 0 : 10 + (Number(pref.code) % 15) * 6
  }));
}
