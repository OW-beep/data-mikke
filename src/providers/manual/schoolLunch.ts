import { readFile } from "node:fs/promises";
import path from "node:path";
import { Provider } from "@/providers/types";
import { DataPoint } from "@/types/data";
import { PREFECTURES } from "@/lib/prefectures";

/**
 * 厚生労働省の統計をもとにした特定給食施設数（学校・病院・事業所等の給食施設）CSVを
 * 読み込むProvider。想定運用: data/raw/schoollunch.csv を最新の集計に差し替えて npm run sync。
 */
export const manualSchoolLunchProvider: Provider = {
  id: "manual-school-lunch",
  datasetId: "schoolLunch",

  async fetch(): Promise<DataPoint[]> {
    const csvPath = path.join(process.cwd(), "data", "raw", "schoollunch.csv");
    let raw: string;
    try {
      raw = await readFile(csvPath, "utf-8");
    } catch {
      console.warn("[manual/schoolLunch] data/raw/schoollunch.csv が無いためモックデータを使用します");
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
        dataset: "schoolLunch",
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
    dataset: "schoolLunch",
    areaCode: pref.code,
    areaName: pref.name,
    year: 2008,
    value: 500 + (Number(pref.code) % 15) * 300
  }));
}
