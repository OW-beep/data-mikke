import { readFile } from "node:fs/promises";
import path from "node:path";
import { Provider } from "@/providers/types";
import { DataPoint } from "@/types/data";
import { PREFECTURES } from "@/lib/prefectures";

/**
 * 総務省統計局「小売物価統計調査」（2025年、都道府県庁所在市等の平均）
 * CSVフォーマット: areaCode,year,value（valueは円）
 * 想定運用: data/raw/coffeePrice.csv を最新のデータに差し替えて npm run sync。
 */
export const manualCoffeePriceProvider: Provider = {
  id: "manual-coffee-price",
  datasetId: "coffeePrice",

  async fetch(): Promise<DataPoint[]> {
    const csvPath = path.join(process.cwd(), "data", "raw", "coffeePrice.csv");
    let raw: string;
    try {
      raw = await readFile(csvPath, "utf-8");
    } catch {
      console.warn("[manual/coffeePrice] data/raw/coffeePrice.csv が無いためモックデータを使用します");
      return mockCoffeePrice();
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
        dataset: "coffeePrice",
        areaCode: pref.code,
        areaName: pref.name,
        year: Number(yearRaw),
        value: Number(valueRaw)
      };
    })
    .filter((v): v is DataPoint => v !== null);
}

function mockCoffeePrice(): DataPoint[] {
  return PREFECTURES.map((pref) => ({
    dataset: "coffeePrice",
    areaCode: pref.code,
    areaName: pref.name,
    year: 2025,
    value: 100 + (Number(pref.code) % 20) * 3
  }));
}
