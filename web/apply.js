/*
 * お申し込みの案内画面(ポップアップ)を動かすファイルです。
 * 入力内容はお客さまの画面の中だけで扱い、サーバーやファイルには保存しません。
 * 「LINEで送る」を押すと、入力内容をLINEのメッセージ欄に入れて開きます。
 */
(function () {
  var LINE_ID = "@606mmvex";
  var PLANS = {
    basic: {
      name: "運命波本鑑定",
      price: "¥5,000",
      storesUrl: "https://ardeurchoubi.stores.jp/online_payment/b353d352-3330-43bc-8290-2b6cce9a5c4a",
      needsDelivery: false
    },
    stone: {
      name: "運命波本鑑定+パワーストーン",
      price: "¥29,800",
      storesUrl: "https://ardeurchoubi.stores.jp/online_payment/995f8d0d-54d0-4c5c-a1ab-845d2f402d40",
      needsDelivery: true
    }
  };

  var dialog = document.getElementById("apply-dialog");
  // 古いブラウザでは案内画面を開かず、これまでどおりLINEへ移動する
  if (!dialog || typeof dialog.showModal !== "function") return;

  var form = dialog.querySelector("form");
  var title = document.getElementById("apply-title");
  var price = document.getElementById("apply-price");
  var storesLink = document.getElementById("apply-stores-link");
  var deliveryFields = document.getElementById("apply-delivery");
  var birthdate = document.getElementById("apply-birthdate");
  var copyStatus = document.getElementById("apply-copy-status");
  var currentPlan = PLANS.basic;

  function open(plan) {
    currentPlan = plan;
    title.textContent = plan.name;
    price.textContent = plan.price;
    storesLink.href = plan.storesUrl;
    deliveryFields.hidden = !plan.needsDelivery;
    deliveryFields.disabled = !plan.needsDelivery;
    birthdate.max = new Date().toISOString().slice(0, 10);
    copyStatus.textContent = "";
    dialog.showModal();
    dialog.scrollTop = 0;
    document.body.classList.add("apply-open");
  }

  function formatDate(value) {
    var parts = value.split("-");
    return parts[0] + "年" + Number(parts[1]) + "月" + Number(parts[2]) + "日";
  }

  function buildMessage() {
    var payment = form.querySelector('input[name="pay"]:checked');
    var lines = [
      "【お申し込み】" + currentPlan.name + " " + currentPlan.price,
      "お支払い方法:" + payment.dataset.label
    ];
    Array.prototype.forEach.call(form.querySelectorAll("[data-label]"), function (field) {
      if (field.type === "radio" || field.disabled || field.closest("fieldset:disabled")) return;
      var value = field.value.trim();
      if (!value) return;
      lines.push(field.dataset.label + ":" + (field.type === "date" ? formatDate(value) : value));
    });
    return lines.join("\n");
  }

  document.querySelectorAll("[data-apply-plan]").forEach(function (button) {
    button.addEventListener("click", function (event) {
      event.preventDefault();
      open(PLANS[button.dataset.applyPlan]);
    });
  });

  dialog.querySelector(".apply-close").addEventListener("click", function () {
    dialog.close();
  });

  dialog.addEventListener("close", function () {
    document.body.classList.remove("apply-open");
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    location.href = "https://line.me/R/oaMessage/" + encodeURIComponent(LINE_ID) + "/?" +
      encodeURIComponent(buildMessage());
  });

  document.getElementById("apply-copy").addEventListener("click", function () {
    if (!form.reportValidity()) return;
    var done = function (text) { copyStatus.textContent = text; };
    if (!navigator.clipboard) {
      done("コピーできませんでした。お手数ですが、LINEに直接ご入力ください。");
      return;
    }
    navigator.clipboard.writeText(buildMessage()).then(function () {
      done("コピーしました。LINEのトーク画面に貼り付けて送信してください。");
    }, function () {
      done("コピーできませんでした。お手数ですが、LINEに直接ご入力ください。");
    });
  });
})();
