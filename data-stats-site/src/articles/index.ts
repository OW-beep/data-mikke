import { Article } from "./types";
import { populationRankingHowToRead } from "./population-ranking-how-to-read";
import { howToComparePrefectureData } from "./how-to-compare-prefecture-data";
import { incomeRankingCaution } from "./income-ranking-caution";
import { hospitalCountReadingGuide } from "./hospital-count-reading-guide";
import { divorceRateRegionalGap } from "./divorce-rate-regional-gap";

/**
 * ★記事追加手順★
 * 1. src/articles/ 配下にファイルを追加（既存ファイルをコピーして書き換えるのが早い）
 * 2. ここに import して ARTICLE_LIST に追加
 * → /articles 一覧・/articles/{slug}・sitemap.xml に自動的に反映される
 */
export const ARTICLE_LIST: Article[] = [
  populationRankingHowToRead,
  howToComparePrefectureData,
  incomeRankingCaution,
  hospitalCountReadingGuide,
  divorceRateRegionalGap
].sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));

export function getArticle(slug: string): Article | undefined {
  return ARTICLE_LIST.find((a) => a.slug === slug);
}
