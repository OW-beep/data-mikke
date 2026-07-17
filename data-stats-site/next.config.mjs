/** @type {import('next').NextConfig} */
const nextConfig = {
  // /api/[dataset] はリクエスト時に data/normalized/*.json を読むため、
  // Vercelのサーバーレス関数バンドルに含める必要がある。
  // (動的パス `data/normalized/${id}.json` は自動トレースされないため明示指定)
  outputFileTracingIncludes: {
    "/api/[dataset]": ["./data/normalized/**"]
  }
};

export default nextConfig;
