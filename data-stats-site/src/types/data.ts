/**
 * サイト全体で使う「共通データ形式」
 * 人口でも失業率でも医師数でも、必ずこの形に変換してから使う。
 */
export interface DataPoint {
  dataset: string; // 例: "population"
  areaCode: string; // JIS都道府県コード "01"〜"47"（全国は "00"）
  areaName: string; // 例: "東京都"
  year: number; // 例: 2025
  value: number; // 例: 14059237
}

/**
 * dataset定義。この設定1つで Dashboard / Ranking / Compare / 記事 が自動生成される。
 */
export interface DatasetConfig {
  id: string; // "population" など。URLにも使われる
  title: string; // 表示名 "人口"
  category: string; // "人口" / "経済" / "医療" など
  unit: string; // "人" / "円" / "%"
  source: string; // "e-Stat" / "気象庁" など出典表示
  frequency: string; // "年1回" など
  chart: "line" | "bar";
  ranking: boolean; // ランキングページを生成するか
  compare: boolean; // 比較ページで選べるか
  providerId: string; // このdatasetのデータを取得するProviderのid
  description?: string;
}
