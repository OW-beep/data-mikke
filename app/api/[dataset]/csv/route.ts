import { NextRequest, NextResponse } from "next/server";
import { getDataset } from "@/datasets";
import { loadDataset } from "@/lib/loadData";

/**
 * GET /api/population/csv
 *
 * データを研究・二次利用しやすいCSV形式でダウンロードできるようにしたエンドポイント。
 * ブラウザで開くとそのままダウンロードが始まる（Content-Dispositionヘッダ付き）。
 */
export async function GET(_req: NextRequest, { params }: { params: { dataset: string } }) {
  const dataset = getDataset(params.dataset);
  if (!dataset) {
    return NextResponse.json({ error: "dataset not found" }, { status: 404 });
  }

  const points = await loadDataset(dataset.id);

  const header = "areaCode,areaName,year,value,unit,source\n";
  const rows = points
    .map((p) => `${p.areaCode},${p.areaName},${p.year},${p.value},${dataset.unit},${dataset.source}`)
    .join("\n");

  return new NextResponse(header + rows + "\n", {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${dataset.id}.csv"`
    }
  });
}
