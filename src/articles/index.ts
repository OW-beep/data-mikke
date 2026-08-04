import { Article } from "./types";
import { populationRankingHowToRead } from "./population-ranking-how-to-read";
import { howToComparePrefectureData } from "./how-to-compare-prefecture-data";
import { incomeRankingCaution } from "./income-ranking-caution";
import { hospitalCountReadingGuide } from "./hospital-count-reading-guide";
import { divorceRateRegionalGap } from "./divorce-rate-regional-gap";
import { populationDensityMeaning } from "./population-density-meaning";
import { densityIncomeRelation } from "./density-and-income-relation";
import { hospitalPerCapitaRanking } from "./hospital-per-capita-ranking";
import { homeownershipRateGap } from "./homeownership-rate-gap";
import { childrenRatioAndFuture } from "./children-ratio-and-regional-future";
import { agingRatioTopPrefectures } from "./aging-ratio-top-prefectures";
import { prefectureCompositeScoreExplained } from "./prefecture-composite-score-explained";
import { crimeRateUrbanGap } from "./crime-rate-urban-rural-gap";
import { culturalPropertyKansaiConcentration } from "./cultural-property-kansai-concentration";
import { culturalPropertyPerCapitaSurprise } from "./cultural-property-per-capita-surprise";
import { livabilityRankingFiveMetrics } from "./prefecture-livability-ranking-five-metrics";
import { manufacturingPerCapitaPowerhouse } from "./manufacturing-per-capita-powerhouse";
import { libraryAccessGap } from "./library-count-access-and-per-capita-trap";
import { electricityPerCapitaLifestyle } from "./electricity-per-capita-lifestyle-clues";
import { culturalPropertyDensityByArea } from "./cultural-property-density-by-area";
import { universityTokyoConcentration } from "./university-count-tokyo-concentration-history";
import { universityPerCapitaKyotoTop } from "./university-per-capita-kyoto-student-city";
import { culturalPropertyBuildingKyotoNara } from "./cultural-property-building-kyoto-nara-temples";
import { electricityHouseholdSectorPrecision } from "./electricity-household-sector-more-precise-view";
import { spuriousCorrelationLibraryUniversity } from "./spurious-correlation-library-university-population";
import { densityCorrelatesEverything } from "./population-density-correlates-income-crime-homeownership";
import { coefficientOfVariationDisparityRanking } from "./coefficient-of-variation-regional-disparity-ranking";
import { cafeNaganoKingdom } from "./cafe-count-nagano-hidden-kingdom";
import { carOwnershipTokyoLowest } from "./car-ownership-tokyo-lowest-rural-highest";
import { parkAreaTokyoLast } from "./park-area-tokyo-last-hokkaido-first";
import { carTrafficAccidentCorrelation } from "./car-ownership-traffic-accident-correlation";
import { doctorCountWestHighEastLow } from "./doctor-count-west-high-east-low-mystery";
import { riceAkitaHiddenNumberOne } from "./rice-per-capita-akita-hidden-number-one";
import { shipmentPerFactoryScaleDifference } from "./shipment-per-factory-scale-yamaguchi-vs-tokyo";
import { savingsIncomeGapAichiVsTokyo } from "./savings-income-gap-aichi-beats-tokyo";
import { nurseCountIncomeInverse } from "./nurse-count-income-inverse-relationship";
import { fishRiceCoastalOverlap } from "./fish-catch-rice-harvest-coastal-overlap";
import { lifeExpectancyDoctorMyth } from "./life-expectancy-more-doctors-does-not-mean-longer-life";
import { salaryVsIncomeNaraCommuter } from "./salary-vs-income-nara-commuter-effect";
import { temperatureOkinawaHokkaidoGap } from "./temperature-okinawa-hokkaido-gap-13-degrees";
import { universityDensityIncomeMyth } from "./university-density-income-myth";
import { agricultureFisheriesIncomeStereotype } from "./agriculture-fisheries-income-stereotype-busted";
import { rentDensityIncomeTradeoff } from "./rent-density-income-tradeoff-tokyo-premium";
import { forestRateKochiVsOsaka } from "./forest-rate-kochi-vs-osaka";
import { sunshineHoursSaitamaTopOkinawaLow } from "./sunshine-hours-saitama-top-okinawa-low";
import { areaHokkaido44TimesKagawa } from "./area-hokkaido-44-times-kagawa";
import { milkProductionHokkaidoHalfOfJapan } from "./milk-production-hokkaido-half-of-japan";
import { lifeExpectancyGenderGapOkinawaVsAichi } from "./life-expectancy-gender-gap-okinawa-vs-aichi";
import { schoolLunchFacilityCountTokyoVsTottori } from "./school-lunch-facility-count-tokyo-vs-tottori";
import { forestRateCrimeRateCorrelation } from "./forest-rate-crime-rate-correlation";

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
  divorceRateRegionalGap,
  populationDensityMeaning,
  densityIncomeRelation,
  hospitalPerCapitaRanking,
  homeownershipRateGap,
  childrenRatioAndFuture,
  agingRatioTopPrefectures,
  prefectureCompositeScoreExplained,
  crimeRateUrbanGap,
  culturalPropertyKansaiConcentration,
  culturalPropertyPerCapitaSurprise,
  livabilityRankingFiveMetrics,
  manufacturingPerCapitaPowerhouse,
  libraryAccessGap,
  electricityPerCapitaLifestyle,
  culturalPropertyDensityByArea,
  universityTokyoConcentration,
  universityPerCapitaKyotoTop,
  culturalPropertyBuildingKyotoNara,
  electricityHouseholdSectorPrecision,
  spuriousCorrelationLibraryUniversity,
  densityCorrelatesEverything,
  coefficientOfVariationDisparityRanking,
  cafeNaganoKingdom,
  carOwnershipTokyoLowest,
  parkAreaTokyoLast,
  carTrafficAccidentCorrelation,
  doctorCountWestHighEastLow,
  riceAkitaHiddenNumberOne,
  shipmentPerFactoryScaleDifference,
  savingsIncomeGapAichiVsTokyo,
  nurseCountIncomeInverse,
  fishRiceCoastalOverlap,
  lifeExpectancyDoctorMyth,
  salaryVsIncomeNaraCommuter,
  temperatureOkinawaHokkaidoGap,
  universityDensityIncomeMyth,
  agricultureFisheriesIncomeStereotype,
  rentDensityIncomeTradeoff,
  forestRateKochiVsOsaka,
  sunshineHoursSaitamaTopOkinawaLow,
  areaHokkaido44TimesKagawa,
  milkProductionHokkaidoHalfOfJapan,
  lifeExpectancyGenderGapOkinawaVsAichi,
  schoolLunchFacilityCountTokyoVsTottori,
  forestRateCrimeRateCorrelation
].sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));

export function getArticle(slug: string): Article | undefined {
  return ARTICLE_LIST.find((a) => a.slug === slug);
}
