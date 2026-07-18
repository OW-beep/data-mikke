import { readFile } from "node:fs/promises";
import path from "node:path";
import { Provider } from "@/providers/types";
import { DataPoint } from "@/types/data";
import { PREFECTURES } from "@/lib/prefectures";

/**
 * 総務省統計局「社会生活統計指標－都道府県の指標－」が公表する持ち家比率のCSVを読み込むProvider。
 * 5年おきに実施される「住宅・土地統計調査」がもとになっている。
 *
 * 想定運用:
 *   1. data/raw/homeownership.csv を差し替える（最新の社会生活統計指標に合わせる）
 *   2. npm run sync を実行する
 *
 * CSVフォーマット: areaCode,year,value（valueは%、持ち家比率）
 * 2003・2008・2013・2018年の4時点が入っているため、複数年の推移として表示される。
 */
export const manualHomeownershipProvider: Provider = {
  id: "manual-homeownership",
  datasetId: "homeownership",

  async fetch(): Promise<DataPoint[]> {
    const csvPath = path.join(process.cwd(), "data", "raw", "homeownership.csv");

    let raw: string;
    try {
      raw = await readFile(csvPath, "utf-8");
    } catch {
      console.warn(
        "[manual/homeownership] data/raw/homeownership.csv が無いためモックデータを使用します"
      );
      return mockHomeownership();
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
        dataset: "homeownership",
        areaCode: pref.code,
        areaName: pref.name,
        year: Number(yearRaw),
        value: Number(valueRaw)
      };
    })
    .filter((v): v is DataPoint => v !== null);
}

function mockHomeownership(): DataPoint[] {
  const years = [2003, 2008, 2013, 2018];
  return PREFECTURES.flatMap((pref) =>
    years.map((year) => ({
      dataset: "homeownership",
      areaCode: pref.code,
      areaName: pref.name,
      year,
      value: 60 + (Number(pref.code) % 15)
    }))
  );
}
