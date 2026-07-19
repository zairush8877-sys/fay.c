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

  /* ---------- Закулисье: настоящее фото под вуалью темноты ----------
     Фото скрыто почти непрозрачной «вуалью»; курсор — луч фонарика с живой,
     колышущейся кромкой: стирает вуаль по пути, темнота медленно затягивается
     позади. Клик — волна света раскрывает снимок целиком. */
  const stage = document.getElementById("stage");
  if (stage) initStage(stage);

  function initStage(stage) {
    const toggle = document.getElementById("stage-toggle");
    const light = document.getElementById("stage-light");
    const dustCanvas = document.getElementById("dust-canvas");
    const veilCanvas = document.getElementById("curtain-canvas");

    let open = false;

    function setOpen(o) {
      open = o;
      stage.classList.toggle("is-open", o);
      toggle.textContent = o ? "Скрыть" : "Показать всё";
    }

    if (reduced) {
      veilCanvas.style.display = "none";
      setOpen(true);
      light.style.opacity = "0";
      return;
    }

    /* указатель с инерцией — луч чуть отстаёт от руки */
    const pt = { x: 0.5, y: 0.45, tx: 0.5, ty: 0.45, active: false, speed: 0 };

    function movePointer(clientX, clientY) {
      const r = stage.getBoundingClientRect();
      const nx = Math.min(1, Math.max(0, (clientX - r.left) / r.width));
      const ny = Math.min(1, Math.max(0, (clientY - r.top) / r.height));
      light.style.setProperty("--lx", (nx * 100).toFixed(1) + "%");
      light.style.setProperty("--ly", (ny * 100).toFixed(1) + "%");
      pt.tx = nx; pt.ty = ny;
      pt.active = true;
    }

    stage.addEventListener("mousemove", (e) => movePointer(e.clientX, e.clientY), { passive: true });
    stage.addEventListener("mouseleave", () => { pt.active = false; });
    stage.addEventListener("touchmove", (e) => {
      const t0 = e.touches[0];
      if (t0) movePointer(t0.clientX, t0.clientY);
    }, { passive: true });
    stage.addEventListener("touchend", () => { pt.active = false; }, { passive: true });

    /* ---- вуаль ---- */
    const ctx = veilCanvas.getContext("2d");
    let W = 0, H = 0;
    const trail = [];      /* пятна света, тающие позади курсора */
    let wave = null;       /* волна полного раскрытия */
    let closing = 0;       /* кадры затягивания темноты при закрытии */

    function paintVeil(alpha) {
      ctx.globalCompositeOperation = "source-over";
      const g = ctx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.2, W / 2, H / 2, Math.max(W, H) * 0.75);
      g.addColorStop(0, "rgba(18, 11, 6," + alpha + ")");
      g.addColorStop(1, "rgba(10, 6, 3," + alpha + ")");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
    }

    function resizeVeil() {
      W = stage.offsetWidth; H = stage.offsetHeight;
      const dpr = Math.min(devicePixelRatio || 1, 2);
      veilCanvas.width = W * dpr; veilCanvas.height = H * dpr;
      veilCanvas.style.width = W + "px"; veilCanvas.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!open) paintVeil(1);
    }

    /* жидкая кромка: контур из 26 точек с шумом по углу */
    function blobPath(x, y, r, t, seed) {
      ctx.beginPath();
      for (let i = 0; i <= 26; i++) {
        const a = (i / 26) * Math.PI * 2;
        const w = 1 +
          0.14 * Math.sin(a * 3 + t * 0.0021 + seed) +
          0.09 * Math.sin(a * 5 - t * 0.0032 + seed * 2.7) +
          0.05 * Math.sin(a * 8 + t * 0.0013);
        const rr = r * w;
        const px = x + Math.cos(a) * rr;
        const py = y + Math.sin(a) * rr * 0.92;
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.closePath();
    }

    function eraseBlob(x, y, r, t, seed, alpha) {
      ctx.globalCompositeOperation = "destination-out";
      const g = ctx.createRadialGradient(x, y, r * 0.25, x, y, r);
      g.addColorStop(0, "rgba(0,0,0," + alpha + ")");
      g.addColorStop(0.75, "rgba(0,0,0," + (alpha * 0.55).toFixed(3) + ")");
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      blobPath(x, y, r, t, seed);
      ctx.fill();
    }

    function goldRim(x, y, r, t, seed, alpha) {
      ctx.globalCompositeOperation = "lighter";
      ctx.strokeStyle = "rgba(201, 163, 106," + alpha.toFixed(3) + ")";
      ctx.lineWidth = 10;
      ctx.shadowColor = "rgba(232, 213, 181, 0.9)";
      ctx.shadowBlur = 26;
      blobPath(x, y, r * 1.02, t, seed);
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    function startWave(nx, ny) {
      wave = { x: nx * W, y: ny * H, r: 20, target: Math.hypot(W, H) * 1.1 };
    }

    toggle.addEventListener("click", (e) => {
      e.stopPropagation();
      if (!open) { startWave(pt.x, pt.y); setOpen(true); }
      else { setOpen(false); closing = 60; wave = null; trail.length = 0; }
    });

    stage.addEventListener("click", (e) => {
      if (open || e.target.closest(".stage__hint")) return;
      const r = stage.getBoundingClientRect();
      startWave((e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height);
      setOpen(true);
    });

    function veilFrame(t) {
      pt.speed = Math.hypot(pt.tx - pt.x, pt.ty - pt.y);
      pt.x += (pt.tx - pt.x) * 0.14;
      pt.y += (pt.ty - pt.y) * 0.14;

      if (closing > 0) {
        paintVeil(0.09);
        closing -= 1;
        if (closing === 0) paintVeil(1);
      } else if (!open) {
        /* темнота медленно затягивается позади луча */
        paintVeil(0.055);

        if (pt.active) {
          const base = Math.min(W, H) * 0.17;
          const r = base * (1 + Math.min(1.2, pt.speed * 9));
          trail.push({ x: pt.x * W, y: pt.y * H, r, life: 1, seed: t * 0.001 % 10 });
          if (trail.length > 34) trail.shift();
        }

        for (const tr of trail) {
          tr.life *= 0.955;
          eraseBlob(tr.x, tr.y, tr.r * (0.55 + 0.45 * tr.life), t, tr.seed, Math.min(1, tr.life * 1.4));
        }
        while (trail.length && trail[0].life < 0.06) trail.shift();

        /* золотая кромка на голове луча */
        if (pt.active && trail.length) {
          const head = trail[trail.length - 1];
          goldRim(head.x, head.y, head.r * 0.92, t, head.seed, 0.16);
        }
      }

      if (wave) {
        wave.r += (wave.target - wave.r) * 0.055 + 7;
        eraseBlob(wave.x, wave.y, wave.r, t, 3.3, 1);
        goldRim(wave.x, wave.y, wave.r, t, 3.3, 0.2);
        if (wave.r >= wave.target * 0.99) {
          wave = null;
          ctx.clearRect(0, 0, W, H);
        }
      } else if (open && closing === 0) {
        ctx.clearRect(0, 0, W, H);
      }

      requestAnimationFrame(veilFrame);
    }

    addEventListener("resize", resizeVeil);
    resizeVeil();
    requestAnimationFrame(veilFrame);

    /* ---- пыль в луче света поверх фото ---- */
    const dctx = dustCanvas.getContext("2d");
    let DW = 0, DH = 0, motes = [];

    function resizeDust() {
      DW = stage.offsetWidth; DH = stage.offsetHeight;
      const dpr = Math.min(devicePixelRatio || 1, 2);
      dustCanvas.width = DW * dpr; dustCanvas.height = DH * dpr;
      dustCanvas.style.width = DW + "px"; dustCanvas.style.height = DH + "px";
      dctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      motes = Array.from({ length: 60 }, () => ({
        x: Math.random() * DW,
        y: Math.random() * DH,
        r: 0.4 + Math.random() * 1.3,
        vx: (Math.random() - 0.5) * 0.16,
        vy: -0.05 - Math.random() * 0.2,
        tw: Math.random() * Math.PI * 2,
      }));
    }

    function dustFrame() {
      dctx.clearRect(0, 0, DW, DH);
      const lx = pt.x * DW, ly = pt.y * DH;
      for (const m of motes) {
        m.x += m.vx; m.y += m.vy; m.tw += 0.03;
        if (m.y < -4) { m.y = DH + 4; m.x = Math.random() * DW; }
        if (m.x < -4) m.x = DW + 4;
        if (m.x > DW + 4) m.x = -4;
        const d = Math.hypot(m.x - lx, m.y - ly);
        const glow = Math.max(0, 1 - d / 300);
        const a = (0.03 + glow * 0.4) * (0.6 + 0.4 * Math.sin(m.tw));
        dctx.fillStyle = "rgba(232, 213, 181," + a.toFixed(3) + ")";
        dctx.beginPath();
        dctx.arc(m.x, m.y, m.r + glow, 0, Math.PI * 2);
        dctx.fill();
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
