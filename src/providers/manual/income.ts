import { readFile } from "node:fs/promises";
import path from "node:path";
import { Provider } from "@/providers/types";
import { DataPoint } from "@/types/data";
import { PREFECTURES } from "@/lib/prefectures";

/**
 * 内閣府「県民経済計算」などが公表する1人当たり県民所得のCSVを読み込むProvider。
 * 想定運用:
 *   1. data/raw/income.csv を差し替える（e-Stat/内閣府の公表データに合わせる）
 *   2. npm run sync を実行する
 * だけで完結する。
 *
 * CSVフォーマット: areaCode,year,value（valueは千円）
 * 例:
 *   13,2022,5214
 *   47,2022,2167
 */
export const manualIncomeProvider: Provider = {
  id: "manual-income",
  datasetId: "income",

  async fetch(): Promise<DataPoint[]> {
    const csvPath = path.join(process.cwd(), "data", "raw", "income.csv");

    let raw: string;
    try {
      raw = await readFile(csvPath, "utf-8");
    } catch {
      console.warn("[manual/income] data/raw/income.csv が無いためモックデータを使用します");
      return mockIncome();
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
        dataset: "income",
        areaCode: pref.code,
        areaName: pref.name,
        year: Number(yearRaw),
        value: Number(valueRaw)
      };
    })
    .filter((v): v is DataPoint => v !== null);
}

function mockIncome(): DataPoint[] {
  return PREFECTURES.map((pref) => ({
    dataset: "income",
    areaCode: pref.code,
    areaName: pref.name,
    year: 2022,
    value: 2500 + (Number(pref.code) % 12) * 90
  }));
}
