import { Provider } from "./types";
import { estatPopulationProvider } from "./estat/population";
import { estatBirthrateProvider } from "./estat/birthrate";
import { estatDivorceProvider } from "./estat/divorce";
import { manualHospitalProvider } from "./manual/hospital";
import { manualIncomeProvider } from "./manual/income";
import { manualAreaProvider } from "./manual/area";

export const PROVIDERS: Record<string, Provider> = {
  "estat-population": estatPopulationProvider,
  "estat-birthrate": estatBirthrateProvider,
  "estat-divorce": estatDivorceProvider,
  "manual-hospital": manualHospitalProvider,
  "manual-income": manualIncomeProvider,
  "manual-area": manualAreaProvider
};
