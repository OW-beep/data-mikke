import { readFile } from "node:fs/promises";
import path from "node:path";
import { Provider } from "@/providers/types";
import { DataPoint } from "@/types/data";
import { PREFECTURES } from "@/lib/prefectures";

/**
 * 厚生労働省「都道府県別生命表」の平均寿命（男性）CSVを読み込むProvider（健康カテゴリ）。
 * 想定運用: data/raw/lifeexpectancy_male.csv を最新（5年おき公表）のデータに差し替えて npm run sync。
 */
export const manualLifeExpectancyMaleProvider: Provider = {
  id: "manual-life-expectancy-male",
  datasetId: "lifeExpectancyMale",

  async fetch(): Promise<DataPoint[]> {
    const csvPath = path.join(process.cwd(), "data", "raw", "lifeexpectancy_male.csv");
    let raw: string;
    try {
      raw = await readFile(csvPath, "utf-8");
    } catch {
      console.warn(
        "[manual/lifeExpectancyMale] data/raw/lifeexpectancy_male.csv が無いためモックデータを使用します"
      );
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
        dataset: "lifeExpectancyMale",
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
    dataset: "lifeExpectancyMale",
    areaCode: pref.code,
    areaName: pref.name,
    year: 2020,
    value: 80 + (Number(pref.code) % 15) * 0.15
  }));
}
