import { Provider } from "@/providers/types";
import { DataPoint } from "@/types/data";
import { PREFECTURES } from "@/lib/prefectures";
import { latestByArea } from "@/lib/loadData";
import { median } from "@/lib/stats";
import { HEALTH_COMPOSITE_METRICS } from "@/lib/healthComposite";
import { manualVegetableIntakeProvider } from "@/providers/manual/vegetableIntake";
import { manualSaltIntakeProvider } from "@/providers/manual/saltIntake";
import { manualStepsProvider } from "@/providers/manual/steps";
import { manualSmokingRateProvider } from "@/providers/manual/smokingRate";

/**
 * 「健康スコア」を、47都道府県横断でランキング・比較できる独立したデータセットとして
 * 算出するProvider。computed/livability.tsと同じ設計方針で、ロジック自体は
 * src/lib/healthComposite.tsのHEALTH_COMPOSITE_METRICSに一元化してある。
 *
 * 基準値には平均値ではなく中央値を使う（livabilityと同じ理由）。
 */
const PROVIDER_BY_DATASET_ID: Record<string, Provider> = {
  vegetableIntake: manualVegetableIntakeProvider,
  saltIntake: manualSaltIntakeProvider,
  steps: manualStepsProvider,
  smokingRate: manualSmokingRateProvider
};

export const computedHealthScoreProvider: Provider = {
  id: "computed-health-score",
  datasetId: "healthScore",

  async fetch(): Promise<DataPoint[]> {
    const results = await Promise.all(
      HEALTH_COMPOSITE_METRICS.map(async (metric) => {
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
      return { dataset: "healthScore", areaCode: pref.code, areaName: pref.name, year, value: score };
    });

    console.log(`[computed/healthScore] ${points.length}件の健康スコアを算出しました`);
    return points;
  }
};
