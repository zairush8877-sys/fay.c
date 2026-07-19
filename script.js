/* ============ Fay Concept — витрина и ИИ-стилист ============ */

/* Витрина-превью. Замените позиции на реальные: фото кладите в /img
   и указывайте поле image — карточка сама подхватит его вместо заливки. */
const PRODUCTS = [
  { id: 1,  name: "Пальто оверсайз из шерсти",   brand: "The Row",        cat: "Верхняя одежда", gender: "f", price: 185000, styles: ["quiet", "classic"], occasions: ["work", "evening"], palette: ["neutral", "dark"],  tint: "#6b5443" },
  { id: 2,  name: "Тренч с поясом",              brand: "Toteme",         cat: "Верхняя одежда", gender: "f", price: 98000,  styles: ["quiet", "classic"], occasions: ["work", "daily"],   palette: ["neutral", "light"], tint: "#9c8a76" },
  { id: 3,  name: "Дубленка авиатор",            brand: "Loewe",          cat: "Верхняя одежда", gender: "u", price: 240000, styles: ["trend"],            occasions: ["daily", "evening"],palette: ["neutral", "dark"],  tint: "#41332a" },
  { id: 4,  name: "Жакет прямого кроя",          brand: "Lemaire",        cat: "Костюмы",        gender: "u", price: 76000,  styles: ["quiet", "classic"], occasions: ["work"],            palette: ["neutral", "dark"],  tint: "#5b4a3c" },
  { id: 5,  name: "Костюм из тонкой шерсти",     brand: "The Row",        cat: "Костюмы",        gender: "m", price: 210000, styles: ["classic", "quiet"], occasions: ["work", "evening"], palette: ["dark", "neutral"],  tint: "#35281f" },
  { id: 6,  name: "Платье-комбинация",           brand: "Jacquemus",      cat: "Платья",         gender: "f", price: 54000,  styles: ["trend"],            occasions: ["evening"],         palette: ["light", "bright"],  tint: "#b39b7e" },
  { id: 7,  name: "Платье макси из шёлка",       brand: "Khaite",         cat: "Платья",         gender: "f", price: 120000, styles: ["quiet", "classic"], occasions: ["evening"],         palette: ["dark", "neutral"],  tint: "#4a3a2f" },
  { id: 8,  name: "Кашемировый свитер",          brand: "Loro Piana",     cat: "Трикотаж",       gender: "u", price: 145000, styles: ["quiet"],            occasions: ["daily", "work"],   palette: ["neutral", "light"], tint: "#8a7460" },
  { id: 9,  name: "Поло из мериноса",            brand: "Zegna",          cat: "Трикотаж",       gender: "m", price: 58000,  styles: ["classic", "quiet"], occasions: ["daily", "work"],   palette: ["neutral", "dark"],  tint: "#6e5b49" },
  { id: 10, name: "Худи из плотного хлопка",     brand: "Fear of God",    cat: "Трикотаж",       gender: "u", price: 42000,  styles: ["casual"],           occasions: ["daily", "sport"],  palette: ["neutral", "dark"],  tint: "#7d6a58" },
  { id: 11, name: "Джинсы широкого кроя",        brand: "Bottega Veneta", cat: "Трикотаж",       gender: "f", price: 68000,  styles: ["casual", "trend"],  occasions: ["daily"],           palette: ["dark", "neutral"],  tint: "#54473c" },
  { id: 12, name: "Сумка-тоут из замши",         brand: "The Row",        cat: "Сумки",          gender: "f", price: 320000, styles: ["quiet"],            occasions: ["work", "daily"],   palette: ["neutral", "dark"],  tint: "#5d4b3b" },
  { id: 13, name: "Сумка Puzzle mini, кожа",     brand: "Loewe",          cat: "Сумки",          gender: "f", price: 295000, styles: ["trend", "classic"], occasions: ["daily", "evening"],palette: ["neutral", "dark"],  tint: "#a08b71", image: "img/loewe-puzzle.jpg" },
  { id: 14, name: "Мини-сумка Le Bambino",       brand: "Jacquemus",      cat: "Сумки",          gender: "f", price: 89000,  styles: ["trend"],            occasions: ["evening", "daily"],palette: ["light", "bright"],  tint: "#c2ad90" },
  { id: 15, name: "Слингбэки на каблуке kitten", brand: "The Row",        cat: "Обувь",          gender: "f", price: 96000,  styles: ["quiet", "classic"], occasions: ["work", "evening"], palette: ["dark", "neutral"],  tint: "#46362b" },
  { id: 16, name: "Кроссовки Cloudmonster",      brand: "On",             cat: "Обувь",          gender: "u", price: 21000,  styles: ["casual"],           occasions: ["sport", "daily"],  palette: ["light", "bright"],  tint: "#8d7c69" },
  { id: 17, name: "Лоферы из телячьей кожи",     brand: "Bottega Veneta", cat: "Обувь",          gender: "m", price: 88000,  styles: ["classic", "quiet"], occasions: ["work", "daily"],   palette: ["dark", "neutral"],  tint: "#3c2f26" },
  { id: 18, name: "Очки в тонкой оправе",        brand: "Gentle Monster", cat: "Аксессуары",     gender: "u", price: 32000,  styles: ["trend", "casual"],  occasions: ["daily", "evening"],palette: ["neutral", "bright"],tint: "#75634f" },
  { id: 19, name: "Часы Baignoire",              brand: "Cartier",        cat: "Аксессуары",     gender: "f", price: 780000, styles: ["classic", "quiet"], occasions: ["evening", "work"], palette: ["neutral", "light"], tint: "#93825e" },
  { id: 20, name: "Шёлковый платок",             brand: "Toteme",         cat: "Аксессуары",     gender: "f", price: 24000,  styles: ["quiet", "classic"], occasions: ["daily", "work"],   palette: ["light", "neutral"], tint: "#ab9a83" },
  { id: 21, name: "Кольцо B.zero1, жёлтое золото", brand: "Bvlgari",      cat: "Аксессуары",     gender: "u", price: 460000, styles: ["classic", "quiet"], occasions: ["evening", "work"], palette: ["light", "neutral"], tint: "#93825e", image: "img/bvlgari-bzero1.jpg" },
  { id: 22, name: "Колье с жемчугом", brand: "Chanel",                    cat: "Аксессуары",     gender: "f", price: 520000, styles: ["classic", "trend"], occasions: ["evening"],         palette: ["light", "neutral"], tint: "#8d7c69", image: "img/chanel-pearls.jpg" },
  { id: 23, name: "Часы Tank Must с бриллиантами", brand: "Cartier",      cat: "Аксессуары",     gender: "f", price: 980000, styles: ["classic", "quiet"], occasions: ["evening", "work"], palette: ["dark", "neutral"],  tint: "#3c2f26", image: "img/cartier-tank.jpg" },
  { id: 24, name: "Серьги Serpenti Viper, белое золото", brand: "Bvlgari", cat: "Аксессуары",   gender: "f", price: 720000, styles: ["classic", "quiet"], occasions: ["evening", "work"], palette: ["light", "neutral"], tint: "#93825e", image: "img/bvlgari-viper-set.jpg" },
  { id: 25, name: "Подвеска Serpenti Viper, белое золото", brand: "Bvlgari", cat: "Аксессуары", gender: "f", price: 560000, styles: ["classic", "quiet"], occasions: ["evening"],         palette: ["light", "neutral"], tint: "#8d7c69", image: "img/bvlgari-viper-set.jpg" },
  { id: 26, name: "Часы Serpenti Tubogas, сталь и бриллианты", brand: "Bvlgari", cat: "Аксессуары", gender: "f", price: 1450000, styles: ["classic", "trend"], occasions: ["evening"],   palette: ["light", "neutral"], tint: "#93825e", image: "img/bvlgari-tubogas.jpg" },
  { id: 27, name: "Сумка Speedy Bandoulière 25", brand: "Louis Vuitton",  cat: "Сумки",          gender: "f", price: 310000, styles: ["classic", "trend"], occasions: ["daily", "work"],   palette: ["dark", "neutral"],  tint: "#5d4b3b", image: "img/lv-speedy.jpg" },
  { id: 28, name: "Сумка из кожи кавиар, бордо", brand: "Chanel",         cat: "Сумки",          gender: "f", price: 850000, styles: ["classic", "quiet"], occasions: ["evening", "work"], palette: ["dark", "bright"],   tint: "#5a2a30", image: "img/chanel-bordeaux.jpg" },
  { id: 29, name: "Сумка Chanel 22 mini",        brand: "Chanel",         cat: "Сумки",          gender: "f", price: 620000, styles: ["trend", "classic"], occasions: ["evening", "daily"],palette: ["dark", "neutral"],  tint: "#241a13", image: "img/chanel-22-mini.jpg" },
  { id: 30, name: "Мюли из замши",               brand: "Chanel",         cat: "Обувь",          gender: "f", price: 165000, styles: ["quiet", "classic"], occasions: ["daily", "work"],   palette: ["neutral", "light"], tint: "#8a7460", image: "img/chanel-mules.jpg" },
  { id: 31, name: "Колье-цепочка с логотипами CC", brand: "Chanel",       cat: "Аксессуары",     gender: "f", price: 280000, styles: ["classic", "trend"], occasions: ["evening", "daily"],palette: ["light", "neutral"], tint: "#93825e", image: "img/chanel-cc-chain.jpg" },
  { id: 32, name: "Сумка Evelyne III 29, чёрная", brand: "Hermès",        cat: "Сумки",          gender: "f", price: 720000, styles: ["quiet", "classic"], occasions: ["daily", "work"],   palette: ["dark", "neutral"],  tint: "#2e2013", image: "img/hermes-evelyne.jpg" },
  { id: 33, name: "Сумка Evelyne TPM, gold",     brand: "Hermès",         cat: "Сумки",          gender: "f", price: 460000, styles: ["quiet", "classic"], occasions: ["daily"],           palette: ["neutral"],          tint: "#8a5a34", image: "img/hermes-evelyne.jpg" },

  /* Корейские новинки — без подписи бренда; фото добавятся по мере съёмки */
  { id: 40, name: "Жакет оверсайз с мягкими плечами", brand: "", cat: "Новинки", gender: "f", price: 12990, styles: ["trend", "quiet"],   occasions: ["work", "daily"],   palette: ["neutral"],          tint: "#9c8a76" },
  { id: 41, name: "Юбка-миди плиссе",             brand: "", cat: "Новинки", gender: "f", price: 7990,  styles: ["trend", "classic"], occasions: ["daily", "work"],   palette: ["light", "neutral"], tint: "#b3a48c" },
  { id: 42, name: "Тренч с поясом, песочный",     brand: "", cat: "Новинки", gender: "f", price: 14990, styles: ["classic", "quiet"], occasions: ["daily", "work"],   palette: ["neutral", "light"], tint: "#a08b71" },
  { id: 43, name: "Рубашка объёмного кроя, белая", brand: "", cat: "Новинки", gender: "u", price: 5990, styles: ["quiet", "casual"],  occasions: ["daily", "work"],   palette: ["light"],            tint: "#c6b89e" },
  { id: 44, name: "Брюки палаццо со стрелками",   brand: "", cat: "Новинки", gender: "f", price: 8990,  styles: ["trend", "classic"], occasions: ["work", "evening"], palette: ["dark", "neutral"],  tint: "#54473c" },
  { id: 45, name: "Кардиган крупной вязки",       brand: "", cat: "Новинки", gender: "u", price: 9990,  styles: ["casual", "quiet"],  occasions: ["daily"],           palette: ["neutral", "light"], tint: "#8a7460" },
  { id: 46, name: "Платье-рубашка миди",          brand: "", cat: "Новинки", gender: "f", price: 10990, styles: ["quiet", "casual"],  occasions: ["daily", "work"],   palette: ["neutral"],          tint: "#7d6a58" },
  { id: 47, name: "Топ с драпировкой",            brand: "", cat: "Новинки", gender: "f", price: 4590,  styles: ["trend"],            occasions: ["evening", "daily"],palette: ["light", "bright"],  tint: "#b39b7e" },
  { id: 48, name: "Джемпер с высоким горлом",     brand: "", cat: "Новинки", gender: "u", price: 7590,  styles: ["quiet", "classic"], occasions: ["daily", "work"],   palette: ["dark", "neutral"],  tint: "#5b4a3c" },
  { id: 49, name: "Куртка-бомбер укороченная",    brand: "", cat: "Новинки", gender: "f", price: 11990, styles: ["trend", "casual"],  occasions: ["daily"],           palette: ["dark"],             tint: "#41332a" },
  { id: 50, name: "Джинсы wide-leg с высокой посадкой", brand: "", cat: "Новинки", gender: "f", price: 8590, styles: ["trend", "casual"], occasions: ["daily"],       palette: ["dark", "neutral"],  tint: "#4a3a2f" },
  { id: 51, name: "Жилет костюмный удлинённый",   brand: "", cat: "Новинки", gender: "f", price: 7990,  styles: ["trend", "quiet"],   occasions: ["work", "daily"],   palette: ["neutral", "dark"],  tint: "#6b5443" },
  { id: 52, name: "Пальто-халат из смесовой шерсти", brand: "", cat: "Новинки", gender: "f", price: 17990, styles: ["quiet", "classic"], occasions: ["work", "daily"], palette: ["neutral"],         tint: "#75634f" },
  { id: 53, name: "Свитшот оверсайз",             brand: "", cat: "Новинки", gender: "u", price: 5590,  styles: ["casual"],           occasions: ["daily", "sport"],  palette: ["neutral", "light"], tint: "#8d7c69" },
  { id: 54, name: "Юбка-карандаш из экокожи",     brand: "", cat: "Новинки", gender: "f", price: 6990,  styles: ["trend", "classic"], occasions: ["work", "evening"], palette: ["dark"],             tint: "#3c2f26" },
  { id: 55, name: "Блуза с бантом",               brand: "", cat: "Новинки", gender: "f", price: 6590,  styles: ["classic", "trend"], occasions: ["work", "evening"], palette: ["light"],            tint: "#c2ad90" },
  { id: 56, name: "Шорты-бермуды костюмные",      brand: "", cat: "Новинки", gender: "f", price: 5990,  styles: ["trend", "casual"],  occasions: ["daily", "work"],   palette: ["neutral", "light"], tint: "#ab9a83" },
  { id: 57, name: "Платье макси с открытой спиной", brand: "", cat: "Новинки", gender: "f", price: 12590, styles: ["trend"],          occasions: ["evening"],         palette: ["dark", "bright"],   tint: "#46362b" },
  { id: 58, name: "Лонгслив в рубчик",            brand: "", cat: "Новинки", gender: "u", price: 3990,  styles: ["casual", "quiet"],  occasions: ["daily", "sport"],  palette: ["neutral", "light"], tint: "#9c8a76" },
  { id: 59, name: "Двубортный блейзер в полоску", brand: "", cat: "Новинки", gender: "u", price: 13990, styles: ["classic", "trend"], occasions: ["work"],            palette: ["dark", "neutral"],  tint: "#35281f" },
];

