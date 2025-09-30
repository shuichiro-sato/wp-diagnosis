const TRAITS = ['論理思考','成長志向','協調性','リーダーシップ','行動力','仕事重視','計画性','柔軟性'];
const TRAIT_MAX = 9; // 分類・集計の上限（回答点のみ。初期値は含めない）
const ORDER = ["成長志向", "論理思考", "計画性", "協調性", "行動力", "仕事重視", "柔軟性", "リーダーシップ"];

// 表示用（「あなたの強み」＆ レーダー）
const DISPLAY_BASE = 2;     // 初期値として足す
const DISPLAY_MAX  = 10;    // 表示上の最大
const STRONG_THRESHOLD = 7; // 強みとして出す下限（初期値込み）

// 7分類（タイプ判定）— 初期値は考慮しない
const PATTERN_TIEBREAK_PRIORITY = [
  "成果で語る実行派タイプ","戦略家タイプ","挑戦好きのパイオニアタイプ",
  "段取り上手のマルチタスクタイプ","成長重視のリーダータイプ","瞬発力×猪突猛進タイプ",
  "調整上手の架け橋タイプ"
];
const PATTERNS = [
  { key:'T1', name:'戦略家タイプ',    weights:{ 論理思考:0.45, 計画性:0.40, 柔軟性:0.15 }, lead:'論理思考' },
  { key:'T2', name:'挑戦好きのパイオニアタイプ', weights:{ 成長志向:0.45, 行動力:0.40, 柔軟性:0.15 }, lead:'成長志向' },
  { key:'T3', name:'調整上手の架け橋タイプ', weights:{ 協調性:0.50, 柔軟性:0.30, 論理思考:0.20 }, lead:'協調性' },
  { key:'T4', name:'成果で語る実行派タイプ',        weights:{ 仕事重視:0.50, リーダーシップ:0.30, 計画性:0.20 }, lead:'仕事重視' },
  { key:'T5', name:'段取り上手のマルチタスクタイプ',weights:{ 計画性:0.50, 仕事重視:0.30, 論理思考:0.20 }, lead:'計画性' },
  { key:'T6', name:'瞬発力×猪突猛進タイプ',  weights:{ 行動力:0.50, 仕事重視:0.30, 柔軟性:0.20 }, lead:'行動力' },
  { key:'T7', name:'成長重視のリーダータイプ',        weights:{ 成長志向:0.45, リーダーシップ:0.35, 論理思考:0.20 }, lead:'成長志向' },
];

// タイプのワンライナー
const TYPE_ONE_LINERS = {
  '成果で語る実行派タイプ': '<b>数字に強く、成果から逆算して動ける実行型<br><br>【強み】<br></b>数値分析、計画力、冷静さ<br><br><b>【注意ポイント】<br></b>短期的な目標に着目するあまり、中長期的な目標を見落としがちです。周囲の人への感情的な配慮も忘れずにしましょう。<br><br><b>【合う環境】<br></b>明確な目標・報酬連動、スピード重視の事業。',
  '戦略家タイプ':   '<b>論理的な計画で事業を支える中枢タイプ<br><br>【強み】<br></b>思考力、効率性、戦略設計<br><br><b>【注意ポイント】<br></b>完璧主義でスピードが落ちる傾向にあります。また、想定外の事態への対応に遅れてしまうことがあります。<br><br><b>【合う環境】<br></b>裁量の大きい組織、データ活用が進む職場。',
  '挑戦好きのパイオニアタイプ':'<b>新しいことにワクワクし、0→1を生み出す先駆者タイプ<br><br>【強み】<br></b>着想力、勇気、スタートダッシュの速さ<br><br><b>【注意ポイント】<br></b>詰めの甘さに注意。好奇心に駆られ優先度が拡散し、成果の見える化が苦手な傾向です。やりきる力と知見の共有と仕組み化の習慣がつけば、あなたの強みが一層輝きます。<br><br><b>【合う環境】<br></b>変化の速いフェーズ、新規PJが多い職場。',
  '段取り上手のマルチタスクタイプ':'<b>手順を整え、抜け漏れのないタイプが得意なタイプ<br><br>【強み】<br></b>質の追及、締切厳守、計画力<br><br><b>【注意ポイント】<br></b>変化や例外対応にストレスを感じるかもしれません。時には柔軟な対応ができるようになると、あなたの強みがさらに輝きます。<br><br><b>【合う環境】<br></b>複数案件の運用が可能な職場。オペレーションの管理が可能な環境。',
  '瞬発力×猪突猛進タイプ':'<b>行動量と機転で最速の成果を狙う実戦派<br><br>【強み】<br></b>初動と切替えの速さ、実直さ、臨機応変さ<br><br><b>【注意ポイント】<br></b>質を後回しにしてしまったり、確認不足によるミスを起こしがちです。急いでいるときこそ一呼吸入れてみましょう。あなたの強みにさらなる磨きがかかります。<br><br><b>【合う環境】<br></b>立ち上げフェーズの環境。成果主義の職場。',
  '調整上手の架け橋タイプ':'<b>立場の違う人をつなぐ、組織の潤滑油タイプ<br><br>【強み】<br></b>合意形成・関係構築、場づくり<br><br><b>【注意ポイント】<br></b>優柔不断になり機会損失を生んだり、他の人からの依頼が負担が重くのしかかってしまう傾向にあります。意思決定の明確化とスピード化をいしきすることで、あなたの強みがより活かせます。<br><br><b>【合う環境】<br></b>大企業。部署・ステークホルダー多い職場。',
  '成長重視のリーダータイプ': '<b>成長の方向性を示し、人と組織を成長させるリーダー<br><br>【強み】<br></b>責任感、成長への貪欲さ、巻き込み力<br><br><b>【注意ポイント】<br></b>細部の運用設計や数値追跡が疎かになる傾向があります。ビジョンや理念の提示だけで終わらず、足元の課題解決にも注意を払うことで、実行力を兼ねそろえたリーダーになれるでしょう。<br><br><b>【合う環境】<br></b>拡大フェーズの組織。新規事業の多い職場。'
};

