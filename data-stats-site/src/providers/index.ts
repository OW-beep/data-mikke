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
import { computedDensityProvider } from "./computed/density";
import { computedHospitalPerCapitaProvider } from "./computed/hospitalPerCapita";
import { computedCulturalPropertyPerCapitaProvider } from "./computed/culturalPropertyPerCapita";

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
  "computed-density": computedDensityProvider,
  "computed-hospital-per-capita": computedHospitalPerCapitaProvider,
  "computed-cultural-property-per-capita": computedCulturalPropertyPerCapitaProvider
};