const WHATSAPP = "79959170705";
const fmt = (n) => n.toLocaleString("ru-RU") + " ₽";

/* ============ Навигация ============ */
const navToggle = document.getElementById("nav-toggle");
const navMenu = document.getElementById("nav-menu");

navToggle.addEventListener("click", () => {
  const open = navMenu.classList.toggle("is-open");
  navToggle.classList.toggle("is-open", open);
  navToggle.setAttribute("aria-expanded", open);
});

navMenu.addEventListener("click", (e) => {
  if (e.target.closest("a")) {
    navMenu.classList.remove("is-open");
    navToggle.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  }
});

document.getElementById("year").textContent = new Date().getFullYear();

/* ============ Появление при скролле ============ */
const observer = new IntersectionObserver(
  (entries) => entries.forEach((en) => {
    if (en.isIntersecting) {
      en.target.classList.add("is-visible");
      observer.unobserve(en.target);
    }
  }),
  { threshold: 0.12 }
);
document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

/* ============ Витрина ============ */
const grid = document.getElementById("catalog-grid");
const filters = document.getElementById("catalog-filters");
const CATS = ["Все", ...new Set(PRODUCTS.map((p) => p.cat))];

function productCard(p) {
  const title = p.brand ? `${p.brand} — ${p.name}` : p.name;
  const msg = encodeURIComponent(`Здравствуйте! Интересует: ${title} (${fmt(p.price)}). Подскажите наличие и сроки.`);
  const media = p.image
    ? `<img class="product__img" src="${p.image}" alt="${title}" loading="lazy">`
    : `<div class="product__img product__img--tint" style="--tint:${p.tint}"><span>${p.brand || "FAY"}</span></div>`;
  return `
    <article class="product">
      ${media}
      <div class="product__body">
        ${p.brand ? `<p class="product__brand">${p.brand}</p>` : `<p class="product__brand">Новинка</p>`}
        <h3 class="product__name">${p.name}</h3>
        <div class="product__row">
          <span class="product__price">${fmt(p.price)}</span>
          <a class="product__ask" href="https://wa.me/${WHATSAPP}?text=${msg}" target="_blank" rel="noopener">Запросить →</a>
        </div>
      </div>
    </article>`;
}

