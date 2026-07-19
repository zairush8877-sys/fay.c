/* ============ Fay Concept — сдержанные люкс-микровзаимодействия ============
   Никаких частиц и симуляций: медленный зум фото (CSS), мягкий параллакс
   за курсором, фирменный курсор, деликатный наклон карточек. */

(function () {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = matchMedia("(pointer: fine)").matches;

  if (reduced) {
    document.body.classList.add("is-loaded");
    return;
  }

  /* ---------- Прелоадер со счётчиком ---------- */
  const pre = document.getElementById("preloader");
  if (pre) {
    const num = document.getElementById("preloader-num");
    let n = 0;
    const timer = setInterval(() => {
      n = Math.min(100, n + 3 + Math.floor(Math.random() * 6));
      num.textContent = n;
      if (n >= 100) {
        clearInterval(timer);
        setTimeout(() => {
          document.body.classList.add("is-loaded");
          setTimeout(() => pre.remove(), 1000);
        }, 220);
      }
    }, 42);
  } else {
    document.body.classList.add("is-loaded");
  }

  /* ---------- Прогресс чтения ---------- */
  const bar = document.createElement("div");
  bar.id = "progressbar";
  document.body.appendChild(bar);

  /* ---------- Заливка манифеста при скролле ---------- */
  const fill = document.getElementById("fillwords");
  let fillWords = [];
  if (fill) {
    fill.innerHTML = fill.textContent.trim().split(/\s+/)
      .map((w) => `<span class="w">${w}</span>`).join(" ");
    fillWords = Array.from(fill.querySelectorAll(".w"));
  }

  function onScroll() {
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.width = (max > 0 ? (scrollY / max) * 100 : 0) + "%";

    if (fillWords.length) {
      const r = fill.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (innerHeight * 0.82 - r.top) / (innerHeight * 0.6)));
      const upto = Math.floor(p * fillWords.length);
      fillWords.forEach((w, i) => w.classList.toggle("on", i < upto));
    }
  }
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Фото раскрываются шторкой ---------- */
  const shutter = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) {
        en.target.classList.add("is-shown");
        shutter.unobserve(en.target);
      }
    });
  }, { threshold: 0.25 });
  document.querySelectorAll(".order__img, .about__photo").forEach((el) => shutter.observe(el));

  /* ---------- Живой герой: кинолента + параллакс ---------- */
  const heroPhotoBox = document.querySelector(".hero__photo");
  const hero = document.querySelector(".hero");

  if (heroPhotoBox && hero && finePointer) {
    let tx = 0, ty = 0, cx = 0, cy = 0;
    hero.addEventListener("mousemove", (e) => {
      const r = hero.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width - 0.5) * -14;
      ty = ((e.clientY - r.top) / r.height - 0.5) * -10;
    }, { passive: true });
    hero.addEventListener("mouseleave", () => { tx = 0; ty = 0; });
    (function drift() {
      cx += (tx - cx) * 0.045;
      cy += (ty - cy) * 0.045;
      heroPhotoBox.style.translate = cx.toFixed(2) + "px " + cy.toFixed(2) + "px";
      requestAnimationFrame(drift);
    })();
  }

  if (heroPhotoBox) {
    const slides = Array.from(heroPhotoBox.querySelectorAll("img"));
    const captionEl = document.getElementById("hero-caption");
    const CAPTIONS = [
      "Bvlgari B.zero1 · из последних заказов",
      "Chanel 22 mini · под запрос за 9 дней",
      "Hermès Evelyne · две сразу, из бутика",
      "Cartier Tank Must · привезены из Европы",
      "Гардероб под клиента · curated-зона",
    ];
    let cur = 0;
    if (slides.length > 1) {
      setInterval(() => {
        const prev = slides[cur];
        cur = (cur + 1) % slides.length;
        const next = slides[cur];
        next.classList.toggle("zoom-out", cur % 2 === 1);
        next.classList.add("is-active");
        prev.classList.remove("is-active");
        if (captionEl) captionEl.textContent = CAPTIONS[cur] || "";
      }, 7000);
    }
  }

  /* ---------- 3D-кольцо коллекции ---------- */
  const ringBox = document.getElementById("ring3d");
  if (ringBox) initRing(ringBox);

  function initRing(box) {
    const stage = document.getElementById("ring3d-stage");
    const photos = [
      { src: "img/chanel-22-mini.jpg", cat: "Сумки" },
      { src: "img/cartier-tank.jpg", cat: "Аксессуары" },
      { src: "img/hermes-evelyne.jpg", cat: "Сумки" },
      { src: "img/bvlgari-viper-set.jpg", cat: "Аксессуары" },
      { src: "img/loewe-puzzle.jpg", cat: "Сумки" },
      { src: "img/chanel-bordeaux.jpg", cat: "Сумки" },
      { src: "img/bvlgari-tubogas.jpg", cat: "Аксессуары" },
      { src: "img/lv-speedy.jpg", cat: "Сумки" },
      { src: "img/chanel-mules.jpg", cat: "Обувь" },
      { src: "img/bvlgari-bzero1.jpg", cat: "Аксессуары" },
    ];
    const N = photos.length;

    stage.innerHTML = photos
      .map((p, i) => `<div class="ring3d__card" data-cat="${p.cat}" data-i="${i}"><img src="${p.src}" alt="" loading="lazy" draggable="false"></div>`)
      .join("");
    const cards = Array.from(stage.children);

    let theta = 0;          /* текущий угол кольца */
    let vel = 0.05;         /* авто-вращение, °/кадр */
    let dragging = false;
    let lastX = 0;
    let dragMoved = 0;

    function radius() {
      return Math.min(box.offsetWidth * 0.36, 480);
    }

    function frame() {
      if (!dragging) theta += vel;
      /* инерция затухает к авто-скорости */
      vel += (0.05 - vel) * 0.02;

      const R = radius();
      for (let i = 0; i < N; i++) {
        const a = ((i / N) * 360 + theta) * Math.PI / 180;
        const z = Math.cos(a);          /* -1 сзади … 1 спереди */
        const deg = (i / N) * 360 + theta;
        cards[i].style.transform =
          `rotateY(${deg}deg) translateZ(${R}px) scale(${0.82 + z * 0.18})`;
        cards[i].style.filter = `brightness(${0.45 + (z + 1) * 0.3})`;
        cards[i].style.zIndex = Math.round(z * 100) + 100;
        cards[i].style.opacity = z < -0.55 ? 0.35 : 1;
      }
      requestAnimationFrame(frame);
    }

    box.addEventListener("pointerdown", (e) => {
      dragging = true;
      dragMoved = 0;
      lastX = e.clientX;
      box.classList.add("is-dragging");
      box.setPointerCapture(e.pointerId);
    });

    box.addEventListener("pointermove", (e) => {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      lastX = e.clientX;
      dragMoved += Math.abs(dx);
      theta += dx * 0.25;
      vel = dx * 0.12; /* инерция после отпускания */
    });

    function endDrag() {
      dragging = false;
      box.classList.remove("is-dragging");
    }
    box.addEventListener("pointerup", (e) => {
      endDrag();
      /* клик без протяжки — открыть категорию в витрине */
      if (dragMoved < 6) {
        const card = e.target.closest(".ring3d__card");
        if (card) {
          const chip = document.querySelector(`.chip[data-cat="${card.dataset.cat}"]`);
          const catalog = document.getElementById("catalog");
          if (chip && catalog) {
            chip.click();
            catalog.scrollIntoView({ behavior: "smooth" });
          } else {
            /* страница коллекции: ведём на витрину главной */
            location.href = "index.html#catalog";
          }
        }
      }
    });
    box.addEventListener("pointercancel", endDrag);
    box.addEventListener("pointerleave", endDrag);

    requestAnimationFrame(frame);
  }

  /* ---------- Фирменный курсор ---------- */
  if (finePointer) {
    const dot = document.createElement("div");
    const ring = document.createElement("div");
    dot.className = "cursor-dot";
    ring.className = "cursor-ring";
    document.body.append(dot, ring);
    document.documentElement.classList.add("has-cursor");

    let rx = innerWidth / 2, ry = innerHeight / 2;
    let mx = rx, my = ry;

    addEventListener("mousemove", (e) => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px)`;
      const hot = e.target.closest && e.target.closest("a, button, summary, .chip, .stylist__option");
      ring.classList.toggle("is-hot", !!hot);
    }, { passive: true });

    (function follow() {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      ring.style.transform = `translate(${rx}px, ${ry}px)`;
      requestAnimationFrame(follow);
    })();
  }

  /* ---------- Деликатный наклон карточек ---------- */
  if (finePointer) {
    document.addEventListener("mousemove", (e) => {
      const card = e.target.closest && e.target.closest(".product, .card");
      if (!card) return;
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      card.style.transform =
        `perspective(800px) rotateX(${(0.5 - py) * 4}deg) rotateY(${(px - 0.5) * 5}deg) translateY(-3px)`;
      card.style.setProperty("--shine-x", (px * 100).toFixed(1) + "%");
      card.style.setProperty("--shine-y", (py * 100).toFixed(1) + "%");
    }, { passive: true });

    document.addEventListener("mouseout", (e) => {
      const card = e.target.closest && e.target.closest(".product, .card");
      if (card && !(e.relatedTarget && card.contains(e.relatedTarget))) {
        card.style.transform = "";
      }
    }, { passive: true });
  }

  /* ---------- Магнитные кнопки в герое ---------- */
  if (finePointer) {
    document.querySelectorAll(".hero .btn").forEach((btn) => {
      btn.addEventListener("mousemove", (e) => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        btn.style.transform = `translate(${x * 0.14}px, ${y * 0.22}px)`;
      });
      btn.addEventListener("mouseleave", () => { btn.style.transform = ""; });
    });
  }
})();
