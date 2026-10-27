// IndexNow: 更新した記事のURLを、BingなどのIndexNow対応の検索エンジンへ通知する。
// Googleは、IndexNowに対応していません。Googleへは、Search Consoleでの登録をお使いください。
// 使い方:
//   node scripts/indexnow.mjs --changed --wait=150   直前のコミットで変わった記事と、一覧ページを送る
//   node scripts/indexnow.mjs --all                  サイトマップの全URLを送る
//   --dry を付けると、送らずに対象のURLだけを表示する
import { execSync } from "node:child_process";
import { readdirSync } from "node:fs";

const HOST = "data-mikke-lab.vercel.app";
const KEY = readdirSync("public")
  .find((f) => /^[0-9a-f]{32}\.txt$/.test(f))
  ?.replace(".txt", "");
if (!KEY) {
  console.error("public/ にIndexNowのキーファイル（32文字の英数字.txt）がありません");
  process.exit(1);
}
const args = process.argv.slice(2);
const wait = Number((args.find((a) => a.startsWith("--wait=")) || "--wait=0").split("=")[1]);
const base = `https://${HOST}`;

async function allUrls() {
  const res = await fetch(`${base}/sitemap.xml`);
  const xml = await res.text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

function changedUrls() {
  const files = execSync("git diff --name-only HEAD~1 HEAD", { encoding: "utf-8" })
    .split("\n")
    .filter(Boolean);
  const urls = new Set();
  for (const f of files) {
    const m = f.match(/^src\/articles\/([^/]+)\.ts$/);
    if (m && m[1] !== "index" && m[1] !== "types") urls.add(`${base}/articles/${m[1]}`);
  }
  if (urls.size > 0) {
    urls.add(`${base}/`);
    urls.add(`${base}/articles`);
    urls.add(`${base}/topics`);
  }
  return [...urls];
}

const urls = args.includes("--all") ? await allUrls() : changedUrls();
if (urls.length === 0) {
  console.log("通知するURLがありません。終了します。");
  process.exit(0);
}
if (args.includes("--dry")) {
  console.log("（--dry: 送信しません）対象URL:");
  urls.forEach((u) => console.log(" - " + u));
  process.exit(0);
}
if (wait > 0) {
  console.log(`デプロイの完了を${wait}秒待ちます...`);
  await new Promise((r) => setTimeout(r, wait * 1000));
}
for (let i = 0; i < urls.length; i += 100) {
  const chunk = urls.slice(i, i + 100);
  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `${base}/${KEY}.txt`, urlList: chunk })
  });
  console.log(`IndexNow: ${chunk.length}件を送信 → HTTP ${res.status}`);
}
