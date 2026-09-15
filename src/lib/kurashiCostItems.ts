export interface CostItem {
  id: string;
  label: string;
  unit: string;
  icon: string;
  /** "catalog" の場合、data/kurashi/retailCatalog.json 由来。個別APIは持たず、ツール内だけで使う */
  kind?: "catalog";
  category?: string;
}

export const COST_ITEMS: CostItem[] = [
  { id: "rent", label: "家賃（1ヶ月・1坪あたり）", unit: "円", icon: "🏠" },
  { id: "electricityBill", label: "電気代（1ヶ月）", unit: "円/月", icon: "⚡" },
  { id: "gasBill", label: "都市ガス代（1ヶ月）", unit: "円/月", icon: "🔥" },
  { id: "waterBill", label: "水道料（1ヶ月）", unit: "円/月", icon: "🚿" },
  { id: "gasoline", label: "ガソリン（1L）", unit: "円/L", icon: "⛽" },
  { id: "barberFee", label: "理髪料", unit: "円", icon: "💈" },
  { id: "cleaningFee", label: "クリーニング代（スーツ）", unit: "円", icon: "🧺" }
];

/** データセット化されている「おすすめ」追加品目（データ一覧にも載っている） */
export const FEATURED_CATEGORY = "🍽 基本の食品（データ一覧にも掲載）";
export const EXTRA_COST_CATALOG: CostItem[] = [
  { id: "ricePrice", label: "米（うるち米・5kg）", unit: "円", icon: "🍚", category: FEATURED_CATEGORY },
  { id: "breadPrice", label: "食パン", unit: "円", icon: "🍞", category: FEATURED_CATEGORY },
  { id: "eggPrice", label: "鶏卵（1kg）", unit: "円", icon: "🥚", category: FEATURED_CATEGORY },
  { id: "milkPrice", label: "牛乳（1L）", unit: "円", icon: "🥛", category: FEATURED_CATEGORY },
  { id: "onionPrice", label: "たまねぎ（1kg）", unit: "円", icon: "🧅", category: FEATURED_CATEGORY },
  { id: "cabbagePrice", label: "キャベツ（1kg）", unit: "円", icon: "🥬", category: FEATURED_CATEGORY },
  { id: "applePrice", label: "りんご（1kg）", unit: "円", icon: "🍎", category: FEATURED_CATEGORY },
  { id: "bananaPrice", label: "バナナ（1kg）", unit: "円", icon: "🍌", category: FEATURED_CATEGORY },
  { id: "porkPrice", label: "豚肉（100g）", unit: "円", icon: "🥓", category: FEATURED_CATEGORY },
  { id: "beefPrice", label: "牛肉（100g）", unit: "円", icon: "🥩", category: FEATURED_CATEGORY },
  { id: "ramenPrice", label: "ラーメン（外食）", unit: "円", icon: "🍜", category: FEATURED_CATEGORY },
  { id: "coffeePrice", label: "コーヒー（外食）", unit: "円", icon: "☕", category: FEATURED_CATEGORY }
];

export function median(values: number[]): number | null {
  if (values.length === 0) return null;
  const sorted = [...values].sort((x, y) => x - y);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}
export function average(values: number[]): number | null {
  if (values.length === 0) return null;
  return values.reduce((s, v) => s + v, 0) / values.length;
}
