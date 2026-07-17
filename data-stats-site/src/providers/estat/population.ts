import { Provider } from "@/providers/types";
import { DataPoint } from "@/types/data";
import { PREFECTURES } from "@/lib/prefectures";

/**
 * e-Stat API（政府統計の総合窓口）から人口統計を取得するProvider。
 * https://www.e-stat.go.jp/api/
 *
 * 【本番運用の設定】
 * Vercelの環境変数に以下を設定する（APIキーはコードやチャットに直接貼らず、必ず環境変数で渡すこと）:
 *   ESTAT_APP_ID=取得したアプリケーションID
 *   ESTAT_STATS_ID_POPULATION=使いたい統計表のstatsDataId（任意。未設定なら下記デフォルトを使用）
 *
 * デフォルトのstatsDataId "0003448231" は、
 * 「人口推計 各年10月1日現在人口 令和2年国勢調査基準 統計表004
 *   都道府県，男女別人口及び人口性比－総人口，日本人人口」
 * （総務省統計局）を指す。この表は1つのstatsDataIdの中に複数年（2020〜2024年など）が
 * 時間軸として含まれているため、都道府県ダッシュボードの推移グラフが複数年分描画される。
 *
 * 表には男女別（総数/男/女）の内訳が含まれるため、"総数" のみを抽出してから
 * 共通データ形式に変換している（フィルタしないと男女で二重計上されてしまうため）。
 *
 * statsDataIdの探し方:
 *   1. https://www.e-stat.go.jp/ で「人口推計」など目的の統計を検索
 *   2. 都道府県別・複数年を含む表を開く
 *   3. URLまたは「API」タブに表示される statsDataId をコピーして環境変数に設定
 *
 * APIキーが無い環境（ローカルの初回セットアップ時など）や、API呼び出しに失敗した場合は
 * モックデータにフォールバックする（ビルドやローカル開発が止まらないようにするため）。
 */
export const estatPopulationProvider: Provider = {
  id: "estat-population",
  datasetId: "population",

  async fetch(): Promise<DataPoint[]> {
    const appId = process.env.ESTAT_APP_ID;

    if (!appId) {
      console.warn("[estat/population] ESTAT_APP_ID 未設定のためモックデータを使用します");
      return mockPopulation();
    }

    try {
      const points = await fetchFromEstat(appId);
      if (points.length === 0) {
        console.warn(
          "[estat/population] e-Statから0件しか取得できなかったためモックデータにフォールバックします（statsDataIdやareaClassIdの設定を確認してください）"
        );
        return mockPopulation();
      }
      return points;
    } catch (err) {
      console.error(
        "[estat/population] e-Stat APIの取得に失敗したためモックデータにフォールバックします:",
        err
      );
      return mockPopulation();
    }
  }
};

async function fetchFromEstat(appId: string): Promise<DataPoint[]> {
  const statsDataId = process.env.ESTAT_STATS_ID_POPULATION ?? "0003448231";
  // 地域の分類コードのid。多くの表では "area" だが、表によって異なる場合があるので上書き可能にしておく
  const areaClassId = process.env.ESTAT_AREA_CLASS_ID ?? "area";

  const url = new URL("https://api.e-stat.go.jp/rest/3.0/app/json/getStatsData");
  url.searchParams.set("appId", appId);
  url.searchParams.set("statsDataId", statsDataId);
  url.searchParams.set("metaGetFlg", "Y"); // CLASS_OBJ（地域名・分類マスタ）を一緒に取得する
  url.searchParams.set("cntGetFlg", "N");

  const res = await fetch(url.toString(), { next: { revalidate: 60 * 60 * 24 } });
  if (!res.ok) {
    throw new Error(`e-Stat API error: ${res.status} ${res.statusText}`);
  }
  const json = await res.json();

  const result = json?.GET_STATS_DATA?.RESULT;
  if (result && String(result.STATUS) !== "0") {
    throw new Error(`e-Stat API returned STATUS=${result.STATUS}: ${result.ERROR_MSG}`);
  }

  const areaNameByCode = buildClassNameMap(json, areaClassId);
  const totalFilters = buildTotalFilters(json, areaClassId);
  return transformEstatResponse(json, areaNameByCode, totalFilters);
}

/**
 * CLASS_OBJ（メタ情報）から「あるクラスIDのコード → 名前」のマップを作る。
 * e-Statのコードは表によって桁数が異なる（例: "13000" や "13"）ため、
 * 生の名前で都道府県マスタと突き合わせるほうが確実。
 */