function renderCatalog(cat) {
  const items = cat === "Все" ? PRODUCTS : PRODUCTS.filter((p) => p.cat === cat);
  grid.innerHTML = items.map(productCard).join("");
}

filters.innerHTML = CATS.map(
  (c, i) => `<button class="chip${i === 0 ? " is-active" : ""}" data-cat="${c}">${c}</button>`
).join("");

filters.addEventListener("click", (e) => {
  const btn = e.target.closest(".chip");
  if (!btn) return;
  filters.querySelectorAll(".chip").forEach((b) => b.classList.remove("is-active"));
  btn.classList.add("is-active");
  renderCatalog(btn.dataset.cat);
});

renderCatalog("Все");

/* ============ ИИ-стилист ============ */
const QUESTIONS = [
  {
    key: "gender",
    q: "Для кого подбираем образ?",
    options: [
      { label: "Для неё", value: "f" },
      { label: "Для него", value: "m" },
      { label: "Унисекс / не важно", value: "u" },
    ],
  },
  {
    key: "occasion",
    q: "Какой повод?",
    options: [
      { label: "На каждый день", value: "daily" },
      { label: "Работа и встречи", value: "work" },
      { label: "Вечер и событие", value: "evening" },
      { label: "Спорт и путешествия", value: "sport" },
    ],
  },
  {
    key: "style",
    q: "Что ближе по духу?",
    options: [
      { label: "Тихая роскошь", value: "quiet" },
      { label: "Классика", value: "classic" },
      { label: "Смелый тренд", value: "trend" },
      { label: "Кэжуал", value: "casual" },
    ],
  },
  {
    key: "budget",
    q: "Комфортный бюджет на вещь?",
    options: [
      { label: "До 60 000 ₽", value: 60000 },
      { label: "До 150 000 ₽", value: 150000 },
      { label: "До 300 000 ₽", value: 300000 },
      { label: "Без ограничений", value: Infinity },
    ],
  },
  {
    key: "palette",
    q: "Ваша палитра?",
    options: [
      { label: "Нейтральные оттенки", value: "neutral" },
      { label: "Глубокие тёмные", value: "dark" },
      { label: "Светлые, кремовые", value: "light" },
      { label: "Яркие акценты", value: "bright" },
    ],
  },
];

