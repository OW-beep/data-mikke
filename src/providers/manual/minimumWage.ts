import { readFile } from "node:fs/promises";
import path from "node:path";
import { Provider } from "@/providers/types";
import { DataPoint } from "@/types/data";
import { PREFECTURES } from "@/lib/prefectures";

/**
 * 各都道府県労働局・厚生労働省の公表資料をもとにした、令和8年度（2026年度）地域別最低賃金
 * 答申額のCSVを読み込むProvider（経済カテゴリ）。
 * 2026年9月4日、沖縄県の答申をもって全47都道府県の答申が出そろった時点の値。
 * 官報公示前の答申額であり、発効日は都道府県により2026年10月1日〜12月2日の間で異なる。
 * 想定運用: 官報公示後の確定額が出たら data/raw/minimumWage.csv を差し替えて npm run sync。
 */
export const manualMinimumWageProvider: Provider = {
  id: "manual-minimum-wage",
  datasetId: "minimumWage",

  async fetch(): Promise<DataPoint[]> {
    const csvPath = path.join(process.cwd(), "data", "raw", "minimumWage.csv");
    let raw: string;
    try {
      raw = await readFile(csvPath, "utf-8");
    } catch {
      console.warn("[manual/minimumWage] data/raw/minimumWage.csv が無いためモックデータを使用します");
      return mockMinimumWage();
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
        dataset: "minimumWage",
        areaCode: pref.code,
        areaName: pref.name,
        year: Number(yearRaw),
        value: Number(valueRaw)
      };
    })
    .filter((v): v is DataPoint => v !== null);
}

function mockMinimumWage(): DataPoint[] {
  return PREFECTURES.map((pref) => ({
    dataset: "minimumWage",
    areaCode: pref.code,
    areaName: pref.name,
    year: 2026,
    value: 1000 + (Number(pref.code) % 20) * 5
  }));
}
