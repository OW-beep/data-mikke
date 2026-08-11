import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// 日本語フォントをこの環境で読み込めないため、文字を使わずロゴマーク（虫眼鏡＋棒グラフ）と
// ブランドカラーのみで構成する。src/components/LogoMark.tsx のSVGパスを流用している。
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f4f6ee"
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 420,
            height: 420,
            borderRadius: "50%",
            background: "#fffefa",
            border: "3px solid #d8dcc8"
          }}
        >
          <svg width="260" height="260" viewBox="-30 -34 64 64">
            <circle cx="0" cy="-4" r="20" fill="none" stroke="#0b3b33" strokeWidth="5" />
            <line x1="14" y1="10" x2="26" y2="22" stroke="#0b3b33" strokeWidth="6" strokeLinecap="round" />
            <rect x="-11" y="2" width="5" height="8" rx="1" fill="#0f8c6c" />
            <rect x="-3" y="-4" width="5" height="14" rx="1" fill="#0f8c6c" />
            <rect x="5" y="-10" width="5" height="20" rx="1" fill="#0f8c6c" />
            <path d="M14 -26 L16 -21 L21 -19 L16 -17 L14 -12 L12 -17 L7 -19 L12 -21 Z" fill="#e4572e" />
          </svg>
        </div>
      </div>
    ),
    { ...size }
  );
}
