import Link from "next/link";

/**
 * トップページのすぐ下に出す「運営者より」の帯。
 * 運営者情報（元地方公務員としての経験にもとづく考え方）へ、目立つ位置から誘導する。
 * リンク先は実在する記事・ページのみ（slugを変えたらここも直す）。
 */
const LINKS = [
  {
    href: "/articles/why-i-built-data-mikke-former-civil-servant",
    label: "「1位」を鵜呑みにしない。元地方公務員がデータみっけを作った理由"
  },
  {
    href: "/articles/why-visualization-matters-public-sector-to-private",
    label: "数字を見せただけでは伝わらない。住民の声から学んだ「見せ方」"
  }
];

export function OperatorStrip() {
  return (
    <aside className="dm-operator-strip" aria-label="運営者より">
      <p className="dm-operator-strip-text">
        <span className="dm-operator-strip-label">運営者より:</span>
        {LINKS.map((l, i) => (
          <span key={l.href}>
            {i > 0 && <span className="dm-operator-strip-sep"> · </span>}
            <Link href={l.href}>{l.label}</Link>
          </span>
        ))}
        <span className="dm-operator-strip-sep"> · </span>
        <Link href="/about" className="dm-operator-strip-about">
          運営者について →
        </Link>
      </p>
    </aside>
  );
}
