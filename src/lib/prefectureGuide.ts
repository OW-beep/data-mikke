/**
 * 都道府県ページの「引っ越し・暮らしを考える人へ」を、その県の実データから組み立てる。
 * 数字は、ページに表示している指標と同じもの（全国の中央値との比較と、値が大きい順の順位）を使う。
 * 文の骨組みは共通でも、数字と、条件による書き分けで、県ごとに内容が変わる。
 * 数字に書いていない原因や、事実でないことは書かない。
 */

export type GuideDatum = { value: number; benchmark: number; rank: number; year?: number };
export type GuideGetter = (datasetId: string) => GuideDatum | null;
export type GuideItem = {
  heading: string;
  text: string;
  links: { href: string; label: string }[];
};

const TOTAL = 47;
const num = (v: number, digits = 0) =>
  v.toLocaleString("ja-JP", { minimumFractionDigits: digits, maximumFractionDigits: digits });

function compare(value: number, benchmark: number): { word: string; pct: number; above: boolean; same: boolean } {
  if (!benchmark) return { word: "", pct: 0, above: false, same: true };
  const diff = value / benchmark - 1;
  const pct = Math.round(Math.abs(diff) * 100);
  const same = pct < 3;
  return { word: diff > 0 ? "高く" : "低く", pct, above: diff > 0, same };
}

const yr = (d: GuideDatum) => (d.year ? `（${d.year}年）` : "");

function versus(value: number, benchmark: number): string {
  const c = compare(value, benchmark);
  if (c.same) return "全国の中央値とほぼ同じ水準で";
  return `全国の中央値より約${c.pct}%${c.word}`;
}

