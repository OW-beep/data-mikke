import { Provider } from "./types";
import { estatPopulationProvider } from "./estat/population";
import { manualHospitalProvider } from "./manual/hospital";

export const PROVIDERS: Record<string, Provider> = {
  "estat-population": estatPopulationProvider,
  "manual-hospital": manualHospitalProvider
};
