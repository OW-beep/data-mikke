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

## 今後の拡張（フェーズ2以降）

- 地図表示（都道府県別コロプレス図）
- 解説記事テンプレート（Markdown + frontmatterでdataset/areaを指定）
- 内部リンク自動生成（記事 ⇔ dashboard ⇔ prefecture）
- CSVダウンロード機能