// 強み詳細（各評価項目の説明文）
const TRAIT_DESCRIPTIONS = {
  '成長志向': 'ハングリー精神が旺盛で、新しい知識・経験を得ることを通して自己成長することが得意な人です。高い目標に対しても怖気付くことなく、楽しみながら挑戦できるでしょう。学習ゴールをKPI化し、四半期でスキル可視化（資格・実績）を積み上げよう。',
  '論理思考': 'ものごとを筋道立てて説明することが得意です。数値分析にも優れており、データを根拠にした冷静で客観的な判断を下すことができます。再現性のある意思決定が大きな武器になるでしょう。',
  '計画性':   'ゴールから逆算してタスクを整理し、段階的に進めるのが得意です。事前にリスクや課題を洗い出し、対策を組み込んだ計画を立てられるため、突発的なトラブルでも迅速かつ冷静に対応できます。',
  '協調性':   '異なるバックグラウンドや価値観を持つメンバーの間をつなぎ、チームの一体感を高める役割を果たせます。相手に安心感を与え、長期的な信頼関係を築きやすく、交渉や調整でも合意形成を前に進められます。',
  '行動力':   'まず動き、改善を重ねていくことで学習速度を上げられます。変化の速い環境でも素早く結果を出し、周囲に良い刺激を与えながらチーム全体を活性化します。',
  '仕事重視': '目標に対して粘り強く取り組み、最後までやり抜く力が強みです。数字で語れるため要所を任されやすく、難しい局面でも諦めずに行動し続けて周囲のモチベーションを引き上げます。',
  '柔軟性':   '急な方針転換や想定外の出来事にも落ち着いて対応できます。価値観や背景が異なる人とも協力関係を築けるため、多様性のある職場や新市場で力を発揮します。',
  'リーダーシップ': '目標やビジョンを明確に描き、メンバーを一つの方向に導くことが得意です。状況に応じて役割配分を見直し、成果に向けてチームを推進します。'
};

