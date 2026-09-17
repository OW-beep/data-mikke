import { Provider } from "@/providers/types";
import { DataPoint } from "@/types/data";
import { PREFECTURES } from "@/lib/prefectures";
import { latestByArea } from "@/lib/loadData";
import { manualRentProvider } from "@/providers/manual/rent";
import { manualElectricityBillProvider } from "@/providers/manual/electricityBill";
import { manualGasBillProvider } from "@/providers/manual/gasBill";
import { manualWaterBillProvider } from "@/providers/manual/waterBill";
import { manualGasolineProvider } from "@/providers/manual/gasoline";
import { manualBarberFeeProvider } from "@/providers/manual/barberFee";
import { manualCleaningFeeProvider } from "@/providers/manual/cleaningFee";
import { manualRicePriceProvider } from "@/providers/manual/ricePrice";
import { manualBreadPriceProvider } from "@/providers/manual/breadPrice";
import { manualEggPriceProvider } from "@/providers/manual/eggPrice";
import { manualMilkPriceProvider } from "@/providers/manual/milkPrice";
import { manualOnionPriceProvider } from "@/providers/manual/onionPrice";
import { manualCabbagePriceProvider } from "@/providers/manual/cabbagePrice";
import { manualApplePriceProvider } from "@/providers/manual/applePrice";
import { manualBananaPriceProvider } from "@/providers/manual/bananaPrice";
import { manualPorkPriceProvider } from "@/providers/manual/porkPrice";
import { manualBeefPriceProvider } from "@/providers/manual/beefPrice";
import { manualRamenPriceProvider } from "@/providers/manual/ramenPrice";
import { manualCoffeePriceProvider } from "@/providers/manual/coffeePrice";

/**
 * 「生活費指数」を、47都道府県横断でランキング・比較できる独立したデータセットとして
 * 算出するProvider。computed/livability.ts、computed/healthScore.tsと同じ設計方針。
 *
 * 家賃・光熱水費・ガソリン・理美容/クリーニング・主要食料品の19品目について、
 * 小売物価統計調査の都道府県平均価格を単純合計したもの。
 *
 * 注意: 月額の品目（家賃・電気代など）と単発の品目（米5kg・ラーメン1杯など）が
 * 混在しているため、実際の月間生活費そのものではなく、あくまで都道府県間で
 * 物価水準を比べるための「指数」として扱う。単位・重み付けの違いは
 * datasets/costIndex.ts の description と各ページの注記で明示する。
 */
const ITEM_PROVIDERS: Provider[] = [
  manualRentProvider,
  manualElectricityBillProvider,
  manualGasBillProvider,
  manualWaterBillProvider,
  manualGasolineProvider,
  manualBarberFeeProvider,
  manualCleaningFeeProvider,
  manualRicePriceProvider,
  manualBreadPriceProvider,
  manualEggPriceProvider,
  manualMilkPriceProvider,
  manualOnionPriceProvider,
  manualCabbagePriceProvider,
  manualApplePriceProvider,
  manualBananaPriceProvider,
  manualPorkPriceProvider,
  manualBeefPriceProvider,
  manualRamenPriceProvider,
  manualCoffeePriceProvider
];

export const computedCostIndexProvider: Provider = {
  id: "computed-cost-index",
  datasetId: "costIndex",

  async fetch(): Promise<DataPoint[]> {
    const perItem = await Promise.all(
      ITEM_PROVIDERS.map(async (provider) => {
        const latest = latestByArea(await provider.fetch());
        return new Map(latest.map((p) => [p.areaCode, p.value]));
      })
    );

    const year = new Date().getFullYear();
    const points: DataPoint[] = [];

    for (const pref of PREFECTURES) {
      let total = 0;
      let covered = 0;
      for (const valueByCode of perItem) {
        const value = valueByCode.get(pref.code);
        if (value === undefined) continue;
        total += value;
        covered++;
      }
      // 全品目そろっている都道府県のみを対象にする（欠損があると合計が不当に小さくなるため）
      if (covered !== ITEM_PROVIDERS.length) continue;
      points.push({
        dataset: "costIndex",
        areaCode: pref.code,
        areaName: pref.name,
        year,
        value: Math.round(total)
      });
    }

    console.log(`[computed/costIndex] ${ITEM_PROVIDERS.length}品目から${points.length}件の生活費指数を算出しました`);
    return points;
  }
};
