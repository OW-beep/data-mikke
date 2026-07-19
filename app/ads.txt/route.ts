import { NextResponse } from "next/server";

/**
 * /ads.txt
 * AdSenseの審査・広告配信に必要なファイル。
 * NEXT_PUBLIC_ADSENSE_CLIENT（例: "ca-pub-1234567890123456"）を
 * Vercelの環境変数に設定すると、pub-の数字部分を使って自動生成される。
 * 未設定の間は空のads.txt（200 OK）を返す。
 */
export async function GET() {
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? "";
  const pubId = clientId.replace("ca-pub-", "pub-");

  const body = pubId.startsWith("pub-")
    ? `google.com, ${pubId}, DIRECT, f08c47fec0942fa0\n`
    : "";

  return new NextResponse(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" }
  });
}
