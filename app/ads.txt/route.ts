import { NextResponse } from "next/server";
import { SITE } from "@/lib/site";

/**
 * /ads.txt
 * AdSenseの審査・広告配信に必要なファイル。
 * NEXT_PUBLIC_ADSENSE_CLIENT（例: "ca-pub-1234567890123456"）を
 * Vercelの環境変数に設定すると、pub-の数字部分を使って自動生成される。
 * 未設定の間は、レイアウトの確認用スクリプトと同じ既定値
 * （SITE.adsenseClientId = ca-pub-4630812027939211）を使う。
 * 以前は未設定時に空のads.txt（200 OK・0バイト）を返しており、
 * ライブで ads.txt が空になっている不具合があったため修正した。
 */
export async function GET() {
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? SITE.adsenseClientId;
  const pubId = clientId.replace("ca-pub-", "pub-");

  const body = pubId.startsWith("pub-")
    ? `google.com, ${pubId}, DIRECT, f08c47fec0942fa0\n`
    : "";

  return new NextResponse(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" }
  });
}
