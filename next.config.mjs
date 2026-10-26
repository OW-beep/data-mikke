/** @type {import('next').NextConfig} */
const nextConfig = {
  // 内容を統合した記事の旧URLを、統合先へ恒久的に転送する（検索評価と外部リンクを引き継ぐ）
  async redirects() {
    return [
      { source: "/articles/cultural-property-building-kyoto-nara-temples", destination: "/articles/cultural-property-four-ways-to-see-it", permanent: true },
      { source: "/articles/cultural-property-density-by-area", destination: "/articles/cultural-property-four-ways-to-see-it", permanent: true },
      { source: "/articles/cultural-property-kansai-concentration", destination: "/articles/cultural-property-four-ways-to-see-it", permanent: true },
      { source: "/articles/cultural-property-per-capita-surprise", destination: "/articles/cultural-property-four-ways-to-see-it", permanent: true },
      { source: "/articles/density-and-income-relation", destination: "/articles/population-density-correlates-income-crime-homeownership", permanent: true },
      { source: "/articles/university-per-capita-kyoto-student-city", destination: "/articles/university-count-tokyo-concentration-history", permanent: true },
      { source: "/articles/university-density-income-myth", destination: "/articles/university-count-tokyo-concentration-history", permanent: true },
      { source: "/articles/hospital-per-capita-ranking", destination: "/articles/hospital-count-reading-guide", permanent: true },
      { source: "/articles/electricity-household-sector-more-precise-view", destination: "/articles/electricity-per-capita-lifestyle-clues", permanent: true },
      { source: "/articles/manufacturing-per-capita-powerhouse", destination: "/articles/manufacturing-three-ways-tokyo-aichi-yamaguchi", permanent: true },
      { source: "/articles/shipment-per-factory-scale-yamaguchi-vs-tokyo", destination: "/articles/manufacturing-three-ways-tokyo-aichi-yamaguchi", permanent: true },
      { source: "/articles/convenience-store-income-correlation-not-area", destination: "/articles/convenience-store-tokyo-vs-tottori-28-times", permanent: true }
    ];
  },
  // /api/[dataset] はリクエスト時に data/normalized/*.json を読むため、
  // Vercelのサーバーレス関数バンドルに含める必要がある。
  // (動的パス `data/normalized/${id}.json` は自動トレースされないため明示指定)
  outputFileTracingIncludes: {
    "/api/[dataset]": ["./data/normalized/**"]
  }
};

export default nextConfig;
