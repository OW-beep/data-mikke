import { readFile } from "node:fs/promises";
import path from "node:path";
import { DataPoint } from "@/types/data";

/**
 * data/normalized/{datasetId}.json を読み込む。
 * Dashboard / Ranking / Compare / Prefecture / API はすべてこの1関数経由でデータを取る。
 * npm run sync で生成されたJSONを読むだけなので、データソースが何であっても画面側は同じ。
 */
export async function loadDataset(datasetId: string): Promise<DataPoint[]> {
  const filePath = path.join(process.cwd(), "data", "normalized", `${datasetId}.json`);
  try {
    const raw = await readFile(filePath, "utf-8");
    return JSON.parse(raw) as DataPoint[];
  } catch {
    // まだ npm run sync していない場合など
    return [];
  }
}

/** 最新年の値だけを都道府県ごとに1件抽出（ランキング・KPI表示用） */
export function latestByArea(points: DataPoint[]): DataPoint[] {
  const map = new Map<string, DataPoint>();
  for (const p of points) {
    const current = map.get(p.areaCode);
    if (!current || p.year > current.year) {
      map.set(p.areaCode, p);
    }
  }
  return Array.from(map.values());
}

/** ランキング用に降順ソート */
export function rankDescending(points: DataPoint[]): DataPoint[] {
  return [...points].sort((a, b) => b.value - a.value);
}

/** 特定都道府県の時系列 */
export function seriesForArea(points: DataPoint[], areaCode: string): DataPoint[] {
  return points
    .filter((p) => p.areaCode === areaCode)
    .sort((a, b) => a.year - b.year);
}
