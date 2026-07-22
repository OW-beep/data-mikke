import { Provider } from "@/providers/types";
import { DataPoint } from "@/types/data";
import { PREFECTURES } from "@/lib/prefectures";
import { latestByArea } from "@/lib/loadData";
import { median } from "@/lib/stats";
import { COMPOSITE_METRICS } from "@/lib/composite";
import { manualIncomeProvider } from "@/providers/manual/income";
import { computedHospitalPerCapitaProvider } from "@/providers/computed/hospitalPerCapita";
import { manualHomeownershipProvider } from "@/providers/manual/homeownership";
import { estatChildrenRatioProvider } from "@/providers/estat/childrenRatio";
import { estatAgingRatioProvider } from "@/providers/estat/agingRatio";

/**
 * 都道府県ページに表示している「総合力スコア」を、47都道府県横断でランキング・比較できる
 * 独立したデータセットとして算出するProvider。ロジック自体はsrc/lib/composite.tsの
 * COMPOSITE_METRICSに一元化してあり、都道府県ページとこのProviderの両方から参照している。
 *
 * 基準値には平均値ではなく中央値を使う。所得や病院数のように一部の突出した都道府県
 * （東京都など）が平均を大きく引き上げる指標では、平均値を基準にすると大多数の
 * 都道府県が「平均以下」に判定されてしまい、スコアが全体的に低く出やすくなるため。
 *
 * 「都道府県 住みやすさ ランキング」といった検索需要を意識した、当サイトの二次分析の目玉。
 */
const PROVIDER_BY_DATASET_ID: Record<string, Provider> = {
  income: manualIncomeProvider,
  hospitalPerCapita: computedHospitalPerCapitaProvider,
  homeownership: manualHomeownershipProvider,
  childrenRatio: estatChildrenRatioProvider,
  agingRatio: estatAgingRatioProvider
};

export const computedLivabilityProvider: Provider = {
  id: "computed-livability",
  datasetId: "livability",

  async fetch(): Promise<DataPoint[]> {
    const results = await Promise.all(
      COMPOSITE_METRICS.map(async (metric) => {
        const provider = PROVIDER_BY_DATASET_ID[metric.datasetId];
        const points = provider ? await provider.fetch() : [];
        const latest = latestByArea(points);
        const benchmark = median(latest.map((p) => p.value));
        return { metric, valueByCode: new Map(latest.map((p) => [p.areaCode, p.value])), benchmark };
      })
    );

    const year = new Date().getFullYear();
    const points: DataPoint[] = PREFECTURES.map((pref) => {
      let score = 0;
      for (const r of results) {
        const value = r.valueByCode.get(pref.code);
        if (value === undefined || r.benchmark === null) continue;
        const favorable = r.metric.direction === "up" ? value > r.benchmark : value < r.benchmark;
        if (favorable) score++;
      }
      return { dataset: "livability", areaCode: pref.code, areaName: pref.name, year, value: score };
    });

    console.log(`[computed/livability] ${points.length}件の総合力スコアを算出しました`);
    return points;
  }
};