const questions = [
  { 
    text: "新しい土地に住むときは...", 
    left: { 
      label: "まず人間関係を築く", 
      img: "https://hitocareer.com/wp-content/uploads/2025/09/まず人間関係を築く-1.webp", 
      attr: ['協調性','行動力'], 
      points: 1 
    },
    right: { 
      label: "まず現地の習慣を知る", 
      img: "https://hitocareer.com/wp-content/uploads/2025/09/まず現地の習慣を知る-1.webp", 
      attr: ['論理思考','柔軟性'], 
      points: 1
    }
  },
   { 
    text: "仕事で大事なのは...", 
    left: { 
      label: "数字や目標の達成度", 
      img: "https://hitocareer.com/wp-content/uploads/2025/09/数字や目標の達成度-1.webp", 
      attr: ['仕事重視','計画性'], 
      points: 1
    },
    right: { 
      label: "成長できる環境と機会", 
      img: "https://hitocareer.com/wp-content/uploads/2025/09/成長できる環境と機会-1.webp", 
      attr: ['成長志向','行動力'], 
      points: 1
    }
  },
  { 
    text: "友人と食事をするとき...", 
    left: { 
      label: "友人の意見を聞く", 
      img: "https://hitocareer.com/wp-content/uploads/2025/09/友人の意見を聞く-1.webp", 
      attr: ['協調性','柔軟性'], 
      points: 1
    },
    right: { 
      label: "自分が店を提案する", 
      img: "https://hitocareer.com/wp-content/uploads/2025/09/自分が店を提案する-1.webp", 
      attr: ['リーダーシップ'], 
      points: 1
    }
  },
  { 
    text: "あこがれるのは...", 
    left: { 
      label: "ハイキャリアな人", 
      img: "https://hitocareer.com/wp-content/uploads/2025/09/ハイキャリアな人.webp", 
      attr: ['リーダーシップ','仕事重視'], 
      points: 1
    },
    right: { 
      label: "自由奔放な人", 
      img: "https://hitocareer.com/wp-content/uploads/2025/09/自由奔放な人.webp", 
      attr: ['柔軟性'], 
      points: 1
    }
    },
     { 
    text: "誰かを幸せにするなら...", 
    left: { 
      label: "多くの人", 
      img: "https://hitocareer.com/wp-content/uploads/2025/09/多くの人_1_.webp", 
      attr: ['協調性','リーダーシップ'], 
      points: 1
    },
    right: { 
      label: "身近な人", 
      img: "https://hitocareer.com/wp-content/uploads/2025/09/身近な人-1.webp", 
      attr: ['論理思考'], 
      points: 1
    }
  },
  { 
    text: "あなたの強みは...", 
    left: { 
      label: "行動力", 
      img: "https://hitocareer.com/wp-content/uploads/2025/09/行動力-2.webp", 
      attr: ['行動力'], 
      points: 1
    },
    right: { 
      label: "牽引力", 
      img: "https://hitocareer.com/wp-content/uploads/2025/09/牽引力-1.webp", 
      attr: ['リーダーシップ'], 
      points: 1
    }
  },
  { 
    text: "職場に求めるのは...", 
    left: { 
      label: "安定", 
      img: "https://hitocareer.com/wp-content/uploads/2025/09/安定-2.webp", 
      attr: ['計画性','論理思考'], 
      points: 1
    },
    right: { 
      label: "チャレンジ", 
      img: "https://hitocareer.com/wp-content/uploads/2025/09/チャレンジ-1.webp", 
      attr: ['行動力','仕事重視','成長志向'], 
      points: 1
    }
  },
  { 
    text: "自分磨きに時間を使うなら...", 
    left: { 
      label: "業務に役立つ本を読む", 
      img: "https://hitocareer.com/wp-content/uploads/2025/09/業務に役立つ本を読む-1.webp", 
      attr: ['仕事重視','成長志向'], 
      points: 1
    },
    right: { 
      label: "投資の本を読む", 
      img: "https://hitocareer.com/wp-content/uploads/2025/09/投資の本を読む-_2_.webp", 
      attr: ['計画性'], 
      points: 1
    }
  },
  { 
    text: "サブスクの見直しは...", 
    left: { 
      label: "使用頻度で決める", 
      img: "https://hitocareer.com/wp-content/uploads/2025/09/使用頻度で決める-1.webp", 
      attr: ['論理思考'], 
      points: 1
    },
    right: { 
      label: "見たい作品で決める", 
      img: "https://hitocareer.com/wp-content/uploads/2025/09/見たい作品で決める-1.webp", 
      attr: ['計画性'], 
      points: 1
    }
  },
  { 
    text: "新しいことを始めるときは...", 
    left: { 
      label: "挑戦を楽しむ", 
      img: "https://hitocareer.com/wp-content/uploads/2025/09/挑戦を楽しむ-1.webp", 
      attr: ['成長志向','行動力'], 
      points: 1
    },
    right: { 
      label: "リスクを考える", 
      img: "https://hitocareer.com/wp-content/uploads/2025/09/リスクを考える-1.webp", 
      attr: ['計画性','論理思考'], 
      points: 1
    }
  },
  { 
    text: "重視するのは...", 
    left: { 
      label: "チームの成長", 
      img: "https://hitocareer.com/wp-content/uploads/2025/09/チームの成長-1.webp", 
      attr: ['リーダーシップ','協調性','成長志向'], 
      points: 1
    },
    right: { 
      label: "自分の成長", 
      img: "https://hitocareer.com/wp-content/uploads/2025/09/自分の成長-1.webp", 
      attr: ['成長志向','仕事重視'], 
      points: 1
    }
  },
  { 
    text: "タスクへの対応は...", 
    left: { 
      label: "進捗に合わせた対応が肝心", 
      img: "https://hitocareer.com/wp-content/uploads/2025/09/進捗に合わせた対応が肝心-1.webp", 
      attr: ['柔軟性'], 
      points: 1
    },
    right: { 
      label: "事前の計画が肝心", 
      img: "https://hitocareer.com/wp-content/uploads/2025/09/事前の計画が肝心-1.webp", 
      attr: ['計画性','論理思考'], 
      points: 1
    }
  },
  { 
    text: "あなたに合っているのは...", 
    left: { 
      label: "個人の成果に応じた報酬", 
      img: "https://hitocareer.com/wp-content/uploads/2025/09/個人の成果に応じた報酬-1.webp", 
      attr: ['仕事重視','成長志向'],
      points: 1
    },
    right: { 
      label: "チームの成果に応じた報酬", 
      img: "https://hitocareer.com/wp-content/uploads/2025/09/チームの成果に応じた報酬-1.webp", 
      attr: ['協調性','リーダーシップ'], 
      points: 1
    }
  },
  { 
    text: "得意なのは...", 
    left: { 
      label: "何が何でも目標達成すること", 
      img: "https://hitocareer.com/wp-content/uploads/2025/09/タスクを完璧にこなすこと-1.webp", 
      attr: ['仕事重視','行動力'], 
      points: 1
    },
    right: { 
      label: "ものごとを円滑に進めること", 
      img: "https://hitocareer.com/wp-content/uploads/2025/09/ものごとを円滑に進めること-1.webp", 
      attr: ['リーダーシップ','柔軟性','計画性','協調性'], 
      points: 1
    }
  },
  { 
    text: "何かを提案するときは...", 
    left: { 
      label: "斬新で創造的な意見を出す", 
      img: "https://hitocareer.com/wp-content/uploads/2025/09/斬新で創造的な意見を出す.webp", 
      attr: ['柔軟性'], 
      points: 1
    },
    right: { 
      label: "データや実績を元に意見を出す", 
      img: "https://hitocareer.com/wp-content/uploads/2025/09/データや実績を元に意見を出す.webp", 
      attr: ['論理思考'], 
      points: 1
    }
  },
  { 
    text: "誰かに何かをお願いするときは...", 
    left: { 
      label: "相手に方法をゆだねる", 
      img: "https://hitocareer.com/wp-content/uploads/2025/09/相手に方法をゆだねる.webp", 
      attr: ['協調性','柔軟性'], 
      points: 1
    },
    right: { 
      label: "具体的な進行方法を指示する", 
      img: "https://hitocareer.com/wp-content/uploads/2025/09/具体的な進行方法を指示する.webp", 
      attr: ['リーダーシップ','行動力','計画性'], 
      points: 1
    }
  },
  { 
    text: "重視すべきは...", 
    left: { 
      label: "結果", 
      img: "https://hitocareer.com/wp-content/uploads/2025/09/結果.webp", 
      attr: ['仕事重視','論理思考','計画性'], 
      points: 1
    },
    right: { 
      label: "過程", 
      img: "https://hitocareer.com/wp-content/uploads/2025/09/過程.webp", 
      attr: ['柔軟性','協調性'], 
      points: 1
    }
  },
  { 
    text: "私が得意なのは...", 
    left: { 
      label: "新たな環境に飛び込むこと", 
      img: "https://hitocareer.com/wp-content/uploads/2025/09/新たな環境に飛び込むこと.webp", 
      attr: ['行動力','成長志向','柔軟性'], 
      points: 1
    },
    right: { 
      label: "話の矛盾に気づくこと", 
      img: "https://hitocareer.com/wp-content/uploads/2025/09/話の矛盾に気づくこと.webp", 
      attr: ['論理思考'], 
      points: 1
    }
  },
  { 
    text: "より大切なのは...", 
    left: { 
      label: "チームワークを伸ばすこと", 
      img: "https://hitocareer.com/wp-content/uploads/2025/09/チームワークを伸ばすこと.webp", 
      attr: ['協調性','リーダーシップ'], 
      points: 1
    },
    right: { 
      label: "スキルを伸ばすこと", 
      img: "https://hitocareer.com/wp-content/uploads/2025/09/スキルを伸ばすこと.webp", 
      attr: ['成長志向','行動力','仕事重視'], 
      points: 1
    }
  }
  
];

