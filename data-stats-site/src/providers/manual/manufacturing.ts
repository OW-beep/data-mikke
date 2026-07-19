import { readFile } from "node:fs/promises";
import path from "node:path";
import { Provider } from "@/providers/types";
import { DataPoint } from "@/types/data";
import { PREFECTURES } from "@/lib/prefectures";

/**
 * 経済産業省「工業統計調査」の製造品出荷額等CSVを読み込むProvider。
 * 想定運用: data/raw/manufacturing.csv を最新年のデータに差し替えて npm run sync。
 */
export const manualManufacturingProvider: Provider = {
  id: "manual-manufacturing",
  datasetId: "manufacturing",

  async fetch(): Promise<DataPoint[]> {
    const csvPath = path.join(process.cwd(), "data", "raw", "manufacturing.csv");
    let raw: string;
    try {
      raw = await readFile(csvPath, "utf-8");
    } catch {
      console.warn("[manual/manufacturing] data/raw/manufacturing.csv が無いためモックデータを使用します");
      return mockManufacturing();
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
        dataset: "manufacturing",
        areaCode: pref.code,
        areaName: pref.name,
        year: Number(yearRaw),
        value: Number(valueRaw)
      };
    })
    .filter((v): v is DataPoint => v !== null);
}

function mockManufacturing(): DataPoint[] {
  return PREFECTURES.map((pref) => ({
    dataset: "manufacturing",
    areaCode: pref.code,
    areaName: pref.name,
    year: 2013,
    value: 500000 + (Number(pref.code) % 20) * 300000
  }));
}
