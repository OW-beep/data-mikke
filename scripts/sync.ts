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
/**
 * 本番ビルドでダミー（モック）データが使われていないかを検知するための仕組み。
 *
 * 各providerは、e-Statの取得に失敗したときなどに「モックデータ」へ自動で切り替わる。
 * 開発中は便利だが、本番でこれが起きると、実際とは違う（人口が約90万人の埼玉県のような）
 * 数字がそのまま公開されてしまう。そこで、VERCELの本番ビルド（またはREQUIRE_REAL_DATA=1）では、
 * モックデータが使われた時点でビルドを失敗させ、前回の正しいサイトを残す。
 * 意図してモックを許す場合は ALLOW_MOCK_DATA=1 を設定する。
 */
const mockMessages: string[] = [];
for (const level of ["warn", "error"] as const) {
  const original = console[level].bind(console);
  console[level] = (...args: unknown[]) => {
    const text = args.map((a) => String(a)).join(" ");
    if (text.includes("モックデータ")) mockMessages.push(text);
    original(...args);
  };
}

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

  const requireRealData =
    (process.env.VERCEL_ENV === "production" || process.env.REQUIRE_REAL_DATA === "1") &&
    process.env.ALLOW_MOCK_DATA !== "1";
  if (requireRealData && mockMessages.length > 0) {
    console.error(
      `\n本番ビルドでダミー（モック）データが使われたため、ビルドを中止します（${mockMessages.length}件）。ESTAT_APP_IDの設定とe-Stat APIの状態を確認してください。`
    );
    mockMessages.forEach((m) => console.error(` - ${m}`));
    process.exitCode = 1;
    return;
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