const answers = [];
let current = 0;
// 生スコア（初期値は加算しない）
const scores = Object.fromEntries(TRAITS.map(t => [t, 0]));
// 「戻る」用の決定スタック（回答履歴）
const decisions = []; // { attrs: string[], pts: number, label: string, index: number }

// ====== 要素参照 ======
const app = document.getElementById("app");
const progressWrap = document.getElementById("progressWrap");

// ====== 高さフィッター（カード/結果の自然高に #app を合わせる） ======
function fitAppHeight() {
  const el = app.querySelector('.card, .inline-panel');
  if (!el) return;
  app.style.height = 'auto';               // いったん自動
  const h = el.scrollHeight;               // 自然高
  app.style.height = h + 'px';             // その高さに固定
}

// ====== 進捗UI ======
progressWrap.innerHTML = `
  <div class="progress-container">
    <div class="progress-bar">
      <div class="progress-fill"></div>
    </div>
    <div class="progress-percent">0%</div>
  </div>
`;
const progressFill = progressWrap.querySelector(".progress-fill");
const progressPercent = progressWrap.querySelector(".progress-percent");
function updateProgress() {
  const percent = Math.round((current / questions.length) * 100);
  progressFill.style.width = percent + "%";
  progressPercent.textContent = percent + "%";
}

