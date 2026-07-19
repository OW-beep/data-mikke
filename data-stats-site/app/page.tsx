import Link from "next/link";
import { DATASET_LIST } from "@/datasets";
import { getCategoryColor } from "@/lib/categoryColors";

export default function HomePage() {
  return (
    <div>
      <p className="dm-eyebrow">都道府県統計図鑑</p>
      <h1>
        知りたい数字を、
        <br />
        みっけ。
      </h1>
      <p className="dm-lede">
        e-Stat・総務省統計局・国土地理院などが公開するオープンデータを、都道府県ごとに見つけて、比べて、
        意味を読み解ける形に整えました。数字は標本のように、出典・年・単位をつけてお届けします。
      </p>

      <hr className="dm-divider" />

      <h2>指標を探す</h2>
      <div className="dm-grid">
        {DATASET_LIST.map((d, i) => {
          const color = getCategoryColor(d.category);
          return (
            <div key={d.id} className="dm-card" style={{ borderTopColor: color }}>
              <span className="dm-card-tag" style={{ background: color }}>
                No.{String(i + 1).padStart(2, "0")}
              </span>
              <div className="dm-card-eyebrow" style={{ color }}>
                {d.category}
              </div>
              <h3>{d.title}</h3>
              <div className="dm-card-meta">
                出典: {d.source} ／ {d.frequency}
              </div>
              <div className="dm-card-links">
                <Link href={`/dashboard/${d.id}`}>ダッシュボードを見る →</Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
