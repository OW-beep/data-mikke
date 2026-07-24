import { DatasetConfig } from "@/types/data";

export const park: DatasetConfig = {
  id: "park",
  title: "都市公園面積（人口1人当たり）",
  category: "環境",
  unit: "m²/人",
  source: "国土交通省都市局「都市公園データベース」",
  frequency: "年1回",
  chart: "bar",
  ranking: true,
  compare: true,
  providerId: "manual-park",
  description: "都道府県別の、住民1人当たりの都市公園面積。緑地・レクリエーション空間の充実度を示す代表的な指標。",
  seo: {
    dashboardTitle: "都市公園面積ランキング｜都道府県別の緑の豊かさ",
    dashboardDescription: "住民1人当たりの都市公園面積で見る、都道府県別の緑地・公園の充実度ランキング。北海道が圧倒的な広さを誇ります。",
    rankingTitle: "公園が広い都道府県ランキング（人口1人当たり都市公園面積）",
    rankingDescription: "都道府県別の1人当たり都市公園面積ランキング。東京都・神奈川県・大阪府が下位という意外な結果です。"
  }
};
