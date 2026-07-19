/* ============ Fay Concept — сдержанные люкс-микровзаимодействия ============
   Никаких частиц и симуляций: медленный зум фото (CSS), мягкий параллакс
   за курсором, фирменный курсор, деликатный наклон карточек. */

(function () {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = matchMedia("(pointer: fine)").matches;

  if (reduced) return;

  /* ---------- Мягкий параллакс фото в герое ---------- */
  const heroPhoto = document.querySelector(".hero__photo img");
  const hero = document.querySelector(".hero");
  if (heroPhoto && hero && finePointer) {
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
      heroPhoto.style.translate = cx.toFixed(2) + "px " + cy.toFixed(2) + "px";
      requestAnimationFrame(drift);
    })();
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