// ====== 分類ロジック（初期値なし） ======
function normalizeScores(raw){
  const norm = {};
  for (const t of TRAITS) norm[t] = Math.max(0, Math.min(1, (raw[t] || 0) / TRAIT_MAX));
  return norm;
}
function compositeScore(norm, weights){
  let s = 0; for (const k in weights) s += (norm[k] || 0) * weights[k]; return s;
}
function classify7Patterns(raw){
  const norm = normalizeScores(raw);
  let results = PATTERNS.map(p => ({
    key: p.key, name: p.name, lead: p.lead,
    score: compositeScore(norm, p.weights)
  })).sort((a,b) => b.score - a.score);

  // タイブレーク
  const eps = 0.02;
  if (results.length > 1 && Math.abs(results[0].score - results[1].score) < eps) {
    const a = results[0], b = results[1];
    const na = norm[a.lead] || 0, nb = norm[b.lead] || 0;
    if (nb > na) [results[0], results[1]] = [results[1], results[0]];
    else if (Math.abs(na - nb) < 1e-6) {
      const ia = PATTERN_TIEBREAK_PRIORITY.indexOf(a.name);
      const ib = PATTERN_TIEBREAK_PRIORITY.indexOf(b.name);
      if (ia > -1 && ib > -1 && ia > ib) [results[0], results[1]] = [results[1], results[0]];
    }
  }
  return { type1: results[0], type2: results[1] || null, norm, all: results };
}

// ====== 表示用スコア（初期値+2、上限10） ======
function makeDisplayScores(raw){
  const disp = {};
  for (const k in raw) disp[k] = Math.min(DISPLAY_MAX, (raw[k] || 0) + DISPLAY_BASE);
  return disp;
}

// ====== カード生成・回答処理 ======
function createCard(q){
  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `
    <div class="card-question">${q.text}</div>
    <div class="card-options">
      <div class="option left"  style="background-image:url('${q.left.img}')"></div>
      <div class="option right" style="background-image:url('${q.right.img}')"></div>
    </div>
    ${current > 0 ? `
      <div class="card-footer">
        <button class="back-btn" type="button" aria-label="1問戻る">← 戻る</button>
      </div>
    ` : ``}
  `;

  // 戻る（最初の質問ではボタン自体が描画されない）
  const back = card.querySelector('.back-btn');
  if (back) back.addEventListener('click', backOneQuestion);

  // 入力（スワイプ/クリック）
  const isMobile = /iPhone|Android.+Mobile/.test(navigator.userAgent);
  let startX = 0;
  if (isMobile) {
    card.addEventListener("touchstart", e => { startX = e.touches[0].clientX; }, { passive: true });
    card.addEventListener("touchmove",  e => {
      const dx = e.touches[0].clientX - startX;
      card.style.transform = `translateX(${dx}px) rotate(${dx / 20}deg)`;
    }, { passive: true });
    card.addEventListener("touchend",   e => {
      const dx = e.changedTouches[0].clientX - startX;
      if (dx > 80) handleAnswer(q.right, card, "right");
      else if (dx < -80) handleAnswer(q.left, card, "left");
      else card.style.transform = "";
    }, { passive: true });
  } else {
    card.querySelector(".option.left").addEventListener("click", () => handleAnswer(q.left,  card, "left"));
    card.querySelector(".option.right").addEventListener("click",() => handleAnswer(q.right, card, "right"));
  }
  return card;
}

function handleAnswer(option, card, direction){
  const pts = Number(option.points || 0);
  // スコア加算
  (option.attr || []).forEach(attr => {
    if (TRAITS.includes(attr)) scores[attr] = Math.min(TRAIT_MAX, (scores[attr] || 0) + pts);
  });
  // 「戻る」用に履歴を積む
  decisions.push({ attrs: (option.attr || []).slice(), pts, label: option.label, index: current });
  answers.push(option.label);
  nextQuestion(card, direction);
}

// ====== 「カード内の戻る」処理 ======
function backOneQuestion(){
  if (!decisions.length) return; // 念のため
  const last = decisions.pop();  // 直前の回答を取り消す
  (last.attrs || []).forEach(attr => {
    if (TRAITS.includes(attr)) scores[attr] = Math.max(0, (scores[attr] || 0) - (last.pts || 0));
  });
  answers.pop();
  current = last.index; // ひとつ前の設問へ
  clearCards();
  updateProgress();
  app.appendChild(createCard(questions[current]));
  requestAnimationFrame(fitAppHeight);
}

