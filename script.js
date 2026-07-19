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
  { id: 13, name: "Сумка Puzzle",                brand: "Loewe",          cat: "Сумки",          gender: "f", price: 295000, styles: ["trend", "classic"], occasions: ["daily", "evening"],palette: ["neutral", "bright"],tint: "#a08b71" },
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
  const msg = encodeURIComponent(`Здравствуйте! Интересует: ${p.brand} — ${p.name} (${fmt(p.price)}). Подскажите наличие и сроки.`);
  const media = p.image
    ? `<img class="product__img" src="${p.image}" alt="${p.brand} — ${p.name}" loading="lazy">`
    : `<div class="product__img product__img--tint" style="--tint:${p.tint}"><span>${p.brand}</span></div>`;
  return `
    <article class="product">
      ${media}
      <div class="product__body">
        <p class="product__brand">${p.brand}</p>
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
    const list = picks.map((p) => `• ${p.brand} — ${p.name} (${fmt(p.price)})`).join("\n");
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
