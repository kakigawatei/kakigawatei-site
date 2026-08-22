/* ===== 切替モード（絵柄／言語）=====
   ・HTMLの構造には手を入れない。読み込み後にJSで差し替えるだけ。
   ・絵柄: 実写 ⇄ アニメ（綴MV用に描いた柿川亭のイラストに差し替え）
   ・言語: 日本語 ⇄ English（日本語の文字列をそのまま辞書のキーにして置換）
   masa依頼 2026-08-22 */
(function () {
  "use strict";

  /* このJS自身の場所からサイトのルートを割り出す（preview/ 配下でも同じ素材を見に行けるように） */
  var BASE = "";
  try {
    var me = document.currentScript && document.currentScript.src;
    if (me) BASE = me.replace(/assets\/mode\.js.*$/, "");
  } catch (e) {}

  /* ---- 1. 写真 → アニメ絵 の対応表（ファイル名の一部で引く） ---- */
  var ART = [
    // ヒーロー（背景スライド）
    ["0baad882", "assets/anime/a21_iriguchi_yoru.webp"],
    ["5b145f1c-3665-4850-8364-5ec2a7b749ff.webp", "assets/anime/a01_noren_kanban.webp"],
    ["f18cfd95", "assets/anime/a06_counter_zenkei.webp"],
    ["f67d4a2a", "assets/anime/a14_sakura_ki.webp"],
    ["f483af4a", "assets/anime/a08_gaikan_machi.webp"],
    // 柿川亭について
    ["7df5c69b", "assets/anime/a12_tennai_iriguchi.webp"],
    ["8817bc62", "assets/anime/a20_chef_ushiro.webp"],
    ["490c41a1", "assets/anime/a16_counter_mujin.webp"],
    // こだわり
    ["kodawari-komeabura", "assets/anime/a10_chef_yugiri.webp"],
    ["5b145f1c-3665-4850-8364-5ec2a7b749ff_middle", "assets/anime/a05_counter_chomiryo.webp"],
    ["bf62875e", "assets/anime/a17_hashi_te.webp"],
    // 食べ方
    ["71ac1973", "assets/anime/a18_kyaku_taberu.webp"],
    ["fcfb6867", "assets/anime/a13_kyaku_counter.webp"],
    ["10c63cbe", "assets/anime/a19_gakusei_danran.webp"],
    // お品書き
    ["menu-aburasoba", "assets/anime/a02_donburi_top.webp"],
    ["c7fc94dd", "assets/anime/a10_chef_yugiri.webp"],
    ["f42036ed", "assets/anime/a17_hashi_te.webp"],
    // 店舗案内（本店以外はまだイラストが無いので、雰囲気の近いものを当てる）
    ["27291dc1", "assets/anime/gaikan_v2.webp"],
    ["284312ee", "assets/anime/a15_noren_kabe.webp"],
    ["f7a834cf", "assets/anime/a11_iriguchi_teddy.webp"],
    ["06f59b2a", "assets/anime/a09_zashiki_mado.webp"],
    ["fukushima-shop-web", "assets/anime/a07_zashiki_tv.webp"]
  ];

  function animeFor(url) {
    if (!url) return null;
    for (var i = 0; i < ART.length; i++) {
      if (url.indexOf(ART[i][0]) >= 0) return abs(ART[i][1]);
    }
    return null;
  }

  function abs(p) { return p ? BASE + p : p; }

  /* ---- 2. 日本語 → 英語の辞書（キーは画面に出ている文字そのもの） ---- */
  var EN = {
    "私たちについて": "About",
    "こだわり": "Our Craft",
    "食べ方": "How to Eat",
    "お品書き": "Menu",
    "お持ち帰り・通販": "Takeout & Online",
    "店舗案内": "Shops",
    "FCお問い合わせ": "Franchise",
    "柿川亭について": "About Kakigawatei",
    "油そばを文化に": "Abura Soba, as a culture",
    "油そばは東京発祥の「スープのないラーメン」です。柿川亭の油そばはチャーシュー・メンマ・海苔と王道のシンプルな盛り付けにオリジナルのタレと米油、そしてラー油と酢をお好みの分量で絡めてご賞味いただきます。また、多数あるトッピングの中からお好みに組み合わせて楽しめます。ラーメンに比べてカロリーや塩分を抑え、ヘルシーで女性や年配の方にも喜ばれています。":
      "Abura soba is ramen without soup, born in Tokyo. Ours is served simply — chashu pork, bamboo shoots and nori — over noodles resting in our original sauce and Japanese rice-bran oil. Add chili oil and vinegar to taste, mix well, and build your own bowl from a long list of toppings. Lighter in calories and salt than a bowl of ramen, it is a favourite of all ages.",
    "この油そばの文化を新潟から全国へお届けします。柿川亭は展開するエリアの地元の人々から愛されるお店となれることを目指しています。":
      "We are carrying this abura soba culture from Niigata across Japan, hoping to become a shop that the people of each town call their own.",
    "国産米油の使用": "Japanese rice-bran oil",
    "米ヌカから抽出された国産の米油を使用することで、油っぽさを抑え、あっさりとしたヘルシーな味わいを実現しています。":
      "Pressed from rice bran grown in Japan, it keeps the bowl light on the palate rather than heavy with oil.",
    "独自調合のタレ": "Our own sauce",
    "風味や食感を重視し、粉の配合を徹底して作られた麺と、独自に調合されたタレとの相性が抜群です。":
      "Noodles blended for flavour and bite, matched with a sauce we mix ourselves — the two were made for each other.",
    "豊富なトッピング": "Toppings to play with",
    "地元産のマスタードやバジル、長岡野菜を使ったマヨソースなど、多数のトッピングで自由にカスタマイズ。農家や飲食店と連携し、地元の食材を積極的に取り入れることで、地域とのつながりを大切にしています。":
      "Local mustard, basil, a mayo sauce made with Nagaoka vegetables and many more. We work with farmers and neighbouring kitchens so the bowl stays rooted in this region.",
    "油そばの召し上がり方": "How to enjoy abura soba",
    "酢とラー油をかける": "1. Vinegar and chili oil",
    "初めに酢とラー油をどんぶり２〜３周程度回しかけてください。かけないと本来の油そばの味になりません。最低でも２周ほど、ためらわずにかけてください。":
      "Pour vinegar and chili oil in two or three circles around the bowl. Without them it is not abura soba — so do not hold back.",
    "むらなく混ぜる": "2. Mix it well",
    "どんぶりの底にタレと油が敷いてあります。麺をひっくり返すようにむらなく混ぜてください。":
      "The sauce and oil are waiting at the bottom. Turn the noodles over and mix until every strand is coated.",
    "温かいうちに召し上がる": "3. Eat while hot",
    "油そばはスープがないので冷めやすく、味が落ちやすいです。どうぞ温かいうちに召し上がってください。油そばは酢とラー油をかける量やトッピングによって自分好みの味を作ることも楽しみのひとつです。美味しい油そばの食べ方を探してみてください。":
      "With no soup to hold the heat, it cools quickly — so eat it while it is hot. Adjusting the vinegar, the chili oil and the toppings until it tastes like yours is half the fun.",
    "基本メニュー": "Main menu",
    "油そば": "Abura Soba",
    "焼豚油そば": "Chashu Abura Soba",
    "グルテンフリー油そば": "Gluten-free Abura Soba",
    "冷やし油そば": "Chilled Abura Soba",
    "冷やし焼豚油そば": "Chilled Chashu Abura Soba",
    "並盛": "Regular",
    "大盛": "Large",
    "特盛": "Extra large",
    "※大盛は＋50円　特盛は＋100円": "Large +50 yen / Extra large +100 yen",
    "カスタマイズ": "Customise",
    "タレ": "Sauce",
    "オリジナル": "Original",
    "煮干": "Niboshi (dried sardine)",
    "魚介かつお": "Bonito",
    "塩味": "Salt",
    "塩味（レモン付き）": "Salt with lemon",
    "豚骨": "Tonkotsu",
    "120円トッピング": "Toppings 120 yen",
    "半熟卵": "Soft-boiled egg",
    "ネギごま": "Green onion & sesame",
    "カレースパイス": "Curry spice",
    "明太子マヨネーズ": "Mentaiko mayo",
    "アルベーロバジル": "Albero basil",
    "えだまめマヨ": "Edamame mayo",
    "完熟トマトマヨ": "Ripe tomato mayo",
    "かぐら南蛮味噌マヨ": "Kagura-nanban chili miso mayo",
    "キムチ": "Kimchi",
    "にんにく辛味噌": "Garlic chili miso",
    "チーズ": "Cheese",
    "麻辣醤": "Mala sauce",
    "50円トッピング": "Toppings 50 yen",
    "レモン": "Lemon",
    "青じそ": "Green shiso",
    "わさび": "Wasabi",
    "梅（梅肉）": "Pickled plum",
    "柚子胡椒": "Yuzu pepper",
    "鰹パウダー": "Bonito powder",
    "長岡本店": "Nagaoka Main Shop",
    "新潟大学前店": "Niigata University Shop",
    "仙台連坊店": "Sendai Renbo Shop",
    "白山市場店": "Hakusan Ichiba Shop",
    "福島店": "Fukushima Shop",
    "⚫︎営業時間": "● Hours",
    "⚫︎定休日／不定休": "● Closed: irregular",
    "⚫︎定休日／月曜": "● Closed: Mondays",
    "⚫︎定休日／水・木曜日": "● Closed: Wed & Thu",
    "※日曜は夜営業22:00まで": "* Sundays: evening service until 22:00",
    "※土日は11:00から": "* Sat & Sun: from 11:00",
    "日・月　11:00〜19:00": "Sun & Mon 11:00-19:00",
    "火・水　11:00〜14:00　17:00〜20:00": "Tue & Wed 11:00-14:00 / 17:00-20:00",
    "木　16:00〜20:00": "Thu 16:00-20:00",
    "金・土　11:00〜14:00　17:00〜20:00": "Fri & Sat 11:00-14:00 / 17:00-20:00",
    "運営会社について": "Company",
    "FC加盟店募集": "Franchise opportunities",
    "運営／株式会社バウ": "Operated by BAU Inc."
  };

  /* ---- 3. 置換の実装 ---- */
  var textNodes = [];
  function collect(node) {
    for (var n = node.firstChild; n; n = n.nextSibling) {
      if (n.nodeType === 3) {
        var t = n.nodeValue.trim();
        if (t && EN[t]) textNodes.push({ node: n, jp: n.nodeValue, en: n.nodeValue.replace(t, EN[t]) });
      } else if (n.nodeType === 1 && n.tagName !== "SCRIPT" && n.tagName !== "STYLE") {
        collect(n);
      }
    }
  }

  var imgs = [];
  var slides = [];

  function setArt(mode) {
    var root = document.documentElement;
    root.classList.add("swapping");
    setTimeout(function () {
      imgs.forEach(function (it) {
        it.el.src = mode === "anime" && it.anime ? it.anime : it.real;
      });
      slides.forEach(function (it) {
        it.el.style.backgroundImage = "url('" + (mode === "anime" && it.anime ? it.anime : it.real) + "')";
      });
      root.dataset.art = mode;
      try { localStorage.setItem("kg_art", mode); } catch (e) {}
      root.classList.remove("swapping");
      if (typeof window.__kgPaint === "function") window.__kgPaint();
    }, 260);
  }

  function setLang(lang) {
    textNodes.forEach(function (it) {
      it.node.nodeValue = lang === "en" ? it.en : it.jp;
    });
    document.documentElement.dataset.lang = lang;
    document.documentElement.lang = lang === "en" ? "en" : "ja";
    try { localStorage.setItem("kg_lang", lang); } catch (e) {}
  }

  function build() {
    collect(document.body);

    [].forEach.call(document.querySelectorAll("section img"), function (el) {
      imgs.push({ el: el, real: el.getAttribute("src"), anime: animeFor(el.getAttribute("src")) });
    });
    [].forEach.call(document.querySelectorAll(".hero .slide"), function (el) {
      var m = /url\(['"]?([^'")]+)/.exec(el.style.backgroundImage || "");
      var real = m ? m[1] : "";
      slides.push({ el: el, real: real, anime: animeFor(real) });
    });

    // アニメモード用の動くヒーロー（夜の入口）
    var hero = document.querySelector(".hero");
    if (hero) {
      var v = document.createElement("video");
      v.className = "hero-anime";
      v.src = BASE + "assets/anime/hero_yoru.mp4";
      v.autoplay = true; v.loop = true; v.muted = true; v.playsInline = true;
      v.setAttribute("muted", ""); v.setAttribute("playsinline", "");
      hero.insertBefore(v, hero.firstChild);
    }

    // 切替ボタン
    var bar = document.createElement("div");
    bar.className = "modebar";
    var bArt = document.createElement("button");
    var bLang = document.createElement("button");
    bar.appendChild(bArt); bar.appendChild(bLang);
    document.body.appendChild(bar);

    window.__kgPaint = paint;
    function paint() {
      var anime = document.documentElement.dataset.art === "anime";
      var en = document.documentElement.dataset.lang === "en";
      bArt.textContent = anime ? "実写にもどす" : "アニメで見る";
      bArt.setAttribute("aria-pressed", anime ? "true" : "false");
      bLang.textContent = en ? "日本語" : "English";
      bLang.setAttribute("aria-pressed", en ? "true" : "false");
    }

    bArt.addEventListener("click", function () {
      setArt(document.documentElement.dataset.art === "anime" ? "real" : "anime");
      paint();
    });
    bLang.addEventListener("click", function () {
      setLang(document.documentElement.dataset.lang === "en" ? "ja" : "en");
      paint();
    });

    // 前回の選択を覚えておく（?art=anime&lang=en でも指定できる＝共有リンク用）
    var savedArt = null, savedLang = null;
    try { savedArt = localStorage.getItem("kg_art"); savedLang = localStorage.getItem("kg_lang"); } catch (e) {}
    var q = new URLSearchParams(location.search);
    if (q.get("art")) savedArt = q.get("art");
    if (q.get("lang")) savedLang = q.get("lang");
    document.documentElement.dataset.art = "real";
    document.documentElement.dataset.lang = "ja";
    if (savedArt === "anime") setArt("anime");
    if (savedLang === "en") setLang("en");
    paint();

    // ヒーローを過ぎたらボタンの色を反転（白背景で読めるように）
    window.addEventListener("scroll", function () {
      var h = hero ? hero.offsetHeight : 600;
      bar.classList.toggle("solid", window.scrollY > h - 80);
    }, { passive: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", build);
  } else {
    build();
  }
})();
