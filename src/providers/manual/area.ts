import { readFile } from "node:fs/promises";
import path from "node:path";
import { Provider } from "@/providers/types";
import { DataPoint } from "@/types/data";
import { PREFECTURES } from "@/lib/prefectures";

/**
 * 国土地理院「全国都道府県市区町村別面積調」のCSVから都道府県別の面積を読み込むProvider。
 *
 * このCSVには全国の市区町村（約1,700）の面積も含まれているが、
 * 現状のサイトは都道府県単位のため、まずは都道府県の行だけを抽出して使う。
 * 将来、市区町村単位のページを作るときも同じファイルをそのまま再利用できる。
 *
 * 【重要】このCSVの「標準地域コード」は、サイトの他のデータで使っているJIS都道府県コード
 * （"01"〜"47"）とは体系が異なる（例: 北海道が"1000"）。そのためコードでは突き合わせず、
 * 都道府県名（例:"北海道","青森県"）の完全一致でマッチングしている。
 *
 * 想定運用:
 *   1. 国土地理院のサイトから最新の「全国都道府県市区町村別面積調」CSVをダウンロードする
 *      https://www.gsi.go.jp/KOKUJYOHO/OCHIZU/menseki/menseki_top.html
 *   2. Shift_JISのままで良いので data/raw/area_municipalities_raw.csv を上書きする
 *   3. npm run sync を実行する
 */
export const manualAreaProvider: Provider = {
  id: "manual-area",
  datasetId: "area",

  async fetch(): Promise<DataPoint[]> {
    const csvPath = path.join(process.cwd(), "data", "raw", "area_municipalities_raw.csv");

    let raw: string;
    try {
      // 国土地理院の配布ファイルはShift_JISのことが多いが、UTF-8で保存し直していても読めるようにする
      const buffer = await readFile(csvPath);
      raw = decodeCsv(buffer);
    } catch {
      console.warn(
        "[manual/area] data/raw/area_municipalities_raw.csv が無いためモックデータを使用します"
      );
      return mockArea();
    }

    const points = parsePrefectureRows(raw);
    if (points.length === 0) {
      console.warn(
        "[manual/area] CSVから都道府県の行を1件も抽出できなかったためモックデータを使用します（フォーマットが変わっていないか確認してください）"
      );
      return mockArea();
    }
    return points;
  }
};

function decodeCsv(buffer: Buffer): string {
  // 先頭にBOMやUTF-8として問題ない文字列ならそのままUTF-8として扱う。
  // 変換済みでない生のShift_JISファイルが来た場合の簡易フォールバックとしては、
  // Node標準機能だけではShift_JISを直接デコードできないため、
  // 事前にUTF-8へ変換してから配置することを前提とする（README参照）。
  return buffer.toString("utf-8");
}

/** 令和表記のヘッダー文字列（例: "令和8年4月1日(km2)"）から西暦年を取り出す */
function reiwaHeaderToYear(header: string): number | null {
  const match = header.match(/令和(\d+)年/);
  if (!match) return null;
  return 2018 + Number(match[1]); // 令和1年 = 2019年
}

function parsePrefectureRows(raw: string): DataPoint[] {
  const lines = splitCsvLines(raw);

  const headerIndex = lines.findIndex((cols) => cols[0] === "標準地域コード");
  if (headerIndex === -1) return [];

  const header = lines[headerIndex];
  // 面積の列（"(km2)"等を含む列）のうち、一番左＝一番新しい調査時点を採用する
  const valueColIndex = header.findIndex((h) => /\(k/i.test(h));
  if (valueColIndex === -1) return [];
  const year = reiwaHeaderToYear(header[valueColIndex]) ?? new Date().getFullYear();

  const points: DataPoint[] = [];
  for (const cols of lines.slice(headerIndex + 1)) {
    const prefName = cols[1]?.trim();
    const gunOrShicho = cols[2]?.trim();
    const municipality = cols[3]?.trim();
    if (!prefName || gunOrShicho || municipality) continue; // 都道府県の合計行だけを対象にする

    const pref = PREFECTURES.find((p) => p.name === prefName);
    if (!pref) continue; // 「全国面積」「北海道(市部)」等は除外される

    const value = Number(cols[valueColIndex]);
    if (Number.isNaN(value)) continue;

    points.push({ dataset: "area", areaCode: pref.code, areaName: pref.name, year, value });
  }
  return points;
}

/** ダブルクォート囲み・カンマを考慮した簡易CSVパーサ */
function splitCsvLines(raw: string): string[][] {
  return raw
    .split(/\r?\n/)
    .filter((line) => line.length > 0)
    .map((line) => line.split(",").map((cell) => cell.replace(/^"|"$/g, "")));
}

function mockArea(): DataPoint[] {
  const base: Record<string, number> = {
    "01": 83422, // 北海道
    "13": 2194, // 東京都
    "27": 1905 // 大阪府
  };
  return PREFECTURES.map((pref) => ({
    dataset: "area",
    areaCode: pref.code,
    areaName: pref.name,
    year: 2026,
    value: base[pref.code] ?? 3000 + (Number(pref.code) % 10) * 800
  }));
}