export function buildPrefectureGuide(name: string, get: GuideGetter): GuideItem[] {
  const items: GuideItem[] = [];

  // 1. 住まいと移動
  const rent = get("rent");
  const car = get("car");
  if (rent && car) {
    const rc = compare(rent.value, rent.benchmark);
    const cc = compare(car.value, car.benchmark);
    let advice: string;
    if (!rc.same && !cc.same && !rc.above && cc.above) {
      advice =
        "家賃が低めで、車の所有が多い県です。家賃だけでなく、車の購入・維持・ガソリンなどの費用も含めて、生活費を比べてください。";
    } else if (!rc.same && !cc.same && rc.above && !cc.above) {
      advice =
        "家賃が高めで、車の所有は少なめです。車を持たない暮らしが成り立つかは地域によって違うため、候補の地域の移動手段を確認し、家賃の負担とあわせて比べてください。";
    } else if (!rc.same && !cc.same && rc.above && cc.above) {
      advice =
        "家賃も車の所有も高めです。住居費と移動費の両方が重くなりうるため、通勤の方法を先に決めてから、住む場所を確認してください。";
    } else if (!rc.same && !cc.same && !rc.above && !cc.above) {
      advice =
        "家賃も車の所有も低めです。車以外の移動手段（駅やバス）が使えるかを、候補の地域の周辺で確認してください。";
    } else {
      advice = "家賃と移動の費用は、セットで比べてください。駅からの距離や通勤の方法によって、負担は変わります。";
    }
    items.push({
      heading: "住まいと移動の費用",
      text: `${name}の家賃（1ヶ月・1坪あたり）は${num(rent.value)}円${yr(rent)}で、${versus(rent.value, rent.benchmark)}、値が大きい順で全国${rent.rank}位です。自動車の所有は1千世帯あたり${num(car.value)}台${yr(car)}で、全国${car.rank}位です。${advice}`,
      links: [{ href: "/articles/rent-vs-car-ownership", label: "家賃と車の関係" }]
    });
  }

  // 2. 光熱費
  const elec = get("electricityBill");
  if (elec) {
    const monthly = Math.round(elec.value - elec.benchmark);
    const yearly = Math.abs(monthly) * 12;
    const diffText =
      Math.abs(monthly) < 100
        ? "全国の中央値とほぼ同じです。"
        : `全国の中央値より月${num(Math.abs(monthly))}円${monthly > 0 ? "高く" : "低く"}、年間では約${num(yearly)}円の差になります。`;
    items.push({
      heading: "電気代の目安",
      text: `${name}の電気代（月）は${num(elec.value)}円${yr(elec)}で、${diffText}電気代は、県ではなく電力会社の供給エリアで決まるため、隣の県と同じ金額になることもあります。契約する電力会社と、料金プランを確認してください。`,
      links: [
        { href: "/articles/electricity-bill-by-utility-company-not-prefecture", label: "電気代は県ではなく電力会社で決まる" },
        { href: "/articles/electricity-bill-annual-gap-hokkaido-kansai", label: "電気代の地域差を年額で見る" }
      ]
    });
  }

  // 3. 医療
  const doctor = get("doctor");
  const hospital = get("hospitalPerCapita");
  if (doctor && hospital) {
    const advice =
      doctor.rank > TOTAL - 10
        ? "医師数は、全国では少ない側です。子どもがいる場合は、小児科の診療時間、休日・夜間の受け皿、電話相談窓口（#8000）を、引っ越し前に確認しておくと安心です。"
        : doctor.rank <= 15
          ? "医師数は多い側ですが、診療科の偏りや、診療時間、休日・夜間の対応までは、数字から分かりません。小児科の診療時間と、休日・夜間の受け皿を、あわせて確認してください。"
          : "医師数は全国で中位です。診療科の偏りや、診療時間、休日・夜間の対応は、数字から分かりません。小児科の診療時間と、休日・夜間の受け皿を、確認してください。";
    items.push({
      heading: "医療の受けやすさ",
      text: `${name}の人口10万人あたり医師数は${num(doctor.value, 1)}人${yr(doctor)}で全国${doctor.rank}位、人口10万人あたり病院数は${num(hospital.value, 1)}施設${yr(hospital)}で全国${hospital.rank}位です。${advice}`,
      links: [{ href: "/articles/relocation-children-medical-access-checklist", label: "子どもの急な体調不良に備える手順" }]
    });
  }

  // 4. 仕事と収入
  const wage = get("minimumWage");
  const salary = get("salary");
  if (wage && salary) {
    items.push({
      heading: "仕事と収入",
      text: `${name}の最低賃金は${num(wage.value)}円${yr(wage)}で全国${wage.rank}位、平均年収は${num(salary.value, 1)}万円${yr(salary)}で全国${salary.rank}位です。額面だけでなく、生活費で割った「実質」で見ると、順位は変わります。働く場所を決めるときは、家賃や通勤の費用も含めて比べてください。`,
      links: [{ href: "/articles/minimum-wage-real-value-ranking", label: "最低賃金を生活費で割った実質ランキング" }]
    });
  }

  // 5. 子育てと公共施設
  const park = get("park");
  const library = get("library");
  if (park && library) {
    items.push({
      heading: "公園や図書館の使いやすさ",
      text: `${name}の1人あたり公園面積は${num(park.value, 2)}m²${yr(park)}で全国${park.rank}位、図書館数は${num(library.value)}館${yr(library)}で全国${library.rank}位です。これらは広さや数の目安で、開いている時間、休日の混み具合、行き方、休める場所といった使いやすさは、数字には表れません。引っ越し前に、候補の施設を確認してください。`,
      links: [{ href: "/articles/kids-friendly-library-park-check-before-moving", label: "子連れで使いやすい図書館・公園の見つけ方" }]
    });
  }

  // 6. 気候
  const temp = get("temperature");
  const sun = get("sunshine");
  if (temp && sun) {
    items.push({
      heading: "気候",
      text: `${name}（県庁所在地）の年平均気温は${num(temp.value, 1)}℃${yr(temp)}で全国${temp.rank}位、年間日照時間は${num(sun.value)}時間${yr(sun)}で全国${sun.rank}位です。年平均だけでは、冬の寒さや雪、夏の暑さは分かりません。季節ごとの条件も確認してください。`,
      links: [
        { href: "/articles/temperature-okinawa-hokkaido-gap-13-degrees", label: "気温の地域差" },
        { href: "/articles/sunshine-hours-saitama-top-okinawa-low", label: "日照時間の地域差" }
      ]
    });
  }

  return items;
}
