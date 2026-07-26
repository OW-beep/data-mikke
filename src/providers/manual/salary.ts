import { readFile } from "node:fs/promises";
import path from "node:path";
import { Provider } from "@/providers/types";
import { DataPoint } from "@/types/data";
import { PREFECTURES } from "@/lib/prefectures";

/**
 * 厚生労働省「賃金構造基本統計調査」をもとにした都道府県別平均年収CSVを読み込むProvider（経済カテゴリ）。
 * 県民所得（income、内閣府「県民経済計算」）とは出典・算出方法が異なり、
 * 個人の給与実態により近い指標。想定運用: data/raw/salary.csv を最新年のデータに差し替えて npm run sync。
 */
export const manualSalaryProvider: Provider = {
  id: "manual-salary",
  datasetId: "salary",

  async fetch(): Promise<DataPoint[]> {
    const csvPath = path.join(process.cwd(), "data", "raw", "salary.csv");
    let raw: string;
    try {
      raw = await readFile(csvPath, "utf-8");
    } catch {
      console.warn("[manual/salary] data/raw/salary.csv が無いためモックデータを使用します");
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
        dataset: "salary",
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
    dataset: "salary",
    areaCode: pref.code,
    areaName: pref.name,
    year: 2023,
    value: 380 + (Number(pref.code) % 15) * 12
  }));
}
