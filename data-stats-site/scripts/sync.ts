import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { DATASET_LIST } from "../src/datasets";
import { PROVIDERS } from "../src/providers";
import { DataPoint } from "../src/types/data";

/**
 * 保守フロー（ドキュメントの「保守フロー」参照）:
 *   1. CSV/Excelを置き換える（必要なものだけ）
 *   2. npm run sync
 *      - API取得
 *      - CSV/Excel読込
 *      - 共通JSON生成
 *   3. npm run build
 *   4. デプロイ
 *
 * データソースが増えても、この処理自体は一切変更不要。
 * datasets/ と providers/ に追加するだけでよい。
 */
async function main() {
  const outDir = path.join(process.cwd(), "data", "normalized");
  await mkdir(outDir, { recursive: true });

  const results: { id: string; count: number; ok: boolean }[] = [];

  for (const dataset of DATASET_LIST) {
    const provider = PROVIDERS[dataset.providerId];
    if (!provider) {
      console.error(`✗ ${dataset.id}: Provider "${dataset.providerId}" が見つかりません`);
      results.push({ id: dataset.id, count: 0, ok: false });
      continue;
    }

    try {
      const points: DataPoint[] = await provider.fetch();
      const outPath = path.join(outDir, `${dataset.id}.json`);
      await writeFile(outPath, JSON.stringify(points, null, 2), "utf-8");
      console.log(`✓ ${dataset.id}: ${points.length}件 → data/normalized/${dataset.id}.json`);
      results.push({ id: dataset.id, count: points.length, ok: true });
    } catch (err) {
      console.error(`✗ ${dataset.id}:`, err);
      results.push({ id: dataset.id, count: 0, ok: false });
    }
  }

  const failed = results.filter((r) => !r.ok);
  if (failed.length > 0) {
    console.error(`\n${failed.length}件のdatasetで同期に失敗しました`);
    process.exitCode = 1;
  } else {
    console.log(`\n全${results.length}件のdatasetを正常に同期しました`);
  }
}

main();
