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

  /* ---- 1. 写真 → アニメ絵 の対応表（ファイル名の一部で引く）
     🟥masa指示(2026-08-22): 同じ絵を2箇所で使い回さない＝1枚1箇所 ---- */
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
    ["c7fc94dd", "assets/anime/food_chori.webp"],
    ["f42036ed", "assets/anime/food_rayu.webp"],
    // 店舗案内（各店の実写からGPT Image 2で起こした専用イラスト）
    ["27291dc1", "assets/anime/gaikan_v2.webp"],
    ["284312ee", "assets/anime/shop_niidai.webp"],
    ["f7a834cf", "assets/anime/shop_sendai.webp"],
    ["06f59b2a", "assets/anime/shop_hakusan.webp"],
    ["fukushima-shop-web", "assets/anime/shop_fukushima.webp"]
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
  var DICT = {};
  DICT.en = {
    "HOMEへ戻る": "Back to home",
    "お店の味を、そのまま冷蔵で": "Our shop's bowl, chilled and sent to you",
    "お店で毎日仕込んでいる麺と特製ダレを、ご自宅にお届けします。ゆで時間は3分です。": "The noodles and sauce we prepare every day, delivered to your door. Three minutes in boiling water and it is ready.",
    "いちばん人気": "Most popular",
    "油そば 1食パック×3セット": "Abura Soba — 3 single-serving packs",
    "お店の味そのままの1食パックを3つセットで。特製ダレ付き。ご家族やギフトにもどうぞ。": "Three single-serving packs, sauce included. Good for the family, and as a gift.",
    "（税込・送料別）": "(tax incl., shipping extra)",
    "購入する": "Buy now",
    "はじめての方に": "First time?",
    "柿川亭の油そば（お試し1食）": "Kakigawatei Abura Soba (one pack to try)",
    "まずは1食から。麺と特製ダレのお試しパックです。": "Start with one. Noodles and our sauce, packed to try.",
    "❄️ 冷蔵商品です。お届け後は10℃以下で保存し、お早めにお召し上がりください（賞味期限：製造から2週間）。冷蔵クール便（佐川急便）でお届けします。送料は全国一律920円です。店頭でのお持ち帰りは各店舗でも承っています。": "❄️ Chilled product. Keep below 10°C after delivery and eat soon (best before: two weeks from production). Sent by refrigerated courier (Sagawa). Shipping is a flat 920 yen. Delivery within Japan only — we cannot ship overseas. Takeout is also available at each shop.",
    "特定商取引法に基づく表記": "Legal notice (Specified Commercial Transactions Act)",
    "ご注文からお届けまで": "From order to delivery",
    "「購入する」から決済ページへ（クレジットカード・Apple Pay・Google Pay対応）": "Tap Buy now to reach the payment page (credit card, Apple Pay, Google Pay)",
    "お届け先とお支払い情報をご入力": "Enter your delivery address in Japan and payment details",
    "冷蔵便で発送。2〜4日ほどでお届けします": "Shipped chilled, arriving in about 2-4 days",
    "タケウチマスタード（旨味・辛口）": "Takeuchi mustard (umami / hot)",
    "〒940-0081 新潟県長岡市南町1-10-16": "1-10-16 Minamimachi, Nagaoka, Niigata 940-0081",
    "〒950-2111 新潟県新潟市西区大学南2-30-38": "2-30-38 Daigaku-minami, Nishi-ku, Niigata 950-2111",
    "〒984-0053 宮城県仙台市若林区連坊小路81 熊谷ビル103": "Kumagai Bldg 103, 81 Renbo-koji, Wakabayashi-ku, Sendai, Miyagi 984-0053",
    "〒951-8131 新潟県新潟市中央区白山浦2丁目180-3": "2-180-3 Hakusan-ura, Chuo-ku, Niigata 951-8131",
    "〒960-0112 福島県福島市南矢野目古屋敷56-24": "56-24 Furuyashiki, Minami-yanome, Fukushima 960-0112",
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
    "初めに酢とラー油をどんぶり１〜２周程度回しかけてください。かけないと本来の油そばの味になりません。最低でも１周ほど、ためらわずにかけてください。":
      "Pour vinegar and chili oil in one or two circles around the bowl. Without them it is not abura soba — so do not hold back.",
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
    "⚫︎定休日／なし（年中無休）": "● Open every day",
    "※日曜は昼のみ（11:00〜14:15）": "* Sundays: lunch only (11:00-14:15)",
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

  DICT.zh = {
    "HOMEへ戻る": "返回首页",
    "お店の味を、そのまま冷蔵で": "把店里的味道，冷藏送到家",
    "お店で毎日仕込んでいる麺と特製ダレを、ご自宅にお届けします。ゆで時間は3分です。": "把我们每天现做的面和特制酱汁送到您家。煮3分钟即可享用。",
    "いちばん人気": "最受欢迎",
    "油そば 1食パック×3セット": "油拌面 单人份×3包套装",
    "お店の味そのままの1食パックを3つセットで。特製ダレ付き。ご家族やギフトにもどうぞ。": "三包单人份，附特制酱汁。适合全家享用，也适合送礼。",
    "（税込・送料別）": "（含税・不含运费）",
    "購入する": "立即购买",
    "はじめての方に": "第一次尝试",
    "柿川亭の油そば（お試し1食）": "柿川亭油拌面（试吃单人份）",
    "まずは1食から。麺と特製ダレのお試しパックです。": "先从一份开始。面与特制酱汁的试吃装。",
    "❄️ 冷蔵商品です。お届け後は10℃以下で保存し、お早めにお召し上がりください（賞味期限：製造から2週間）。冷蔵クール便（佐川急便）でお届けします。送料は全国一律920円です。店頭でのお持ち帰りは各店舗でも承っています。": "❄️ 本商品为冷藏品。收到后请在10℃以下保存并尽早食用（保质期：生产后两周）。以冷藏宅配（佐川急便）配送，运费全国统一920日元。仅限日本国内配送，无法寄往海外。各门店也可现场外带。",
    "特定商取引法に基づく表記": "基于《特定商业交易法》的标示",
    "ご注文からお届けまで": "从下单到送达",
    "「購入する」から決済ページへ（クレジットカード・Apple Pay・Google Pay対応）": "点击「立即购买」进入支付页面（支持信用卡・Apple Pay・Google Pay）",
    "お届け先とお支払い情報をご入力": "填写日本国内的收件地址与支付信息",
    "冷蔵便で発送。2〜4日ほどでお届けします": "冷藏配送，约2〜4天送达",
    "タケウチマスタード（旨味・辛口）": "Takeuchi芥末酱（鲜味／辣味）",
    "〒940-0081 新潟県長岡市南町1-10-16": "邮编940-0081 新潟县长冈市南町1-10-16",
    "〒950-2111 新潟県新潟市西区大学南2-30-38": "邮编950-2111 新潟县新潟市西区大学南2-30-38",
    "〒984-0053 宮城県仙台市若林区連坊小路81 熊谷ビル103": "邮编984-0053 宫城县仙台市若林区连坊小路81 熊谷大厦103",
    "〒951-8131 新潟県新潟市中央区白山浦2丁目180-3": "邮编951-8131 新潟县新潟市中央区白山浦2丁目180-3",
    "〒960-0112 福島県福島市南矢野目古屋敷56-24": "邮编960-0112 福岛县福岛市南矢野目古屋敷56-24",
    "私たちについて": "关于我们",
    "こだわり": "我们的坚持",
    "食べ方": "吃法",
    "お品書き": "菜单",
    "お持ち帰り・通販": "外带・网购",
    "店舗案内": "门店",
    "FCお問い合わせ": "加盟咨询",
    "柿川亭について": "关于柿川亭",
    "油そばを文化に": "让油拌面成为一种文化",
    "油そばは東京発祥の「スープのないラーメン」です。柿川亭の油そばはチャーシュー・メンマ・海苔と王道のシンプルな盛り付けにオリジナルのタレと米油、そしてラー油と酢をお好みの分量で絡めてご賞味いただきます。また、多数あるトッピングの中からお好みに組み合わせて楽しめます。ラーメンに比べてカロリーや塩分を抑え、ヘルシーで女性や年配の方にも喜ばれています。": "油拌面是发源于东京的「没有汤的拉面」。柿川亭的油拌面配上叉烧、笋干和海苔，简单而正统。碗底铺着独家酱汁与国产米糠油，请按自己的喜好加入辣油和醋，充分拌匀后享用。还可以从众多配料中自由搭配。热量和盐分都比拉面低，很受女性和年长客人欢迎。",
    "この油そばの文化を新潟から全国へお届けします。柿川亭は展開するエリアの地元の人々から愛されるお店となれることを目指しています。": "我们把这份油拌面文化从新潟带向日本各地，希望在每一个落脚的城市，都能成为当地人喜爱的一家店。",
    "国産米油の使用": "使用国产米糠油",
    "米ヌカから抽出された国産の米油を使用することで、油っぽさを抑え、あっさりとしたヘルシーな味わいを実現しています。": "选用日本国产米糠榨取的米油，减少油腻感，口味清爽而健康。",
    "独自調合のタレ": "独家调配的酱汁",
    "風味や食感を重視し、粉の配合を徹底して作られた麺と、独自に調合されたタレとの相性が抜群です。": "面粉配比经过反复调整，讲究香气与口感，与我们自己调配的酱汁相得益彰。",
    "豊富なトッピング": "丰富的配料",
    "地元産のマスタードやバジル、長岡野菜を使ったマヨソースなど、多数のトッピングで自由にカスタマイズ。農家や飲食店と連携し、地元の食材を積極的に取り入れることで、地域とのつながりを大切にしています。": "本地产的芥末、罗勒，还有用长冈蔬菜做的蛋黄酱等，众多配料可自由搭配。我们与农户和同行合作，积极使用当地食材，重视与这片土地的联系。",
    "油そばの召し上がり方": "油拌面的吃法",
    "酢とラー油をかける": "1. 先加醋和辣油",
    "初めに酢とラー油をどんぶり１〜２周程度回しかけてください。かけないと本来の油そばの味になりません。最低でも１周ほど、ためらわずにかけてください。": "先沿着碗边淋一到两圈醋和辣油。不加的话就吃不出油拌面本来的味道，请放心大胆地加。",
    "むらなく混ぜる": "2. 拌匀",
    "どんぶりの底にタレと油が敷いてあります。麺をひっくり返すようにむらなく混ぜてください。": "碗底铺着酱汁和油，请把面翻上来，均匀拌开。",
    "温かいうちに召し上がる": "3. 趁热吃",
    "油そばはスープがないので冷めやすく、味が落ちやすいです。どうぞ温かいうちに召し上がってください。油そばは酢とラー油をかける量やトッピングによって自分好みの味を作ることも楽しみのひとつです。美味しい油そばの食べ方を探してみてください。": "因为没有汤，凉得快、味道也容易变差，请趁热享用。调整醋、辣油的份量和配料，做出属于自己的味道，也是油拌面的乐趣之一。",
    "基本メニュー": "基本菜单",
    "油そば": "油拌面",
    "焼豚油そば": "叉烧油拌面",
    "グルテンフリー油そば": "无麸质油拌面",
    "冷やし油そば": "冷制油拌面",
    "冷やし焼豚油そば": "冷制叉烧油拌面",
    "並盛": "普通份",
    "大盛": "大份",
    "特盛": "特大份",
    "※大盛は＋50円\u3000特盛は＋100円": "大份 +50日元 / 特大份 +100日元",
    "カスタマイズ": "自由搭配",
    "タレ": "酱汁",
    "オリジナル": "原味",
    "煮干": "小鱼干",
    "魚介かつお": "鲣鱼海鲜",
    "塩味": "盐味",
    "塩味（レモン付き）": "盐味（附柠檬）",
    "豚骨": "豚骨",
    "120円トッピング": "配料 120日元",
    "半熟卵": "溏心蛋",
    "ネギごま": "葱花芝麻",
    "カレースパイス": "咖喱香料",
    "明太子マヨネーズ": "明太子蛋黄酱",
    "アルベーロバジル": "罗勒酱",
    "えだまめマヨ": "毛豆蛋黄酱",
    "完熟トマトマヨ": "番茄蛋黄酱",
    "かぐら南蛮味噌マヨ": "神乐南蛮辣味噌蛋黄酱",
    "キムチ": "泡菜",
    "にんにく辛味噌": "蒜香辣味噌",
    "チーズ": "芝士",
    "麻辣醤": "麻辣酱",
    "50円トッピング": "配料 50日元",
    "レモン": "柠檬",
    "青じそ": "青紫苏",
    "わさび": "芥末",
    "梅（梅肉）": "梅肉",
    "柚子胡椒": "柚子胡椒",
    "鰹パウダー": "鲣鱼粉",
    "長岡本店": "长冈本店",
    "新潟大学前店": "新潟大学前店",
    "仙台連坊店": "仙台连坊店",
    "白山市場店": "白山市场店",
    "福島店": "福岛店",
    "⚫︎営業時間": "● 营业时间",
    "⚫︎定休日／不定休": "● 休息日：不固定",
    "⚫︎定休日／なし（年中無休）": "● 全年无休",
    "※日曜は昼のみ（11:00〜14:15）": "* 周日仅午市（11:00-14:15）",
    "⚫︎定休日／月曜": "● 休息日：周一",
    "⚫︎定休日／水・木曜日": "● 休息日：周三・周四",
    "※日曜は夜営業22:00まで": "* 周日晚间营业至22:00",
    "※土日は11:00から": "* 周六周日11:00开始",
    "日・月\u300011:00〜19:00": "周日・周一 11:00-19:00",
    "火・水\u300011:00〜14:00\u300017:00〜20:00": "周二・周三 11:00-14:00 / 17:00-20:00",
    "木\u300016:00〜20:00": "周四 16:00-20:00",
    "金・土\u300011:00〜14:00\u300017:00〜20:00": "周五・周六 11:00-14:00 / 17:00-20:00",
    "運営会社について": "公司信息",
    "FC加盟店募集": "招募加盟店",
    "運営／株式会社バウ": "运营／株式会社BAU"
  };


  /* ---- 3. 置換の実装 ---- */
  var textNodes = [];
  function collect(node) {
    for (var n = node.firstChild; n; n = n.nextSibling) {
      if (n.nodeType === 3) {
        var t = n.nodeValue.trim();
        if (t && (DICT.en[t] || DICT.zh[t])) textNodes.push({ node: n, jp: n.nodeValue, key: t });
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

  var LANGS = ["ja", "en", "zh"];
  var LANG_LABEL = { ja: "日本語", en: "English", zh: "中文" };

  function setLang(lang) {
    var d = DICT[lang];
    textNodes.forEach(function (it) {
      it.node.nodeValue = d && d[it.key] ? it.jp.replace(it.key, d[it.key]) : it.jp;
    });
    document.documentElement.dataset.lang = lang;
    document.documentElement.lang = lang;
    try { localStorage.setItem("kg_lang", lang); } catch (e) {}
    // 🟥masa指示: 外国語のときは写真で見せる（アニメで見たい人はボタンで戻せる）
    if (lang !== "ja" && document.documentElement.dataset.art === "anime") setArt("real");
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
    // アニメ絵が用意されていないページ（通販など）では絵柄ボタンを出さない
    var hasArt = imgs.some(function (it) { return it.anime; }) || slides.some(function (it) { return it.anime; });
    if (hasArt) bar.appendChild(bArt);
    // 言語は3つとも並べて出す（「次の言語」だけ出すと日本語に戻れないように見える・masa指摘）
    var langGroup = document.createElement("span");
    langGroup.className = "langs";
    var bLangs = {};
    LANGS.forEach(function (lg) {
      var b = document.createElement("button");
      b.textContent = LANG_LABEL[lg];
      b.addEventListener("click", function () { setLang(lg); paint(); });
      langGroup.appendChild(b);
      bLangs[lg] = b;
    });
    bar.appendChild(langGroup);
    document.body.appendChild(bar);

    window.__kgPaint = paint;
    function paint() {
      var anime = document.documentElement.dataset.art === "anime";
      bArt.textContent = anime ? "実写にもどす" : "アニメで見る";
      bArt.setAttribute("aria-pressed", anime ? "true" : "false");
      var lang = document.documentElement.dataset.lang || "ja";
      LANGS.forEach(function (lg) {
        bLangs[lg].setAttribute("aria-pressed", lg === lang ? "true" : "false");
      });
    }

    bArt.addEventListener("click", function () {
      setArt(document.documentElement.dataset.art === "anime" ? "real" : "anime");
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
    if (savedLang && LANGS.indexOf(savedLang) > 0) setLang(savedLang);
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
