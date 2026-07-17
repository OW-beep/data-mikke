import { DataPoint } from "@/types/data";

/**
 * Providerの責務は「取得 → 共通形式へ変換 → 終了」だけ。
 * 画面側（Dashboard/Ranking/Compare）はProviderの存在を一切知らない。
 */
export interface Provider {
  id: string; // datasets/*.ts の providerId と対応させる
  datasetId: string;
  fetch(): Promise<DataPoint[]>;
}
