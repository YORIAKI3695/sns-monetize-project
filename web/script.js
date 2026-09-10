/**
 * 波動鑑定士 - 無料簡易波動チェック
 *
 * ⚠️ このファイルの判定ロジックはマーケティング用の簡易プレースホルダーです。
 * 「現在波動」を数秘術の個人年(生年月日+対象年から算出する1桁の数)をもとに
 * 6タイプへ仮マッピングしているだけで、正式な波動スコア算出ロジックではありません。
 * 正式ロジックは obsidian-vault/04_Wave_Calculation/鑑定ロジック設計書.md で
 * 検証・確定させ、確定後にこのファイルの calcPersonalYear() / pickWaveType() を
 * 差し替えてください。
 */

const LINE_ADD_FRIEND_URL = "https://lin.ee/XP9l7Ii";

const WAVE_TYPES = [
  {
    key: "activity",
    name: "活動波",
    desc: "動き出し・行動力が高まっている時期です。新しいことを始めるエネルギーが高まっています。",
  },
  {
    key: "leap",
    name: "飛躍波",
    desc: "大きな成長やチャンスが訪れやすい時期です。思い切った一歩が実を結びやすいタイミング。",
  },
  {
    key: "drive",
    name: "推進波",
    desc: "着実に前進し、積み上げていく時期です。コツコツとした努力が力になっていきます。",
  },
  {
    key: "settle",
    name: "安定波",
    desc: "安定・維持を大切にしたい時期です。現状をキープすることが吉と出やすいタイミング。",
  },
  {
    key: "decline",
    name: "衰退波",
    desc: "これまでのやり方を見直し、次への準備を整える時期です。「終わり」ではなく「準備期間」として捉えると見え方が変わります。",
  },
  {
    key: "purify",
    name: "浄化波",
    desc: "不要なものを手放し、リセットする時期です。新しい始まりの準備として、身の回りや心を整えるタイミング。",
  },
];

const THEME_LABELS = {
  work: "仕事",
  money: "お金",
  love: "恋愛・結婚",
  relationship: "人間関係",
  independence: "独立・起業",
  health: "健康",
  other: "その他",
};

function digitSum(n) {
  return String(Math.abs(n))
    .split("")
    .reduce((sum, ch) => sum + Number(ch), 0);
}

function reduceToSingleDigit(n) {
  let value = n;
  while (value > 9) {
    value = digitSum(value);
  }
  return value;
}

/** 数秘術の個人年(パーソナルイヤー)風の簡易計算。1〜9の値を返す。 */
function calcPersonalYear(birthdateStr, targetYear) {
  const date = new Date(birthdateStr);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const raw = digitSum(month) + digitSum(day) + digitSum(targetYear);
  return reduceToSingleDigit(raw);
}

/** 個人年(1-9)を6つの波動タイプへ仮マッピングする */
function pickWaveType(personalYear) {
  const index = (personalYear - 1) % WAVE_TYPES.length;
  return WAVE_TYPES[index];
}

function setLineLinks() {
  document.querySelectorAll('a[href*="lin.ee"], a[href*="line.me"]').forEach((el) => {
    el.href = LINE_ADD_FRIEND_URL;
  });
}

function showResult(waveType, themeKey) {
  const resultSection = document.getElementById("result");
  document.getElementById("resultType").textContent = waveType.name;
  document.getElementById("resultDesc").textContent = waveType.desc;

  const themeLabel = THEME_LABELS[themeKey] || "";
  document.getElementById("resultTheme").textContent = themeLabel
    ? `「${themeLabel}」については、この波の流れを意識して見つめてみると、今の状況のヒントが見えてくるかもしれません。`
    : "";

  resultSection.hidden = false;
  resultSection.scrollIntoView({ behavior: "smooth", block: "start" });
}

function initForm() {
  const form = document.getElementById("waveForm");
  const errorEl = document.getElementById("formError");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const birthdate = document.getElementById("birthdate").value;
    const theme = document.getElementById("theme").value;
    const consent = document.getElementById("consent").checked;

    if (!birthdate || !theme || !consent) {
      errorEl.hidden = false;
      return;
    }
    errorEl.hidden = true;

    const targetYear = new Date().getFullYear();
    const personalYear = calcPersonalYear(birthdate, targetYear);
    const waveType = pickWaveType(personalYear);

    showResult(waveType, theme);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setLineLinks();
  initForm();
});
