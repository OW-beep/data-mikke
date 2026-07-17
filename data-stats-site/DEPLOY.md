# ブラウザだけで運用する手順（PC不要・ターミナル不要）

ローカルでの `npm install` や `npm run sync` は一切行わず、
**GitHubのWeb画面でファイルを編集 → Vercelが自動でビルド・デプロイ**
という流れで運用します。

```
GitHub（ブラウザでCSV編集）
        │  git commit（Webのまま）
        ▼
Vercel（pushを検知して自動ビルド）
        │  npm run sync → npm run build
        ▼
本番サイトに反映
```

---

## 1. 初回セットアップ（最初の1回だけ）

### 1-1. GitHubにリポジトリを作る
1. https://github.com/new を開く（ブラウザでログイン済みであること）
2. リポジトリ名を入力して「Create repository」
3. できた空リポジトリの画面で **「uploading an existing file」** というリンクをクリック
4. このzipを展開したフォルダの中身（`data-stats-site/` の中身、フォルダごと）を
   ドラッグ＆ドロップでアップロード
5. 「Commit changes」

   ※ zipのままではアップロードできないので、一度ローカルかブラウザの解凍ツールで展開してから
   フォルダごとドラッグ＆ドロップしてください（GitHubはフォルダ構造ごと受け付けます）。

### 1-2. Vercelにインポートする
1. https://vercel.com/new を開く
2. 「Import Git Repository」で先ほどのGitHubリポジトリを選択
3. Framework Preset は自動で **Next.js** と検出されるのでそのまま
4. 「Environment Variables」で以下を追加（任意。無くてもモックデータで動きます）
   - Key: `ESTAT_APP_ID`
   - Value: e-Stat APIで取得したアプリケーションID
5. 「Deploy」をクリック

これで `npm run sync`（データ生成）→ `npm run build` が自動実行され、サイトが公開されます。

---

## 2. 日常の更新（すべてブラウザで完結）

### データを更新したい場合（例: 病院数CSVを差し替える）
1. GitHubリポジトリの `data/raw/hospital.csv` を開く
2. 鉛筆アイコン（Edit this file）をクリック
3. 内容を書き換える
4. 画面下部の「Commit changes」をクリック（そのままmainブランチにコミットでOK）
5. Vercelが自動でビルド・デプロイを開始（Vercelダッシュボードの「Deployments」タブで進行状況を確認可能）
6. 数十秒〜数分で本番サイトに反映される

### 新しいデータセットを追加したい場合
GitHubのWeb画面から以下のファイルを新規作成・編集するだけで完結します。

1. `src/providers/manual/xxx.ts` を新規作成（`hospital.ts` をコピーして書き換えるのが早い）
2. `src/providers/index.ts` を編集して1行追加
3. `src/datasets/xxx.ts` を新規作成（`hospital.ts` をコピーして書き換え）
4. `src/datasets/index.ts` を編集して1行追加
5. Commit changes → Vercelが自動デプロイ

GitHubの各ファイル画面右上の「Add file」→「Create new file」でファイル作成、
既存ファイルは鉛筆アイコンで直接編集できます。

---

## 3. 補足

- `npm run sync` はビルド時（Vercel側）に自動実行されるよう `package.json` を設定済みです。
  ローカルで手動実行する必要はありません。
- `data/normalized/*.json` はビルドのたびに再生成されるため、コミットしなくて構いません
  （`data/raw/` の元データだけコミットすればOK）。
- e-Stat以外のAPI（気象庁・日本銀行など）を追加する場合も、APIキーが必要なものは
  Vercelダッシュボードの Project Settings → Environment Variables から追加できます
  （ここもブラウザだけで完結します）。