// ====== 画面遷移 ======
function clearCards(){ app.querySelectorAll('.card, .inline-panel').forEach(el => el.remove()); }

function nextQuestion(card, direction){
  card.style.boxShadow = 'none';
  card.style.opacity = '0';
  card.style.transform = `translateX(${direction === "right" ? 200 : -200}px) rotate(${direction === "right" ? 15 : -15}deg)`;
  setTimeout(() => {
    clearCards();
    current++;
    updateProgress();
    if (current < questions.length) {
      app.appendChild(createCard(questions[current]));
      requestAnimationFrame(fitAppHeight);
    } else {
      showResultButtonInline(); // 設問完了 → CTA（カードではないので戻るボタンは表示されない）
    }
  }, 250);
}

// ====== CTA（設問完了。ここでも戻るボタンは表示しない） ======
function showResultButtonInline(){
  const panel = document.createElement('div');
  panel.className = 'inline-panel';
  panel.innerHTML = `
    <h2>質問は以上です。</h2>
    <button class="result-btn" id="showResultBtn">診断結果を見る</button>
  `;
  app.appendChild(panel);
  document.getElementById('showResultBtn').addEventListener('click', async () => {
    await logResultCTA();   // ← 追加
    renderResultInline();
  });
  requestAnimationFrame(fitAppHeight);
}

