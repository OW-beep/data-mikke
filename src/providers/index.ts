import { Provider } from "./types";
import { estatPopulationProvider } from "./estat/population";
import { estatBirthrateProvider } from "./estat/birthrate";
import { estatDivorceProvider } from "./estat/divorce";
import { estatChildrenRatioProvider } from "./estat/childrenRatio";
import { estatAgingRatioProvider } from "./estat/agingRatio";
import { manualHospitalProvider } from "./manual/hospital";
import { manualIncomeProvider } from "./manual/income";
import { manualAreaProvider } from "./manual/area";
import { manualHomeownershipProvider } from "./manual/homeownership";
import { manualMilkProvider } from "./manual/milk";
import { manualElectricityProvider } from "./manual/electricity";
import { manualManufacturingProvider } from "./manual/manufacturing";
import { manualCrimeProvider } from "./manual/crime";
import { manualCulturalPropertyProvider } from "./manual/culturalProperty";
import { manualLibraryProvider } from "./manual/library";
import { manualUniversityProvider } from "./manual/university";
import { manualCulturalPropertyBuildingProvider } from "./manual/culturalPropertyBuilding";
import { manualElectricityHouseholdProvider } from "./manual/electricityHousehold";
import { manualSchoolLunchProvider } from "./manual/schoolLunch";
import { manualCafeProvider } from "./manual/cafe";
import { manualCarProvider } from "./manual/car";
import { manualParkProvider } from "./manual/park";
import { manualDoctorProvider } from "./manual/doctor";
import { manualTrafficAccidentProvider } from "./manual/trafficAccident";
import { manualRiceProvider } from "./manual/rice";
import { manualFactoryProvider } from "./manual/factory";
import { computedDensityProvider } from "./computed/density";
import { computedHospitalPerCapitaProvider } from "./computed/hospitalPerCapita";
import { computedCulturalPropertyPerCapitaProvider } from "./computed/culturalPropertyPerCapita";
import { computedLivabilityProvider } from "./computed/livability";
import { computedManufacturingPerCapitaProvider } from "./computed/manufacturingPerCapita";
import { computedRicePerCapitaProvider } from "./computed/ricePerCapita";
import { computedShipmentPerFactoryProvider } from "./computed/shipmentPerFactory";
import { computedElectricityPerCapitaProvider } from "./computed/electricityPerCapita";
import { computedCulturalPropertyPerAreaProvider } from "./computed/culturalPropertyPerArea";
import { computedUniversityPerCapitaProvider } from "./computed/universityPerCapita";
import { computedCafePerCapitaProvider } from "./computed/cafePerCapita";

export const PROVIDERS: Record<string, Provider> = {
  "estat-population": estatPopulationProvider,
  "estat-birthrate": estatBirthrateProvider,
  "estat-divorce": estatDivorceProvider,
  "estat-children-ratio": estatChildrenRatioProvider,
  "estat-aging-ratio": estatAgingRatioProvider,
  "manual-hospital": manualHospitalProvider,
  "manual-income": manualIncomeProvider,
  "manual-area": manualAreaProvider,
  "manual-homeownership": manualHomeownershipProvider,
  "manual-milk": manualMilkProvider,
  "manual-electricity": manualElectricityProvider,
  "manual-manufacturing": manualManufacturingProvider,
  "manual-crime": manualCrimeProvider,
  "manual-cultural-property": manualCulturalPropertyProvider,
  "manual-library": manualLibraryProvider,
  "manual-university": manualUniversityProvider,
  "manual-cultural-property-building": manualCulturalPropertyBuildingProvider,
  "manual-electricity-household": manualElectricityHouseholdProvider,
  "manual-school-lunch": manualSchoolLunchProvider,
  "manual-cafe": manualCafeProvider,
  "manual-car": manualCarProvider,
  "manual-park": manualParkProvider,
  "manual-doctor": manualDoctorProvider,
  "manual-traffic-accident": manualTrafficAccidentProvider,
  "manual-rice": manualRiceProvider,
  "manual-factory": manualFactoryProvider,
  "computed-density": computedDensityProvider,
  "computed-hospital-per-capita": computedHospitalPerCapitaProvider,
  "computed-cultural-property-per-capita": computedCulturalPropertyPerCapitaProvider,
  "computed-livability": computedLivabilityProvider,
  "computed-manufacturing-per-capita": computedManufacturingPerCapitaProvider,
  "computed-rice-per-capita": computedRicePerCapitaProvider,
  "computed-shipment-per-factory": computedShipmentPerFactoryProvider,
  "computed-electricity-per-capita": computedElectricityPerCapitaProvider,
  "computed-cultural-property-per-area": computedCulturalPropertyPerAreaProvider,
  "computed-university-per-capita": computedUniversityPerCapitaProvider,
  "computed-cafe-per-capita": computedCafePerCapitaProvider
};
