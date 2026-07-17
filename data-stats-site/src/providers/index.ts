import { Provider } from "./types";
import { estatPopulationProvider } from "./estat/population";
import { manualHospitalProvider } from "./manual/hospital";
import { manualIncomeProvider } from "./manual/income";

export const PROVIDERS: Record<string, Provider> = {
  "estat-population": estatPopulationProvider,
  "manual-hospital": manualHospitalProvider,
  "manual-income": manualIncomeProvider
};
