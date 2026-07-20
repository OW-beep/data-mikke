import { readFile } from "node:fs/promises";
import path from "node:path";
import { Provider } from "@/providers/types";
import { DataPoint } from "@/types/data";
import { PREFECTURES } from "@/lib/prefectures";

/**
 * 文化庁が指定する国宝・重要文化財のうち「建造物」だけの件数CSVを読み込むProvider。
 * culturalProperty（建造物＋美術工芸品の総数）を、種別ごとに分解した精度の高い指標。
 * 想定運用: data/raw/culturalpropertybuilding.csv を最新の集計に差し替えて npm run sync。
 */
export const manualCulturalPropertyBuildingProvider: Provider = {
  id: "manual-cultural-property-building",
  datasetId: "culturalPropertyBuilding",

  async fetch(): Promise<DataPoint[]> {
    const csvPath = path.join(process.cwd(), "data", "raw", "culturalpropertybuilding.csv");
    let raw: string;
    try {
      raw = await readFile(csvPath, "utf-8");
    } catch {
      console.warn(
        "[manual/culturalPropertyBuilding] data/raw/culturalpropertybuilding.csv が無いためモックデータを使用します"
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
        dataset: "culturalPropertyBuilding",
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
    dataset: "culturalPropertyBuilding",
    areaCode: pref.code,
    areaName: pref.name,
    year: 2013,
    value: 10 + (Number(pref.code) % 15) * 10
  }));
}
