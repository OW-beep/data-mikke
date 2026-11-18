/**
 * 都道府県の「強み」算出ロジック。
 *
 * 当サイトがすでに持っている data/normalized/*.json（オープンデータの正規化済みデータ）
 * だけを使い、外部データを新たに取得しません。実行時のフェッチもありません。
 *
 * 考え方：
 * - 対象は「順位の意味がはっきりした指標」だけに限定する。
 * - 値が高いほど強みになる指標（人口・面積・森林率・温泉地の数・平均寿命など）と、
 *   値が低いほど強みになる指標（生活費指数・家賃・電気代など＝「安さ」）を分ける。
 * - 離婚率・犯罪発生件数・喫煙率・交通事故死者数・高齢化率・BMI・食塩摂取量など、
 *   「1位」を強みとして掲げるのが不適切・曖昧な指標は対象外にする。
 *   （離婚率が低い＝強み、とは言い切れないため。犯罪が少ない県も「治安の良さ」として
 *   扱うには出典の定義と向き合う必要があり、今回は見送る）
 * - 各県の「最も順位が高い指標」を強みとして表示する。全国1位でなくても、
 *   その県で最も高い順位であることを順位つきで正直に示す。
 */
import { DATASET_LIST } from "@/datasets";
import { loadDataset, latestByArea } from "@/lib/loadData";
import { PREFECTURES, type Prefecture } from "@/lib/prefectures";

/** 値が高いほど強みになる指標（全国1位＝最も多い・高い・長い） */
export const HIGHER_IS_BETTER: string[] = [
  "population", // 人口
  "area", // 面積
  "forest", // 森林率
  "onsen", // 温泉地の数
  "culturalProperty", // 国宝・重要文化財数
  "culturalPropertyBuilding", // 国宝・重文の建造物数
  "culturalPropertyPerArea", // 面積あたり国宝・重要文化財数
  "culturalPropertyPerCapita", // 人口10万人あたり国宝・重要文化財数
  "sunshine", // 年間日照時間
  "income", // 県民所得
  "salary", // 平均年収
  "savings", // 貯蓄現在高
  "minimumWage", // 最低賃金
  "doctor", // 人口10万人あたり医師数
  "nurse", // 人口10万人あたり看護師数
  "hospital", // 病院数
  "hospitalPerCapita", // 人口10万人あたり病院数
  "library", // 図書館数
  "university", // 大学数
  "universityPerCapita", // 人口10万人あたり大学数
  "convenience", // コンビニエンスストアの店舗数
  "cafe", // 喫茶店の軒数
  "cafePerCapita", // 人口10万人あたり喫茶店の軒数
  "michinoeki", // 道の駅の数
  "park", // 都市公園面積（人口1人当たり）
  "fish", // 海面漁業漁獲量
  "rice", // 米（水稲）の収穫量
  "ricePerCapita", // 1人あたり米収穫量
  "milk", // 生乳生産量
  "manufacturing", // 製造品出荷額等
  "manufacturingPerCapita", // 1人あたり製造品出荷額
  "factory", // 製造業事業所数
  "shipmentPerFactory", // 1事業所あたり製造品出荷額
  "craft", // 伝統的工芸品の指定数
  "childrenRatio", // 年少人口割合
  "birthrate", // 合計特殊出生率
  "lifeExpectancyMale", // 平均寿命（男性）
  "lifeExpectancyFemale", // 平均寿命（女性）
  "homeownership", // 持ち家比率
  "steps", // 歩数
  "vegetableIntake", // 野菜摂取量
  "schoolLunch", // 給食施設数
  "healthScore", // 都道府県 健康スコア（当サイト独自の合成スコア）
  "livability", // 都道府県 総合力スコア（当サイト独自の合成スコア）
];

/** 値が低いほど強みになる指標（全国1位＝最も安い）。「安さの強み」として表示する */
export const LOWER_IS_BETTER: string[] = [
  "costIndex", // 生活費指数（物価水準）
  "rent", // 家賃
  "electricityBill", // 電気代
  "gasBill", // 都市ガス代
  "waterBill", // 水道料
  "gasoline", // ガソリン
];

export interface StrengthEntry {
  datasetId: string;
  title: string;
  unit: string;
  source: string;
  value: number;
  year: number;
  /** 全国順位（1が最良）。direction が high なら値が高い順、low なら値が安い順 */
  rank: number;
  direction: "high" | "low";
}

export interface PrefectureStrength {
  prefecture: Prefecture;
  /** その県で最も順位が高い指標 */
  best: StrengthEntry;
  /** 対象指標のうち全国1位になっている指標の数 */
  no1Count: number;
  /** 全国1位の指標名（最大3件まで） */
  no1Titles: string[];
}

export async function computePrefectureStrengths(): Promise<PrefectureStrength[]> {
  const datasetById = new Map(DATASET_LIST.map((d) => [d.id, d]));
  const targetIds = [...HIGHER_IS_BETTER, ...LOWER_IS_BETTER].filter((id) =>
    datasetById.has(id)
  );

  // 県コード → その県の全対象指標の順位一覧
  const perPref = new Map<string, StrengthEntry[]>();

  for (const id of targetIds) {
    const dataset = datasetById.get(id)!;
    const direction: "high" | "low" = LOWER_IS_BETTER.includes(id) ? "low" : "high";
    const latest = latestByArea(await loadDataset(id));
    if (latest.length === 0) continue;
    const sorted = [...latest].sort((a, b) =>
      direction === "high" ? b.value - a.value : a.value - b.value
    );
    sorted.forEach((p, i) => {
      const entry: StrengthEntry = {
        datasetId: id,
        title: dataset.title,
        unit: dataset.unit,
        source: dataset.source,
        value: p.value,
        year: p.year,
        rank: i + 1,
        direction,
      };
      const list = perPref.get(p.areaCode) ?? [];
      list.push(entry);
      perPref.set(p.areaCode, list);
    });
  }

  return PREFECTURES.map((prefecture) => {
    const entries = perPref.get(prefecture.code) ?? [];
    // 最も順位が高い指標。順位が同じなら「高い方が強み」の指標を優先し、次に指標名順。
    const sorted = [...entries].sort(
      (a, b) =>
        a.rank - b.rank ||
        (a.direction === b.direction ? 0 : a.direction === "high" ? -1 : 1) ||
        a.title.localeCompare(b.title, "ja")
    );
    const best = sorted[0];
    const no1 = entries.filter((e) => e.rank === 1);
    return {
      prefecture,
      best,
      no1Count: no1.length,
      no1Titles: no1.map((e) => e.title).slice(0, 3),
    };
  }).filter((s): s is PrefectureStrength => s.best !== undefined);
}
