import { readFile } from "node:fs/promises";
import path from "node:path";
import { Provider } from "@/providers/types";
import { DataPoint } from "@/types/data";
import { PREFECTURES } from "@/lib/prefectures";

/**
 * 資源エネルギー庁「都道府県別エネルギー消費統計」の家庭部門電力消費量CSVを読み込むProvider。
 * 従来のelectricity（電灯使用電力量、契約種別ベースの2013年データ）よりも、
 * 産業・家庭・業務他の3部門に分解された、より正確な「家庭での電力消費」の指標。
 * 想定運用: data/raw/electricityhousehold.csv を最新年度のデータに差し替えて npm run sync。
 */
export const manualElectricityHouseholdProvider: Provider = {
  id: "manual-electricity-household",
  datasetId: "electricityHousehold",

  async fetch(): Promise<DataPoint[]> {
    const csvPath = path.join(process.cwd(), "data", "raw", "electricityhousehold.csv");
    let raw: string;
    try {
      raw = await readFile(csvPath, "utf-8");
    } catch {
      console.warn(
        "[manual/electricityHousehold] data/raw/electricityhousehold.csv が無いためモックデータを使用します"
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
        dataset: "electricityHousehold",
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
    dataset: "electricityHousehold",
    areaCode: pref.code,
    areaName: pref.name,
    year: 2016,
    value: 1500 + (Number(pref.code) % 15) * 900
  }));
}
