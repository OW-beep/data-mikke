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
  観光文化: "#b8860b", // dark goldenrod
  総合: "#c9302c", // strong red (総合力スコアを目立たせる)
  教育: "#3a7d7d", // teal-adjacent
  交通: "#4a6fa5", // road blue
  環境: "#3f8f5f", // forest green
  健康: "#d6604d", // warm red
  気候: "#e8a33d" // sunny orange
};

const FALLBACK_COLOR = "#0f8c6c";

export function getCategoryColor(category: string): string {
  return CATEGORY_COLORS[category] ?? FALLBACK_COLOR;
}

const CATEGORY_EMOJI: Record<string, string> = {
  人口: "👨‍👩‍👧",
  医療: "🏥",
  経済: "💰",
  住宅: "🏠",
  エネルギー: "⚡",
  工業: "🏭",
  農林水産: "🌾",
  国土: "🗾",
  治安: "🚓",
  観光文化: "🏯",
  総合: "⭐",
  教育: "🏫",
  交通: "🚃",
  環境: "🌱",
  健康: "❤️",
  気候: "☀️"
};

export function getCategoryEmoji(category: string): string {
  return CATEGORY_EMOJI[category] ?? "📊";
}
