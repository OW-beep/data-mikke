# データみっけ（日本オープンデータ統計図鑑）

設計方針: **「データ取得」と「画面表示」を完全に分離する**。

```
データ取得(API/CSV/Excel) → Provider → 共通JSON(data/normalized) → Dashboard/Ranking/Compare/Prefecture/API
```

## セットアップ

```bash
npm install
cp .env.example .env.local   # ESTAT_APP_ID を設定（無くてもモックデータで動作します）
npm run sync                 # data/normalized/*.json を生成
npm run dev
```

http://localhost:3000 を開く。

## 保守フロー（データ更新）

```
1. CSV/Excelを置き換える（data/raw/ 配下。必要なものだけ）
2. npm run sync
3. npm run build
4. デプロイ
```

データソースが増えても、この手順は変わりません。

## データセットの追加方法

1. `src/providers/` に Provider を追加（取得 → 共通形式へ変換 → 終了、だけを行う）
2. `src/providers/index.ts` に登録
3. `src/datasets/` に DatasetConfig を追加
4. `src/datasets/index.ts` に登録

これだけで以下が自動的に増えます:

- `/dashboard/{id}`
- `/ranking/{id}`（`ranking: true` の場合）
- `/compare` の選択肢（`compare: true` の場合）
- `/prefecture/{pref}` の一覧行
- `/api/{id}`

## ディレクトリ構成

```
src/
  types/data.ts        共通データ形式・DatasetConfig型
  providers/            データ取得（e-Stat / 気象庁 / 手動CSV等）
  datasets/             dataset定義（この設定だけで各画面が自動生成される）
  lib/                  正規化JSONの読み込み・都道府県マスタ
  components/           TrendChart, CompareClient
scripts/sync.ts          npm run sync の実体
data/raw/                取得したままのファイル（CSV等）
data/normalized/         サイトで使う共通JSON
app/
  dashboard/[dataset]/
  ranking/[dataset]/
  compare/
  prefecture/[pref]/
  api/[dataset]/
```

## データの完全性について

- 人口: e-Stat APIキー設定時は複数年×47都道府県が自動取得される（未設定時はモック）
- 病院数: 全47都道府県（出典: 厚生労働省「医療施設動態調査」2018年10月時点）
- 県民所得: 全47都道府県（出典: 内閣府「県民経済計算」2022年度・令和4年度、2025年12月公表分）

病院数・県民所得は特定年のスナップショットです。最新年に更新したい場合は、
`data/raw/*.csv` を該当のe-Stat/内閣府の最新データに差し替えて `npm run sync` を実行してください。

## アドセンス対応で追加したもの

- `/privacy`（プライバシーポリシー） `/about`（運営者情報） `/contact`（お問い合わせ）+ 全ページ共通フッター
- `app/robots.ts` `app/sitemap.ts`（クロール性）
- 各ページの `generateMetadata`（dashboard/ranking/prefectureごとに個別のtitle/description）
- `src/articles/`（解説記事。オリジナルの文章コンテンツ。`/articles` 一覧 `/articles/{slug}` 詳細）
- `app/ads.txt/route.ts`（`NEXT_PUBLIC_ADSENSE_CLIENT` を設定すると自動生成）
- `app/layout.tsx` にAdSense確認用スクリプトを条件付きで挿入（同上の環境変数が必要）

### 申請前チェックリスト

1. `.env.example` を参考に `NEXT_PUBLIC_CONTACT_EMAIL` / `NEXT_PUBLIC_OPERATOR_NAME` を実際の値に設定する
2. `NEXT_PUBLIC_SITE_URL` を本番のVercelドメインに合わせる
3. AdSenseに登録して `NEXT_PUBLIC_ADSENSE_CLIENT`（`ca-pub-...`）を取得したらVercelの環境変数に設定 → 再デプロイ
4. `/ads.txt` が正しく表示されるか確認
5. 記事はできれば5本前後まで増やしてから申請するとよい（`src/articles/` に追加するだけで一覧・sitemapに反映される）

## 今後の拡張（フェーズ2以降）

- 地図表示（都道府県別コロプレス図）
- 内部リンク自動生成の強化（記事内で関連都道府県ページにもリンクする等）
- CSVダウンロード機能
- 記事をMarkdownファイル化（現在はTSオブジェクトで管理。本数が増えたら移行）
