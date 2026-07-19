/**
 * カテゴリごとのアクセントカラー。トップページのカード等で使い、
 * カテゴリが増えても一目で区別できるようにする。
 */
const CATEGORY_COLORS: Record<string, string> = {
  人口: "#0f8c6c", // teal
  医療: "#e4572e", // coral
  経済: "#c98a1e", // gold
  住宅: "#6a5acd", // slate blue
  エネルギー: "#d1495b", // rose
  工業: "#2b6ca3", // steel blue
  農林水産: "#5b8c3a", // olive green
  国土: "#8a6d3b", // brown
  治安: "#8b3a62", // wine
  観光文化: "#b8860b" // dark goldenrod
};

const FALLBACK_COLOR = "#0f8c6c";

export function getCategoryColor(category: string): string {
  return CATEGORY_COLORS[category] ?? FALLBACK_COLOR;
}