// ====== 結果表示（タイプ → 強みバー → レーダー → タイプ/強み詳細 → 詳細CTA） ======
function renderResultInline(){
  if (progressWrap) progressWrap.style.display = 'none';
  clearCards();

  const { type1 } = classify7Patterns(scores);
  const disp = makeDisplayScores(scores);

  const panel = document.createElement('div');
  panel.className = 'inline-panel';

  // 見出し
  const headline = document.createElement('div');
  headline.className = 'result-headline';
  headline.innerHTML = `
    <p class="type-line">あなたは <span class="type-chip">${type1.name}</span> タイプです</p>
  `;
  panel.appendChild(headline);

  // あなたの強み（バー）
  const strengths = Object.entries(disp)
    .filter(([_, v]) => v >= STRONG_THRESHOLD)
    .sort((a,b)=>b[1]-a[1]);

  const strengthsWrap = document.createElement('div');
  strengthsWrap.className = 'strengths-wrap';
  strengthsWrap.innerHTML = `<p class="strengths-title">あなたの強み</p>`;
  const list = document.createElement('div'); list.className = 'strengths-list';

  if (strengths.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'note';
    empty.textContent = '該当する強みはありません（しっかり伸びしろがあります）';
    strengthsWrap.appendChild(empty);
  } else {
    strengths.forEach(([name, val]) => {
      const item = document.createElement('div'); item.className='strength-item';
      item.innerHTML = `
        <div class="s-row">
          <div class="s-name">${name}</div>
          <div class="s-value">${val}</div>
        </div>
        <div class="bar-outer"><div class="bar-inner" style="width:${Math.round((val/10)*100)}%"></div></div>
      `;
      list.appendChild(item);
    });
    strengthsWrap.appendChild(list);
  }
  panel.appendChild(strengthsWrap);

  // レーダー
  const canvas = document.createElement('canvas'); canvas.id = 'radarChart';
  panel.appendChild(canvas);
  const note = document.createElement('div');
  note.className = 'note';
  note.textContent = '※ レーダーは初期値（+2）を含む表示値（最大10）で描画しています。';
  panel.appendChild(note);

  app.appendChild(panel);
  requestAnimationFrame(() => {
    new Chart(canvas.getContext('2d'), {
      type: "radar",
      data: {
        labels: ORDER,
        datasets: [{
          data: ORDER.map(a => Math.min(DISPLAY_MAX, (scores[a] ?? 0) + DISPLAY_BASE)),
          backgroundColor: "rgba(54, 162, 235, 0.35)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 0,
          pointHitRadius: 6
        }]
      },
      options: { responsive: true, scales: { r:{min:0,max:DISPLAY_MAX,ticks:{display:false}} }, plugins:{legend:{display:false}} }
    });
  });

  /* ------- モザイク＆フォーム（ゲート） ------- */
  // 本文（タイプ詳細・強み詳細）
  const typeDetail = document.createElement('section');
  typeDetail.className = 'section';
  typeDetail.innerHTML = `
    <h3 class="section-title">あなたのタイプ詳細</h3>
    <p class="type-caption">タイプ：${type1.name}</p>
    <p class="section-body">${TYPE_ONE_LINERS[type1.name] || ''}</p>
  `;

  const strongDetail = document.createElement('section');
  strongDetail.className = 'section';
  strongDetail.innerHTML = `<h3 class="section-title">あなたの強み詳細</h3>`;
  const ul = document.createElement('div'); ul.className = 'trait-detail-list';
  const traitKeys = Object.keys(TRAIT_DESCRIPTIONS);
  strengths.forEach(([name]) => {
    if (!traitKeys.includes(name)) return;
    const box = document.createElement('div');
    box.className = 'trait-detail';
    box.innerHTML = `
      <div class="trait-name">${name}</div>
      <p class="trait-text">${TRAIT_DESCRIPTIONS[name] || ''}</p>
    `;
    ul.appendChild(box);
  });
  strongDetail.appendChild(ul);

  // ラッパ＋モザイク
  const gateWrap = document.createElement('div');
  gateWrap.className = 'gate-wrap';
  gateWrap.appendChild(typeDetail);
  gateWrap.appendChild(strongDetail);

  const overlay = document.createElement('div');
  overlay.className = 'gate-overlay';
  overlay.innerHTML = `<button type="button" class="gate-cta">続きを見る</button>`;
  gateWrap.appendChild(overlay);

  // フォーム（最初は非表示）
  const form = document.createElement('form');
  form.className = 'gate-form';
  form.noValidate = true;
  form.innerHTML = `
    <div class="gfield">
      <label class="glabel" for="gname">氏名</label>
      <input id="gname" class="ginput" type="text" inputmode="text" placeholder="山田 太郎">
      <div class="gerror" id="gnameErr"></div>
    </div>
    <div class="gfield">
      <label class="glabel" for="gyear">生まれ年</label>
      <input id="gyear" class="ginput" type="text" inputmode="numeric" placeholder="1992" maxlength="4">
      <div class="gerror" id="gyearErr"></div>
    </div>
    <div class="gfield">
      <label class="glabel" for="gemail">メールアドレス</label>
      <input id="gemail" class="ginput" type="email" inputmode="email" placeholder="example@domain.jp">
      <div class="gerror" id="gemailErr"></div>
    </div>
    <div class="gfield">
      <label class="glabel" for="gphone">電話番号</label>
      <input id="gphone" class="ginput" type="tel" inputmode="numeric" placeholder="09012345678" maxlength="11">
      <div class="gerror" id="gphoneErr"></div>
    </div>
    <p class="privacy-note">
     <a href="https://hitocareer.com/terms/" target="_blank" rel="noopener">個人情報の取扱い</a> に同意した上でご登録ください。
    </p>
    <button type="submit" class="gsubmit" id="gsubmit">登録して続きを見る</button>
  `;
  gateWrap.appendChild(form);
  panel.appendChild(gateWrap);

  // CTA→フォーム表示
  overlay.querySelector('.gate-cta').addEventListener('click', () => {
    gateWrap.classList.add('open');   // ← これでフォームが表示
    overlay.classList.add('hidden');  // ← ブラーを無効化
    requestAnimationFrame(fitAppHeight);
  });

  // バリデーション
  const elName  = form.querySelector('#gname');
  const elYear  = form.querySelector('#gyear');
  const elMail  = form.querySelector('#gemail');
  const elPhone = form.querySelector('#gphone');
  const btn     = form.querySelector('#gsubmit');

  const errName  = form.querySelector('#gnameErr');
  const errYear  = form.querySelector('#gyearErr');
  const errMail  = form.querySelector('#gemailErr');
  const errPhone = form.querySelector('#gphoneErr');

  function vName(){ const v=elName.value.trim();
    if(!v){errName.textContent='氏名を入力してください'; return false;}
    if(/[A-Za-z]/.test(v)){errName.textContent='アルファベットは使用せず日本語で入力してください'; return false;}
    errName.textContent=''; return true;
  }
  function vYear(){ const v=elYear.value.trim();
    if(!/^\d{4}$/.test(v)){errYear.textContent='西暦4桁の半角数字で入力してください（例: 1992）'; return false;}
    errYear.textContent=''; return true;
  }
  function vMail(){ const v=elMail.value.trim();
    if(!/.+@.+\..+/.test(v)){errMail.textContent='メールアドレスを正しく入力してください'; return false;}
    errMail.textContent=''; return true;
  }
  function vPhone(){ const v=elPhone.value.trim();
    if(!/^\d{10,11}$/.test(v)){errPhone.textContent='電話番号は半角数字10桁もしくは11桁で入力してください'; return false;}
    errPhone.textContent=''; return true;
  }
  function updateSubmitState(){
    const ok = vName() & vYear() & vMail() & vPhone();
    if (ok) btn.classList.add('ready'); else btn.classList.remove('ready');
  }
  ['input','blur'].forEach(ev=>{
    elName.addEventListener(ev, updateSubmitState);
    elYear.addEventListener(ev, updateSubmitState);
    elMail.addEventListener(ev, updateSubmitState);
    elPhone.addEventListener(ev, updateSubmitState);
  });

  // 送信→解除
 form.addEventListener('submit', async (e) => {
  e.preventDefault();
  updateSubmitState();
  if (!btn.classList.contains('ready')) return;

  // 値を取得
  const payload = {
    name:  elName.value.trim(),
    phone: elPhone.value.trim(),
    email: elMail.value.trim(),
    birth: elYear.value.trim()
  };

  await submitRegisterToSheet(payload); // ← 追加

  // 解除（モザイク＆フォームを消す）
  overlay.remove();
  form.remove();
  requestAnimationFrame(fitAppHeight);
});


  // 最終高さ合わせ
  setTimeout(fitAppHeight, 0);
}