const STYLE_NAMES = { quiet: "тихая роскошь", classic: "классика", trend: "смелый тренд", casual: "кэжуал" };
const OCCASION_NAMES = { daily: "на каждый день", work: "для работы и встреч", evening: "для вечера", sport: "для спорта и путешествий" };

const quizEl = document.getElementById("quiz");
const thinkingEl = document.getElementById("thinking");
const resultEl = document.getElementById("result");
const qTitle = document.getElementById("quiz-question");
const qOptions = document.getElementById("quiz-options");
const qLabel = document.getElementById("quiz-step-label");
const qBar = document.getElementById("quiz-bar");
const qBack = document.getElementById("quiz-back");

let step = 0;
const answers = {};

function showQuestion() {
  const cur = QUESTIONS[step];
  qLabel.textContent = `Вопрос ${step + 1} из ${QUESTIONS.length}`;
  qBar.style.width = `${(step / QUESTIONS.length) * 100}%`;
  qTitle.textContent = cur.q;
  qOptions.innerHTML = cur.options
    .map((o) => `<button class="stylist__option" data-value="${o.value}">${o.label}</button>`)
    .join("");
  qBack.hidden = step === 0;
}

qOptions.addEventListener("click", (e) => {
  const btn = e.target.closest(".stylist__option");
  if (!btn) return;
  const cur = QUESTIONS[step];
  answers[cur.key] = cur.key === "budget" ? Number(btn.dataset.value) || Infinity : btn.dataset.value;
  step += 1;
  step < QUESTIONS.length ? showQuestion() : runStylist();
});

