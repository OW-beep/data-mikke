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
  culturalPropertyPerCapita
};

export const DATASET_LIST: DatasetConfig[] = Object.values(DATASETS);

export function getDataset(id: string): DatasetConfig | undefined {
  return DATASETS[id];
}
