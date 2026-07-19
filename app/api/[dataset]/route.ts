import { NextRequest, NextResponse } from "next/server";
import { getDataset } from "@/datasets";
import { loadDataset } from "@/lib/loadData";

/**
 * GET /api/population
 * GET /api/population?areaCode=13
 *
 * サイトが持つ正規化済みJSONをそのまま外部公開する。
 * 「サイト自身もAPIを持つ」（設計ドキュメントの「API」節）を実装したもの。
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { dataset: string } }
) {
  const dataset = getDataset(params.dataset);
  if (!dataset) {
    return NextResponse.json({ error: "dataset not found" }, { status: 404 });
  }

  const points = await loadDataset(dataset.id);
  const areaCode = req.nextUrl.searchParams.get("areaCode");
  const filtered = areaCode ? points.filter((p) => p.areaCode === areaCode) : points;

  return NextResponse.json({
    dataset: dataset.id,
    title: dataset.title,
    unit: dataset.unit,
    source: dataset.source,
    count: filtered.length,
    data: filtered
  });
}