qBack.addEventListener("click", () => {
  if (step > 0) { step -= 1; showQuestion(); }
});

/* Локальный движок рекомендаций: скоринг по анкете.
   Точку расширения см. в README — сюда же подключается Claude API. */
function recommend(a) {
  return PRODUCTS
    .filter((p) => (a.gender === "u" || p.gender === a.gender || p.gender === "u") && p.price <= a.budget)
    .map((p) => {
      let score = 0;
      if (p.occasions.includes(a.occasion)) score += 3;
      if (p.styles.includes(a.style)) score += 3;
      if (p.palette.includes(a.palette)) score += 2;
      if (p.gender === a.gender) score += 1;
      return { ...p, score };
    })
    .filter((p) => p.score > 0)
    .sort((x, y) => y.score - x.score || x.price - y.price)
    .slice(0, 5);
}

const THINKING_STEPS = [
  "Анализирую вашу анкету…",
  "Сверяю палитру и силуэты…",
  "Отбираю вещи, прошедшие фильтрацию…",
  "Собираю образ…",
];

function runStylist() {
  qBar.style.width = "100%";
  quizEl.hidden = true;
  resultEl.hidden = true;
  thinkingEl.hidden = false;

  const textEl = document.getElementById("thinking-text");
  let i = 0;
  textEl.textContent = THINKING_STEPS[0];
  const timer = setInterval(() => {
    i += 1;
    if (i < THINKING_STEPS.length) {
      textEl.textContent = THINKING_STEPS[i];
    } else {
      clearInterval(timer);
      thinkingEl.hidden = true;
      showResult(recommend(answers));
    }
  }, 700);
}

