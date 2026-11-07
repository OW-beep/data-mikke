/**
 * トップページの「こんな悩み・疑問から探す」。読者の困りごと（検索するときの言葉）から、
 * 答えになる記事・ツールへ案内する。リンク先は、存在するページだけを指定すること。
 */
export type Worry = {
  worry: string; // 読者の悩み・疑問（読者の言葉で）
  answer: string; // 開いたら何が分かるか
  href: string;
};

export const WORRIES: Worry[] = [
  {
    worry: "引っ越し先で迷っている。生活費は、どれくらい違う？",
    answer: "家賃・電気代・ガソリン代など7品目を、2つの都道府県で並べて比べられます",
    href: "/tools/kurashi"
  },
  {
    worry: "電気代が高い。住んでいる地域のせい？",
    answer: "電気代は県ではなく電力会社の供給エリアで決まっていました。金額の違いを整理しています",
    href: "/articles/electricity-bill-by-utility-company-not-prefecture"
  },
  {
    worry: "家賃が高いのは仕方ない？ 割高な県はどこ？",
    answer: "所得と人口密度で説明できる家賃と、実際の家賃の差を比べました",
    href: "/articles/rent-affordability-regression-residual-ranking"
  },
  {
    worry: "最低賃金が高い県は、本当に稼ぎやすい？",
    answer: "物価で割った「実質」で見ると、順位が入れ替わります（2026年度）",
    href: "/articles/minimum-wage-real-value-ranking"
  },
  {
    worry: "県民所得と平均年収、どちらを見ればいい？",
    answer: "県民所得は給料のランキングではありません。比べる前に知っておきたい違いです",
    href: "/articles/income-ranking-caution"
  },
  {
    worry: "米や食品の値段は、住む場所でどれだけ違う？",
    answer: "米・肉・パン・卵・ラーメンなどの価格差を、テーマ別ガイドでまとめて見られます",
    href: "/topics/food-prices"
  },
  {
    worry: "「住みやすい県」は、何で決まるの？",
    answer: "5つの指標で採点した総合力スコアと、その限界を解説しています",
    href: "/articles/prefecture-livability-ranking-five-metrics"
  },
  {
    worry: "ランキングの1位を、どこまで信じていい？",
    answer: "都道府県のデータを比べるときに確認したい4つのポイントです",
    href: "/articles/how-to-compare-prefecture-data"
  },
  {
    worry: "自分の県に、統計上いちばん似ている県は？",
    answer: "20指標の分析から、距離が最も近い県を探せます",
    href: "/articles/prefecture-nearest-neighbor-statistical-twin"
  },
  {
    worry: "統計をレポートや資料に使いたい。何に気をつける？",
    answer: "出典・調査年・分母など12項目のチェックシート（Excel・無料）を配布しています",
    href: "/resources"
  }
];
