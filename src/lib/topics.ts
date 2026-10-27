import { ARTICLE_LIST, getArticle } from "@/articles";
import type { Article } from "@/articles/types";

/**
 * テーマ別ガイド（ハブ）の定義。記事はスラッグで指定する。
 * 記事を増やしたら、該当するテーマにスラッグを足すだけで、ハブ・記事末尾の導線・サイトマップに反映される。
 * 存在しないスラッグや、検索対象外（noindex）の記事は、表示側で自動的に除外される。
 */
export type Topic = {
  slug: string; // /topics/[slug]
  title: string;
  short: string; // カード用の短い説明
  lead: string; // ハブ冒頭の説明
  slugs: string[];
};

export const TOPICS: Topic[] = [
  {
    slug: "population",
    title: "人口・社会",
    short: "人口密度・高齢化・出生率・離婚・治安",
    lead: "人口や人口密度、高齢化率、出生率、離婚率、犯罪発生率など、都道府県の「人」にまつわる数字を集めたテーマです。人口の大小だけでなく、割合や密度に直して読むと、地域の姿が変わって見えます。",
    slugs: [
      "population-ranking-how-to-read",
      "population-density-ranking-all-47-prefectures-2020",
      "population-density-meaning",
      "population-density-correlates-income-crime-homeownership",
      "aging-ratio-top-prefectures",
      "birthrate-smallest-gap-okinawa-tokyo",
      "divorce-rate-regional-gap",
      "homeownership-rate-gap",
      "crime-rate-urban-rural-gap",
      "population-does-not-equal-convenience-per-capita-lesson"
    ]
  },
  {
    slug: "money",
    title: "所得・賃金・お金",
    short: "県民所得・平均年収・最低賃金・貯蓄",
    lead: "県民所得と平均年収の違い、最低賃金、貯蓄額など、お金にまつわる地域差のテーマです。似た言葉でも統計上の定義が異なるため、何を測った数字なのかを確かめながら読みます。",
    slugs: [
      "income-ranking-caution",
      "salary-vs-income-nara-commuter-effect",
      "kinki-salary-income-comparison-nara-osaka-shiga",
      "savings-income-gap-aichi-beats-tokyo",
      "minimum-wage-real-value-ranking",
      "minimum-wage-urbanization-axis-salary-rent-car",
      "agriculture-fisheries-income-stereotype-busted"
    ]
  },
  {
    slug: "food-prices",
    title: "食品・外食の価格",
    short: "米・肉・パン・卵・牛乳・ラーメン・コーヒー",
    lead: "米や肉、パン、卵、牛乳、外食のラーメンやコーヒーなど、身近な食品の価格の地域差を集めたテーマです。調査店舗の範囲や単位に注意しながら、県ごとの違いを見ます。",
    slugs: [
      "food-price-hike-september-2026-cost-index-gap",
      "rice-price-producing-region-gap",
      "rice-price-reversal-2026-oversupply",
      "beef-pork-price-ranking-okinawa-miyazaki-fukui",
      "bread-egg-milk-price-okinawa-akita",
      "ramen-price-ranking-okinawa-highest-miyagi-lowest",
      "coffee-price-ranking-miyazaki-highest-kagawa-lowest",
      "vegetable-price-and-intake"
    ]
  },
  {
    slug: "living-costs",
    title: "家賃・光熱費・移動",
    short: "家賃・電気・ガス・ガソリン・自動車",
    lead: "家賃、電気代、ガス代、ガソリン価格、自動車の保有など、暮らしの固定費にまつわる地域差のテーマです。料金が県ではなく事業者の区域で決まる場合など、数字の背景も確認します。",
    slugs: [
      "rent-affordability-regression-residual-ranking",
      "rent-vs-car-ownership",
      "electricity-bill-by-utility-company-not-prefecture",
      "electricity-bill-annual-gap-hokkaido-kansai",
      "electricity-per-capita-lifestyle-clues",
      "gas-bill-income-regressive",
      "gasoline-price-ranking-2026-tax-cut",
      "car-ownership-tokyo-lowest-rural-highest",
      "suit-dry-cleaning-price-niigata-kumamoto",
      "barber-fee-ranking-kagawa-highest-okinawa-lowest",
      "water-bill-ranking-nagasaki-highest-aichi-lowest"
    ]
  },
  {
    slug: "health",
    title: "健康・医療",
    short: "医師・病院・平均寿命・生活習慣",
    lead: "医師数や病院数、平均寿命、食塩・歩数などの生活習慣を扱うテーマです。都道府県の平均値どうしの関係は、個人の健康への影響を示すものではないことに注意して読みます。",
    slugs: [
      "life-expectancy-more-doctors-does-not-mean-longer-life",
      "lifestyle-vs-life-expectancy-no-strong-link",
      "income-life-expectancy-weak-correlation-shiga-nara",
      "doctor-count-west-high-east-low-mystery",
      "nurse-count-income-inverse-relationship",
      "hospital-count-reading-guide",
      "salt-intake-tohoku-concentration",
      "steps-income-urbanization-link",
      "health-score-explained"
    ]
  },
  {
    slug: "industry",
    title: "産業・農業・ものづくり",
    short: "製造業・農業・漁業・酪農・伝統工芸",
    lead: "製造業、米や生乳などの農業、漁業、伝統的工芸品など、地域の産業にまつわるテーマです。総量と、人口や面積あたりの値で、順位が入れ替わることに注目します。",
    slugs: [
      "manufacturing-three-ways-tokyo-aichi-yamaguchi",
      "milk-production-hokkaido-half-of-japan",
      "rice-per-capita-akita-hidden-number-one",
      "fish-catch-rice-harvest-coastal-overlap",
      "traditional-crafts-tokyo-niigata-kyoto",
      "rural-infrastructure-area-correlation-onsen-michinoeki-craft"
    ]
  },
  {
    slug: "culture-facilities",
    title: "観光・文化・暮らしの施設",
    short: "文化財・温泉・道の駅・喫茶店・図書館・大学",
    lead: "文化財、温泉、道の駅、喫茶店、図書館、大学、コンビニ、公園、給食施設など、暮らしや観光に関わる施設の数を扱うテーマです。数は人口や面積に左右されるため、割り算した値もあわせて見ます。",
    slugs: [
      "cultural-property-four-ways-to-see-it",
      "onsen-count-hokkaido-nagano-niigata",
      "onsen-fewest-prefectures-okinawa-tottori-osaka",
      "michinoeki-hokkaido-vs-tokyo-one-station",
      "cafe-count-nagano-hidden-kingdom",
      "park-area-tokyo-last-hokkaido-first",
      "library-count-access-and-per-capita-trap",
      "university-count-tokyo-concentration-history",
      "convenience-store-tokyo-vs-tottori-28-times",
      "school-lunch-facility-count-tokyo-vs-tottori"
    ]
  },
  {
    slug: "climate-geography",
    title: "気候・自然・地理",
    short: "気温・日照・森林率・面積",
    lead: "気温、日照時間、森林率、面積など、地域の自然条件にまつわるテーマです。気候と暮らしの指標の関係を、相関と外れ値の確認とあわせて見ます。",
    slugs: [
      "temperature-okinawa-hokkaido-gap-13-degrees",
      "temperature-salt-park-homeownership-correlation",
      "sunshine-hours-saitama-top-okinawa-low",
      "forest-rate-kochi-vs-osaka",
      "area-hokkaido-44-times-kagawa"
    ]
  },
  {
    slug: "reading-data",
    title: "データの読み方・分析",
    short: "比較の注意点・相関・総合スコア",
    lead: "都道府県のデータを正しく比べるための考え方と、相関・総合スコア・クラスター分析など、当サイトの分析方法をまとめたテーマです。ランキングを読む前に、まずこちらをご覧ください。",
    slugs: [
      "how-to-compare-prefecture-data",
      "correlation-not-found-is-also-a-discovery",
      "spurious-correlation-library-university-population",
      "prefecture-livability-ranking-five-metrics",
      "prefecture-composite-score-explained",
      "prefecture-archetypes-pca-clustering-analysis",
      "prefecture-nearest-neighbor-statistical-twin",
      "lesson-to-my-past-self-just-ship-it"
    ]
  }
];

/** テーマに載せる記事（存在し、検索対象のもの）を、定義の順で返す */
export function getTopicArticles(topic: Topic): Article[] {
  return topic.slugs
    .map((s) => getArticle(s))
    .filter((a): a is Article => !!a && !a.noindex);
}

/** 記事が属する最初のテーマを返す */
export function findTopicForArticle(slug: string): Topic | undefined {
  return TOPICS.find((t) => t.slugs.includes(slug));
}

/** どのテーマにも属さない、検索対象の記事（サイトマップの「その他」用） */
export function getUncategorizedArticles(): Article[] {
  const used = new Set(TOPICS.flatMap((t) => t.slugs));
  return ARTICLE_LIST.filter((a) => !a.noindex && !used.has(a.slug));
}
