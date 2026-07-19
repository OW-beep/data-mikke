import { readFile } from "node:fs/promises";
import path from "node:path";
import { Provider } from "@/providers/types";
import { DataPoint } from "@/types/data";
import { PREFECTURES } from "@/lib/prefectures";

/**
 * 資源エネルギー庁「電力調査統計」の電灯使用電力量CSVを読み込むProvider。
 * 想定運用: data/raw/electricity.csv を最新年のデータに差し替えて npm run sync。
 */
export const manualElectricityProvider: Provider = {
  id: "manual-electricity",
  datasetId: "electricity",

  async fetch(): Promise<DataPoint[]> {
    const csvPath = path.join(process.cwd(), "data", "raw", "electricity.csv");
    let raw: string;
    try {
      raw = await readFile(csvPath, "utf-8");
    } catch {
      console.warn("[manual/electricity] data/raw/electricity.csv が無いためモックデータを使用します");
      return mockElectricity();
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
        dataset: "electricity",
        areaCode: pref.code,
        areaName: pref.name,
        year: Number(yearRaw),
        value: Number(valueRaw)
      };
    })
    .filter((v): v is DataPoint => v !== null);
}

function mockElectricity(): DataPoint[] {
  return PREFECTURES.map((pref) => ({
    dataset: "electricity",
    areaCode: pref.code,
    areaName: pref.name,
    year: 2013,
    value: 1500 + (Number(pref.code) % 15) * 900
  }));
}
