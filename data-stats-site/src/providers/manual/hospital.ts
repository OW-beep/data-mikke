import { readFile } from "node:fs/promises";
import path from "node:path";
import { Provider } from "@/providers/types";
import { DataPoint } from "@/types/data";
import { PREFECTURES } from "@/lib/prefectures";

/**
 * 厚労省などが公開するCSV/Excelから作成した病院数データを読み込むProvider。
 * 想定運用:
 *   1. data/raw/hospital.csv を差し替える
 *   2. npm run sync を実行する
 * だけで完結する（「保守フロー」参照）。
 *
 * CSVフォーマット: areaCode,year,value
 * 例:
 *   13,2025,650
 *   27,2025,520
 */
export const manualHospitalProvider: Provider = {
  id: "manual-hospital",
  datasetId: "hospital",

  async fetch(): Promise<DataPoint[]> {
    const csvPath = path.join(process.cwd(), "data", "raw", "hospital.csv");

    let raw: string;
    try {
      raw = await readFile(csvPath, "utf-8");
    } catch {
      console.warn(
        "[manual/hospital] data/raw/hospital.csv が無いためモックデータを使用します"
      );
      return mockHospital();
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
        dataset: "hospital",
        areaCode: pref.code,
        areaName: pref.name,
        year: Number(yearRaw),
        value: Number(valueRaw)
      };
    })
    .filter((v): v is DataPoint => v !== null);
}

function mockHospital(): DataPoint[] {
  return PREFECTURES.map((pref) => ({
    dataset: "hospital",
    areaCode: pref.code,
    areaName: pref.name,
    year: 2025,
    value: 50 + (Number(pref.code) % 10) * 13
  }));
}