function buildClassNameMap(json: any, classId: string): Map<string, string> {
  const classObjRaw = json?.GET_STATS_DATA?.STATISTICAL_DATA?.CLASS_INF?.CLASS_OBJ;
  const classObjList: any[] = Array.isArray(classObjRaw) ? classObjRaw : classObjRaw ? [classObjRaw] : [];
  const targetClass = classObjList.find((c) => c["@id"] === classId);

  const map = new Map<string, string>();
  const classesRaw = targetClass?.CLASS;
  const classes: any[] = Array.isArray(classesRaw) ? classesRaw : classesRaw ? [classesRaw] : [];
  for (const c of classes) {
    if (c?.["@code"] && c?.["@name"]) {
      map.set(String(c["@code"]), String(c["@name"]));
    }
  }
  return map;
}

/**
 * area・time以外の分類（男女別など）について、「総数」を表すコードだけを集めておく。
 * 該当する分類軸ごとに { "@クラスid": "総数のコード" } を返す。
 * これが無いと、男女別の内訳がある表では男女それぞれの値まで合算されてしまう。
 */
function buildTotalFilters(json: any, areaClassId: string): Record<string, string> {
  const classObjRaw = json?.GET_STATS_DATA?.STATISTICAL_DATA?.CLASS_INF?.CLASS_OBJ;
  const classObjList: any[] = Array.isArray(classObjRaw) ? classObjRaw : classObjRaw ? [classObjRaw] : [];

  const filters: Record<string, string> = {};
  for (const classObj of classObjList) {
    const id = classObj?.["@id"];
    if (!id || id === areaClassId || id === "time") continue;

    const classesRaw = classObj?.CLASS;
    const classes: any[] = Array.isArray(classesRaw) ? classesRaw : classesRaw ? [classesRaw] : [];
    // 選択肢が1つしか無い分類（＝実質フィルタ不要）はスキップ
    if (classes.length <= 1) continue;

    const totalClass = classes.find((c) => ["総数", "計", "合計"].includes(String(c?.["@name"])));
    if (totalClass) {
      filters[id] = String(totalClass["@code"]);
    }
  }
  return filters;
}

/**
 * e-StatのレスポンスJSON構造を共通DataPoint形式に変換する。
 * 都道府県名で照合するため、地域コードの桁数の違い（"13" / "13000" 等）に影響されない。
 */
function transformEstatResponse(
  json: any,
  areaNameByCode: Map<string, string>,
  totalFilters: Record<string, string>
): DataPoint[] {
  const valuesRaw = json?.GET_STATS_DATA?.STATISTICAL_DATA?.DATA_INF?.VALUE;
  const values: any[] = Array.isArray(valuesRaw) ? valuesRaw : valuesRaw ? [valuesRaw] : [];

  return values
    .map((v): DataPoint | null => {
      // 男女別などの内訳がある表では、"総数" 以外の行を除外する
      for (const [classId, totalCode] of Object.entries(totalFilters)) {
        const attrKey = `@${classId}`;
        if (attrKey in v && String(v[attrKey]) !== totalCode) return null;
      }

      const areaCode = String(v["@area"] ?? "");
      const areaName = areaNameByCode.get(areaCode);
      if (!areaName) return null;

      const pref = PREFECTURES.find((p) => p.name === areaName || areaName.includes(p.name));
      if (!pref) return null; // 「全国」など都道府県以外の行は除外

      const year = Number(String(v["@time"] ?? "").slice(0, 4));
      const value = Number(v["$"]);
      if (!year || Number.isNaN(value)) return null;

      return {
        dataset: "population",
        areaCode: pref.code,
        areaName: pref.name,
        year,
        value
      };
    })
    .filter((v): v is DataPoint => v !== null);
}

function mockPopulation(): DataPoint[] {
  // 都道府県ごとにそれっぽい人口規模のダミー値を、複数年分生成（デモ・開発用）
  const base: Record<string, number> = {
    "13": 14059237, // 東京都
    "27": 8778035, // 大阪府
    "14": 9237337, // 神奈川県
    "23": 7495535, // 愛知県
    "01": 5140046 // 北海道
  };

  const years = [2020, 2021, 2022, 2023, 2024];

  return PREFECTURES.flatMap((pref) => {
    const value = base[pref.code] ?? 500000 + Number(pref.code) * 37000;
    return years.map((year, i) => ({
      dataset: "population",
      areaCode: pref.code,
      areaName: pref.name,
      year,
      value: Math.round(value * (1 - 0.004 * (years.length - 1 - i)))
    }));
  });
}
