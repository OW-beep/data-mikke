import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

/**
 * GET /api/kurashi-catalog
 *
 * くらしツール（/tools/kurashi）専用の「追加品目カタログ」を配信するAPI。
 *
 * 総務省「小売物価統計調査」には500品目を超える調査対象があるが、そのすべてを
 * 個別のdataset（Dashboard/Ranking/Compareを持つ一級市民）として登録すると、
 * サイトのデータ一覧が埋もれてしまう。そのため、生活費カテゴリとして登録した
 * 19品目（家賃・電気代・野菜・肉類など、代表的で見応えのある品目）以外は、
 * このカタログ経由でくらしツール内の「品目を追加」機能だけに供給する。
 *
 * データはdata/kurashi/retailCatalog.jsonに事前集計済み（都市別価格を
 * 都道府県単位に平均化したもの）を置き、そのまま返すだけ。
 */
let cache: unknown | null = null;

export async function GET() {
  if (!cache) {
    const filePath = path.join(process.cwd(), "data", "kurashi", "retailCatalog.json");
    const raw = await readFile(filePath, "utf-8");
    cache = JSON.parse(raw);
  }
  return NextResponse.json(cache);
}