function showResult(picks) {
  const titleEl = document.getElementById("result-title");
  const noteEl = document.getElementById("result-note");
  const picksEl = document.getElementById("result-picks");
  const totalEl = document.getElementById("result-total");
  const waEl = document.getElementById("result-wa");

  titleEl.textContent = `${STYLE_NAMES[answers.style]} — ${OCCASION_NAMES[answers.occasion]}`;

  if (!picks.length) {
    noteEl.textContent = "В витрине-превью не нашлось точного совпадения — но это не проблема: консьерж подберёт под ваш запрос вручную.";
    picksEl.innerHTML = "";
    totalEl.textContent = "";
    const msg = encodeURIComponent(
      `Здравствуйте! Прошёл(ла) ИИ-подбор на сайте: стиль — ${STYLE_NAMES[answers.style]}, повод — ${OCCASION_NAMES[answers.occasion]}. Помогите собрать образ.`
    );
    waEl.href = `https://wa.me/${WHATSAPP}?text=${msg}`;
  } else {
    noteEl.textContent = "Алгоритм отобрал эти позиции по вашему стилю, поводу, палитре и бюджету:";
    picksEl.innerHTML = picks.map(productCard).join("");
    const total = picks.reduce((s, p) => s + p.price, 0);
    totalEl.textContent = `Образ целиком: ${fmt(total)}`;
    const list = picks.map((p) => `• ${p.brand ? p.brand + " — " : ""}${p.name} (${fmt(p.price)})`).join("\n");
    const msg = encodeURIComponent(
      `Здравствуйте! ИИ-стилист на сайте собрал для меня подборку (${STYLE_NAMES[answers.style]}, ${OCCASION_NAMES[answers.occasion]}):\n${list}\nИтого: ${fmt(total)}. Подскажите наличие и сроки.`
    );
    waEl.href = `https://wa.me/${WHATSAPP}?text=${msg}`;
  }

  resultEl.hidden = false;
  resultEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

document.getElementById("result-restart").addEventListener("click", () => {
  step = 0;
  for (const k of Object.keys(answers)) delete answers[k];
  resultEl.hidden = true;
  quizEl.hidden = false;
  showQuestion();
});

showQuestion();

/* ============ Виртуальная примерка (бета) ============
   Фото пользователя + фото вещи отправляются в OpenAI gpt-image-1
   (images/edits). Ключ хранится только в localStorage владельца —
   для продакшена вынести вызов в серверный прокси (см. README). */
(function () {
  const fileInput = document.getElementById("tryon-file");
  if (!fileInput) return;

  const uploadBox = document.getElementById("tryon-upload");
  const preview = document.getElementById("tryon-preview");
  const uploadHint = document.getElementById("tryon-upload-hint");
  const itemsBox = document.getElementById("tryon-items");
  const goBtn = document.getElementById("tryon-go");
  const statusEl = document.getElementById("tryon-status");
  const resultBox = document.getElementById("tryon-result");
  const sendLink = document.getElementById("tryon-send");
  const keyBtn = document.getElementById("tryon-key");

  let userFile = null;
  let selected = null;

  /* вещи с фото — только их можно примерить */
  const wearable = PRODUCTS.filter((p) => p.image);
  itemsBox.innerHTML = wearable
    .map((p) => `<button class="tryon__item" data-id="${p.id}" title="${p.name}">
        <img src="${p.image}" alt="${p.name}" loading="lazy"><span>${p.name}</span>
      </button>`)
    .join("");

  itemsBox.addEventListener("click", (e) => {
    const btn = e.target.closest(".tryon__item");
    if (!btn) return;
    itemsBox.querySelectorAll(".tryon__item").forEach((b) => b.classList.remove("is-active"));
    btn.classList.add("is-active");
    selected = wearable.find((p) => p.id === Number(btn.dataset.id));
  });

  uploadBox.addEventListener("click", () => fileInput.click());
  fileInput.addEventListener("change", () => {
    userFile = fileInput.files[0] || null;
    if (userFile) {
      preview.src = URL.createObjectURL(userFile);
      preview.hidden = false;
      uploadHint.hidden = true;
    }
  });

  keyBtn.addEventListener("click", () => {
    const cur = localStorage.getItem("fay_ai_key") || "";
    const v = prompt("Ключ OpenAI API (хранится только в этом браузере):", cur);
    if (v !== null) {
      v ? localStorage.setItem("fay_ai_key", v.trim()) : localStorage.removeItem("fay_ai_key");
      setStatus(v ? "Ключ сохранён." : "Ключ удалён.");
    }
  });

  function setStatus(text) {
    statusEl.textContent = text;
    statusEl.hidden = !text;
  }

  goBtn.addEventListener("click", async () => {
    if (!userFile) return setStatus("Сначала загрузите своё фото.");
    if (!selected) return setStatus("Выберите вещь для примерки.");
    const key = localStorage.getItem("fay_ai_key");
    if (!key) {
      return setStatus("ИИ-примерка почти готова: осталось подключить ключ (кнопка «⚙ ключ ИИ»). А пока отправьте фото консьержу — подберём вручную.");
    }

    goBtn.disabled = true;
    setStatus("Генерируем образ — обычно 20–40 секунд…");
    resultBox.innerHTML = "<span class='tryon__spin'></span>";

    try {
      const itemBlob = await (await fetch(selected.image)).blob();
      const fd = new FormData();
      fd.append("model", "gpt-image-1");
      fd.append("image[]", userFile, "person.jpg");
      fd.append("image[]", itemBlob, "item.jpg");
      fd.append("prompt",
        `Надень на человека с первой фотографии вещь со второй фотографии (${selected.name}). ` +
        "Сохрани лицо, позу, фигуру и фон человека без изменений. Фотореалистичный результат, " +
        "естественная посадка вещи, освещение как на исходном фото.");
      fd.append("size", "1024x1536");

      const resp = await fetch("https://api.openai.com/v1/images/edits", {
        method: "POST",
        headers: { Authorization: "Bearer " + key },
        body: fd,
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error && data.error.message || resp.statusText);

      const b64 = data.data && data.data[0] && data.data[0].b64_json;
      if (!b64) throw new Error("Пустой ответ нейросети");
      resultBox.innerHTML = `<img src="data:image/png;base64,${b64}" alt="Ваш образ: ${selected.name}">`;
      setStatus("Готово! Если нравится — отправьте образ консьержу.");
      const msg = encodeURIComponent(`Здравствуйте! Примерила на сайте: ${selected.name} (${fmt(selected.price)}). Хочу обсудить заказ.`);
      sendLink.href = `https://wa.me/${WHATSAPP}?text=${msg}`;
      sendLink.hidden = false;
    } catch (err) {
      resultBox.innerHTML = "<span>Не получилось 🕊</span>";
      setStatus("Ошибка генерации: " + err.message + ". Проверьте ключ или попробуйте позже.");
    } finally {
      goBtn.disabled = false;
    }
  });
})();
