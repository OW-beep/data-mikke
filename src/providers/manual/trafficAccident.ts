import { readFile } from "node:fs/promises";
import path from "node:path";
import { Provider } from "@/providers/types";
import { DataPoint } from "@/types/data";
import { PREFECTURES } from "@/lib/prefectures";

/**
 * 警察庁「交通事故統計」の人口10万人あたり交通事故死者数CSVを読み込むProvider（治安カテゴリ）。
 * 想定運用: data/raw/trafficaccident.csv を最新の集計に差し替えて npm run sync。
 */
export const manualTrafficAccidentProvider: Provider = {
  id: "manual-traffic-accident",
  datasetId: "trafficAccident",

  async fetch(): Promise<DataPoint[]> {
    const csvPath = path.join(process.cwd(), "data", "raw", "trafficaccident.csv");
    let raw: string;
    try {
      raw = await readFile(csvPath, "utf-8");
    } catch {
      console.warn("[manual/trafficAccident] data/raw/trafficaccident.csv が無いためモックデータを使用します");
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
        dataset: "trafficAccident",
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
    dataset: "trafficAccident",
    areaCode: pref.code,
    areaName: pref.name,
    year: 2012,
    value: 2 + (Number(pref.code) % 15) * 0.3
  }));
}
