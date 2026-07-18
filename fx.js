/* ============ Fay Concept — «жидкий шёлк» и микровзаимодействия ============
   Одна идея: тёмный герой как отрез шёлка, золотые нити текут по полю
   потоков, курсор — рука в ткани: закручивает нити и подсвечивает их. */

(function () {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = matchMedia("(pointer: fine)").matches;

  /* ---------- Шёлковое поле в герое ---------- */
  const canvas = document.getElementById("hero-canvas");
  if (canvas) initSilk(canvas);

  function initSilk(canvas) {
    const ctx = canvas.getContext("2d");
    const hero = canvas.parentElement;
    let W = 0, H = 0, dpr = 1;

    const GOLD = ["#c9a36a", "#a9885f", "#e8d5b5", "#8a5a34", "#b39b7e"];
    const pointer = { x: 0.5, y: 0.4, tx: 0.5, ty: 0.4, active: false, press: 0 };
    let particles = [];
    let pulses = [];
    let t = 0;

    function resize() {
      dpr = Math.min(devicePixelRatio || 1, 2);
      W = hero.offsetWidth; H = hero.offsetHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      canvas.style.width = W + "px"; canvas.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = "#241a13";
      ctx.fillRect(0, 0, W, H);
      const count = reduced ? 0 : Math.min(1600, Math.round((W * H) / 900));
      particles = Array.from({ length: count }, () => spawn());
    }

    function spawn() {
      return {
        x: Math.random() * W,
        y: Math.random() * H,
        px: 0, py: 0,
        speed: 0.6 + Math.random() * 1.4,
        width: 0.5 + Math.random() * 1.3,
        color: GOLD[(Math.random() * GOLD.length) | 0],
        life: 60 + Math.random() * 240,
      };
    }

    /* Дешёвый плавный шум из синусов — угол поля потоков */
    function field(x, y, t) {
      const s = 0.0016;
      return (
        Math.sin(x * s * 1.7 + t * 0.00021) +
        Math.cos(y * s * 1.3 - t * 0.00017) +
        Math.sin((x + y) * s * 0.8 + t * 0.00011) +
        Math.cos(Math.hypot(x - W / 2, y - H / 2) * s * 1.1 - t * 0.00013)
      ) * 0.9;
    }

    function frame(now) {
      t = now;
      /* лёгкое затухание — нити оставляют шлейф */
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "rgba(36, 26, 19, 0.055)";
      ctx.fillRect(0, 0, W, H);

      /* инерция курсора: ткань отвечает мягко, с запаздыванием */
      pointer.x += (pointer.tx - pointer.x) * 0.08;
      pointer.y += (pointer.ty - pointer.y) * 0.08;
      pointer.press *= 0.94;

      /* без мыши (телефон) — «невидимая рука» бродит сама */
      if (!pointer.active) {
        pointer.tx = 0.5 + 0.33 * Math.sin(t * 0.00023);
        pointer.ty = 0.42 + 0.26 * Math.sin(t * 0.00031 + 1.7);
      }
      const mx = pointer.x * W, my = pointer.y * H;
      const R = Math.min(W, H) * (0.22 + pointer.press * 0.1);

      ctx.globalCompositeOperation = "lighter";
      ctx.lineCap = "round";

      for (const p of particles) {
        p.px = p.x; p.py = p.y;
        const a = field(p.x, p.y, t);
        let vx = Math.cos(a) * p.speed;
        let vy = Math.sin(a) * p.speed;

        /* водоворот вокруг курсора + лёгкое притяжение */
        const dx = p.x - mx, dy = p.y - my;
        const d = Math.hypot(dx, dy);
        if (d < R && d > 0.001) {
          const f = (1 - d / R);
          const swirl = f * f * (3.2 + pointer.press * 4);
          vx += (-dy / d) * swirl - (dx / d) * f * 0.5;
          vy += (dx / d) * swirl - (dy / d) * f * 0.5;
        }

        p.x += vx; p.y += vy;
        p.life -= 1;

        if (p.x < -12 || p.x > W + 12 || p.y < -12 || p.y > H + 12 || p.life <= 0) {
          Object.assign(p, spawn());
          continue;
        }

        const near = d < R ? (1 - d / R) : 0;
        ctx.strokeStyle = p.color;
        ctx.globalAlpha = 0.10 + near * 0.35;
        ctx.lineWidth = p.width + near * 1.1;
        ctx.beginPath();
        ctx.moveTo(p.px, p.py);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
      }

      /* волны от клика */
      ctx.globalCompositeOperation = "source-over";
      pulses = pulses.filter((pl) => pl.a > 0.01);
      for (const pl of pulses) {
        pl.r += 7; pl.a *= 0.94;
        ctx.strokeStyle = "rgba(232, 213, 181," + pl.a.toFixed(3) + ")";
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(pl.x, pl.y, pl.r, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.globalAlpha = 1;
      requestAnimationFrame(frame);
    }

    function setPointer(clientX, clientY) {
      const rect = hero.getBoundingClientRect();
      pointer.tx = (clientX - rect.left) / rect.width;
      pointer.ty = (clientY - rect.top) / rect.height;
      pointer.active = true;
    }

    hero.addEventListener("mousemove", (e) => setPointer(e.clientX, e.clientY));
    hero.addEventListener("mouseleave", () => { pointer.active = false; });
    hero.addEventListener("touchmove", (e) => {
      const t0 = e.touches[0];
      if (t0) setPointer(t0.clientX, t0.clientY);
    }, { passive: true });
    hero.addEventListener("pointerdown", (e) => {
      const rect = hero.getBoundingClientRect();
      pulses.push({ x: e.clientX - rect.left, y: e.clientY - rect.top, r: 6, a: 0.5 });
      pointer.press = 1;
    });

    addEventListener("resize", resize);
    resize();

    if (reduced) {
      /* статичный кадр: мягкий градиент вместо анимации */
      const g = ctx.createRadialGradient(W * 0.7, H * 0.3, 0, W * 0.7, H * 0.3, Math.max(W, H));
      g.addColorStop(0, "#3f2f24");
      g.addColorStop(1, "#241a13");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
    } else {
      requestAnimationFrame(frame);
    }
  }

  /* ---------- Примерочная: занавес и закулисье ---------- */
  const stage = document.getElementById("stage");
  if (stage) initStage(stage);

  function initStage(stage) {
    const toggle = document.getElementById("stage-toggle");
    const light = document.getElementById("stage-light");
    const dustCanvas = document.getElementById("dust-canvas");
    const curtainCanvas = document.getElementById("curtain-canvas");

    let openTarget = 0; /* 0 — закрыт, 1 — распахнут */

    function setOpen(open) {
      openTarget = open ? 1 : 0;
      stage.classList.toggle("is-open", open);
      toggle.textContent = open ? "Закрыть занавес" : "Распахнуть занавес";
    }

    if (reduced) {
      /* без анимаций: занавес сразу открыт, сцена освещена */
      curtainCanvas.style.display = "none";
      setOpen(true);
      light.style.opacity = "0";
      return;
    }

    /* ---- Ткань занавеса: полосы-складки на пружинах ---- */
    const cctx = curtainCanvas.getContext("2d");
    const off = document.createElement("canvas");
    const SW = 7;               /* ширина полосы, css px */
    let W = 0, H = 0, strips = 0;
    let cur = [], vel = [];
    let openNow = 0;            /* плавное состояние раскрытия */
    const mouse = { x: -1e4, y: 0, inside: false };

    function paintPattern() {
      off.width = W; off.height = H;
      const c = off.getContext("2d");
      const fold = 26;
      for (let x = 0; x < W; x += fold) {
        const g = c.createLinearGradient(x, 0, x + fold, 0);
        g.addColorStop(0, "#2b190c");
        g.addColorStop(0.35, "#6b4223");
        g.addColorStop(0.55, "#59371f");
        g.addColorStop(1, "#311d0e");
        c.fillStyle = g;
        c.fillRect(x, 0, fold, H);
      }
      /* тень сверху и снизу */
      let g = c.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, "rgba(0,0,0,0.4)");
      g.addColorStop(0.14, "rgba(0,0,0,0)");
      g.addColorStop(0.82, "rgba(0,0,0,0)");
      g.addColorStop(1, "rgba(0,0,0,0.45)");
      c.fillStyle = g;
      c.fillRect(0, 0, W, H);
      /* золотая бахрома */
      c.fillStyle = "#c9a36a";
      for (let x = 2; x < W; x += 11) c.fillRect(x, H - 15, 5, 15);
    }

    function resizeCurtain() {
      W = stage.offsetWidth; H = stage.offsetHeight;
      const dpr = Math.min(devicePixelRatio || 1, 2);
      curtainCanvas.width = W * dpr; curtainCanvas.height = H * dpr;
      curtainCanvas.style.width = W + "px"; curtainCanvas.style.height = H + "px";
      cctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      strips = Math.ceil(W / SW) + 1;
      cur = new Float32Array(strips);
      vel = new Float32Array(strips);
      paintPattern();
    }

    function curtainFrame(t) {
      openNow += (openTarget - openNow) * 0.045;
      const center = W / 2;
      const sigma = Math.max(90, W * 0.09);
      const AMP = Math.min(190, W * 0.22);

      for (let i = 0; i < strips; i++) {
        const xi = i * SW + SW / 2;
        const side = xi < center ? -1 : 1;
        /* полное раскрытие: полосы уезжают к краям и собираются в стопку */
        let target = openNow * side * ((side < 0 ? xi : W - xi) * 0.94);
        /* распахивание тканью под курсором */
        if (mouse.inside && openNow < 0.7) {
          const dx = xi - mouse.x;
          const gs = Math.exp(-(dx * dx) / (2 * sigma * sigma));
          target += Math.sign(dx || 1) * gs * AMP * (1 - openNow);
        }
        /* дыхание ткани в покое */
        target += Math.sin(t * 0.0011 + xi * 0.02) * 3 * (1 - openNow);

        vel[i] = (vel[i] + (target - cur[i]) * 0.07) * 0.84;
        cur[i] += vel[i];
      }

      cctx.clearRect(0, 0, W, H);
      for (let i = 0; i < strips; i++) {
        const sx = i * SW;
        const bob = Math.sin(t * 0.0016 + i * 0.4) * 1.3 * (1 - openNow);
        cctx.drawImage(off, sx, 0, SW, H, sx + cur[i], bob, SW, H);
      }
      requestAnimationFrame(curtainFrame);
    }

    stage.addEventListener("mousemove", (e) => {
      const r = stage.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
      mouse.inside = true;
    }, { passive: true });
    stage.addEventListener("mouseleave", () => { mouse.inside = false; mouse.x = -1e4; });
    stage.addEventListener("touchmove", (e) => {
      const t0 = e.touches[0];
      if (!t0) return;
      const r = stage.getBoundingClientRect();
      mouse.x = t0.clientX - r.left;
      mouse.inside = true;
    }, { passive: true });
    stage.addEventListener("touchend", () => { mouse.inside = false; mouse.x = -1e4; });

    toggle.addEventListener("click", (e) => {
      e.stopPropagation();
      setOpen(openTarget === 0);
    });

    stage.addEventListener("click", (e) => {
      if (openTarget === 0 && !e.target.closest(".stage__hint")) setOpen(true);
    });

    addEventListener("resize", resizeCurtain);
    resizeCurtain();
    requestAnimationFrame(curtainFrame);

    /* луч света за курсором/пальцем */
    function moveLight(clientX, clientY) {
      const r = stage.getBoundingClientRect();
      light.style.setProperty("--lx", ((clientX - r.left) / r.width * 100).toFixed(1) + "%");
      light.style.setProperty("--ly", ((clientY - r.top) / r.height * 100).toFixed(1) + "%");
    }
    stage.addEventListener("mousemove", (e) => moveLight(e.clientX, e.clientY), { passive: true });
    stage.addEventListener("touchmove", (e) => {
      const t0 = e.touches[0];
      if (t0) moveLight(t0.clientX, t0.clientY);
    }, { passive: true });

    /* пыль, плавающая в луче */
    const ctx = dustCanvas.getContext("2d");
    let DW = 0, DH = 0, motes = [];

    function resizeDust() {
      DW = stage.offsetWidth; DH = stage.offsetHeight;
      const dpr = Math.min(devicePixelRatio || 1, 2);
      dustCanvas.width = DW * dpr; dustCanvas.height = DH * dpr;
      dustCanvas.style.width = DW + "px"; dustCanvas.style.height = DH + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      motes = Array.from({ length: 70 }, () => ({
        x: Math.random() * DW,
        y: Math.random() * DH,
        r: 0.4 + Math.random() * 1.4,
        vx: (Math.random() - 0.5) * 0.18,
        vy: -0.05 - Math.random() * 0.22,
        tw: Math.random() * Math.PI * 2,
      }));
    }

    function dustFrame(t) {
      ctx.clearRect(0, 0, DW, DH);
      if (stage.classList.contains("is-open")) {
        const ls = getComputedStyle(light);
        const lx = parseFloat(ls.getPropertyValue("--lx")) / 100 * DW || DW / 2;
        const ly = parseFloat(ls.getPropertyValue("--ly")) / 100 * DH || DH / 2;
        for (const m of motes) {
          m.x += m.vx; m.y += m.vy; m.tw += 0.03;
          if (m.y < -4) { m.y = DH + 4; m.x = Math.random() * DW; }
          if (m.x < -4) m.x = DW + 4;
          if (m.x > DW + 4) m.x = -4;
          const d = Math.hypot(m.x - lx, m.y - ly);
          const glow = Math.max(0, 1 - d / 280);
          const a = (0.06 + glow * 0.5) * (0.6 + 0.4 * Math.sin(m.tw));
          ctx.fillStyle = "rgba(232, 213, 181," + a.toFixed(3) + ")";
          ctx.beginPath();
          ctx.arc(m.x, m.y, m.r + glow, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      requestAnimationFrame(dustFrame);
    }

    addEventListener("resize", resizeDust);
    resizeDust();
    requestAnimationFrame(dustFrame);
  }

  if (reduced) return;

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

  /* ---------- Наклон карточек за курсором ---------- */
  if (finePointer) {
    document.addEventListener("mousemove", (e) => {
      const card = e.target.closest && e.target.closest(".product, .card");
      if (!card) return;
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      card.style.transform =
        `perspective(700px) rotateX(${(0.5 - py) * 7}deg) rotateY(${(px - 0.5) * 9}deg) translateY(-4px)`;
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
        btn.style.transform = `translate(${x * 0.18}px, ${y * 0.3}px)`;
      });
      btn.addEventListener("mouseleave", () => { btn.style.transform = ""; });
    });
  }
})();