// === GAS WebApp ===
//今は無効化
//const GAS_URL = 'https://script.google.com/macros/s/AKfycbwBa6ypJ5_WFmt8t_wkd2CaWDw6hFLn33JES_JwPYxuG2Bqu_G8fv0mBZ0XsXLYeK07/exec';

async function postToSheet(payload) {
  const url = (DIAG?.restRoot || '') + 'sheet';
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type':'application/json',
      'X-WP-Nonce': DIAG?.restNonce || ''
    },
    body: JSON.stringify(payload)
  });
  // WP 経由なので CORS は発生しない。JSON を素直に読める
  return res.json();
}

// ▼ シートの2行目ヘッダー名（シートのテキストと完全一致させる）
const SHEET_QUESTION_HEADERS = [
  "新しい土地に住むとき",
  "仕事で大事なのは",
  "友人と食事をするとき",
  "あこがれるのは",
  "誰かを幸せにするなら",
  "あなたの強みは",
  "職場に求めるのは",
  "自分磨きに時間を使うなら",
  "サブスクの見直し",
  "新しいことを始めるときは",
  "重視するのは",
  "タスクへの対応は",
  "自分に合っているのは",   
  "得意なのは",
  "何かを提案するときは",
  "誰かに何かをお願いするときは",
  "重視するべきは",         
  "私が得意なのは",
  "より大切なのは"
];


// 回答を {質問テキスト: 選択肢ラベル} へ整形
function buildAnswerMap() {
  const m = {};
  SHEET_QUESTION_HEADERS.forEach((h, i) => { m[h] = answers[i] || ''; });
  return m;
}


// スコア（指定順）を収集（素点＝初期値+2なし）
function buildScoreObj() {
  const o = {};
  ['成長志向','協調性','リーダーシップ','行動力','仕事重視','柔軟性','計画性','論理思考']
    .forEach(k => { o[k] = Number(scores[k] || 0); });
  return o;
}
// ①「診断結果を見る」ログ
async function logResultCTA() {
  const tokenIn = sessionStorage.getItem('sheetToken') || null;
  const { type1 } = classify7Patterns(scores);
  const payload = {
    action: 'result',
    token: tokenIn,
    answers: buildAnswerMap(),
    scores: buildScoreObj(),
    type: type1?.name || ''
  };
  try {
    const res = await postToSheet(payload);
    if (res?.ok) {
      if (res.token) sessionStorage.setItem('sheetToken', res.token);
      if (res.row)   sessionStorage.setItem('sheetRow', String(res.row));
    } else {
      console.warn('proxy error(result):', res?.error);
    }
  } catch(e){ console.warn('fetch error(result):', e); }
}

async function submitRegisterToSheet({name, phone, email, birth}) {
  const token = sessionStorage.getItem('sheetToken') || null;
  const payload = { action:'register', token, name, phone, email, birth };
  try{
    const res = await postToSheet(payload);
    if (!res?.ok) console.warn('proxy error(register):', res?.error);
  }catch(e){ console.warn('fetch error(register):', e); }
}



// ====== 初期化 ======
(function init(){
  try {
    updateProgress();
    if (!questions || !questions.length) throw new Error("questions が空です");
    app.appendChild(createCard(questions[current]));
    requestAnimationFrame(fitAppHeight);

    // ウィンドウサイズ変化にも追従（軽いデバウンス）
    let _rzT;
    window.addEventListener('resize', () => {
      clearTimeout(_rzT);
      _rzT = setTimeout(fitAppHeight, 100);
    });
  } catch (e) {
    console.error(e);
    const p = document.createElement('div');
    p.className = 'inline-panel';
    p.innerHTML = `<h2>読み込みエラー</h2><div class="note">${e.message}</div>`;
    app.appendChild(p);
    requestAnimationFrame(fitAppHeight);
  }
})();
