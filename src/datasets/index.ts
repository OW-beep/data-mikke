import { DatasetConfig } from "@/types/data";
import { population } from "./population";
import { hospital } from "./hospital";
import { income } from "./income";
import { birthrate } from "./birthrate";
import { area } from "./area";
import { divorce } from "./divorce";
import { density } from "./density";
import { hospitalPerCapita } from "./hospitalPerCapita";
import { homeownership } from "./homeownership";
import { childrenRatio } from "./childrenRatio";
import { agingRatio } from "./agingRatio";
import { milk } from "./milk";
import { electricity } from "./electricity";
import { manufacturing } from "./manufacturing";
import { crime } from "./crime";
import { culturalProperty } from "./culturalProperty";
import { culturalPropertyPerCapita } from "./culturalPropertyPerCapita";
import { livability } from "./livability";
import { manufacturingPerCapita } from "./manufacturingPerCapita";
import { library } from "./library";
import { electricityPerCapita } from "./electricityPerCapita";
import { culturalPropertyPerArea } from "./culturalPropertyPerArea";
import { university } from "./university";
import { universityPerCapita } from "./universityPerCapita";
import { culturalPropertyBuilding } from "./culturalPropertyBuilding";
import { electricityHousehold } from "./electricityHousehold";
import { schoolLunch } from "./schoolLunch";
import { cafe } from "./cafe";
import { cafePerCapita } from "./cafePerCapita";
import { car } from "./car";
import { park } from "./park";
import { doctor } from "./doctor";
import { trafficAccident } from "./trafficAccident";

/**
 * ★データ追加手順★
 * 1. src/providers/ 配下にProviderを追加
 * 2. src/datasets/ 配下にDatasetConfigを追加
 * 3. ここに登録
 * → Dashboard / Ranking / Compare / Prefecture / API / 記事 が自動的に増える
 */
export const DATASETS: Record<string, DatasetConfig> = {
  population,
  hospital,
  income,
  birthrate,
  area,
  divorce,
  density,
  hospitalPerCapita,
  homeownership,
  childrenRatio,
  agingRatio,
  milk,
  electricity,
  manufacturing,
  crime,
  culturalProperty,
  culturalPropertyPerCapita,
  livability,
  manufacturingPerCapita,
  library,
  electricityPerCapita,
  culturalPropertyPerArea,
  university,
  universityPerCapita,
  culturalPropertyBuilding,
  electricityHousehold,
  schoolLunch,
  cafe,
  cafePerCapita,
  car,
  park,
  doctor,
  trafficAccident
};

export const DATASET_LIST: DatasetConfig[] = Object.values(DATASETS);

export function getDataset(id: string): DatasetConfig | undefined {
  return DATASETS[id];
}
