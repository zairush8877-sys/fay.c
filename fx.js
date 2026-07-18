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

    function setOpen(open) {
      stage.classList.toggle("is-open", open);
      toggle.textContent = open ? "Закрыть занавес" : "Распахнуть занавес";
    }

    if (reduced) {
      /* без анимаций: занавес сразу открыт, сцена освещена */
      setOpen(true);
      light.style.opacity = "0";
      return;
    }

    toggle.addEventListener("click", (e) => {
      e.stopPropagation();
      setOpen(!stage.classList.contains("is-open"));
    });

    stage.addEventListener("click", (e) => {
      if (!stage.classList.contains("is-open") && !e.target.closest(".stage__hint")) {
        setOpen(true);
      }
    });

    /* общий указатель: луч света + щель в занавесе */
    const pointer = { tx: 0.5, ty: 0.45, active: false };

    function moveLight(clientX, clientY) {
      const r = stage.getBoundingClientRect();
      const nx = (clientX - r.left) / r.width;
      const ny = (clientY - r.top) / r.height;
      light.style.setProperty("--lx", (nx * 100).toFixed(1) + "%");
      light.style.setProperty("--ly", (ny * 100).toFixed(1) + "%");
      pointer.tx = Math.min(1, Math.max(0, nx));
      pointer.ty = Math.min(1, Math.max(0, ny));
      pointer.active = true;
    }
    stage.addEventListener("mousemove", (e) => moveLight(e.clientX, e.clientY), { passive: true });
    stage.addEventListener("mouseleave", () => { pointer.active = false; });
    stage.addEventListener("touchmove", (e) => {
      const t0 = e.touches[0];
      if (t0) moveLight(t0.clientX, t0.clientY);
    }, { passive: true });
    stage.addEventListener("touchend", () => { pointer.active = false; }, { passive: true });

    if (curtainCanvas) initCurtain(stage, curtainCanvas, pointer);

    /* пыль, плавающая в луче */
    const ctx = dustCanvas.getContext("2d");
    let W = 0, H = 0, motes = [];

    function resizeDust() {
      W = stage.offsetWidth; H = stage.offsetHeight;
      const dpr = Math.min(devicePixelRatio || 1, 2);
      dustCanvas.width = W * dpr; dustCanvas.height = H * dpr;
      dustCanvas.style.width = W + "px"; dustCanvas.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      motes = Array.from({ length: 70 }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        r: 0.4 + Math.random() * 1.4,
        vx: (Math.random() - 0.5) * 0.18,
        vy: -0.05 - Math.random() * 0.22,
        tw: Math.random() * Math.PI * 2,
      }));
    }

    function dustFrame(t) {
      ctx.clearRect(0, 0, W, H);
      if (stage.classList.contains("is-open")) {
        const ls = getComputedStyle(light);
        const lx = parseFloat(ls.getPropertyValue("--lx")) / 100 * W || W / 2;
        const ly = parseFloat(ls.getPropertyValue("--ly")) / 100 * H || H / 2;
        for (const m of motes) {
          m.x += m.vx; m.y += m.vy; m.tw += 0.03;
          if (m.y < -4) { m.y = H + 4; m.x = Math.random() * W; }
          if (m.x < -4) m.x = W + 4;
          if (m.x > W + 4) m.x = -4;
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

  /* ---------- Театральный занавес: сырой WebGL, бархат со складками ----------
     Сетка вершин на весь занавес; профиль складок считается в вершинном шейдере
     в материальных координатах (при сжатии складки сгущаются сами собой).
     Щель под курсором — 1D-поле колонн с пружинами на CPU, в шейдер через
     RGBA-текстуру (R+A — 16-битное смещение, G — производная, B — подсветка). */
  function initCurtain(stage, canvas, pointer) {
    let gl = null;
    try {
      const opts = { alpha: true, premultipliedAlpha: true, antialias: false, depth: false, stencil: false };
      gl = canvas.getContext("webgl", opts) || canvas.getContext("experimental-webgl", opts);
    } catch (e) { gl = null; }
    if (!gl) { canvas.style.display = "none"; return; } /* фолбэк: CSS-занавес остаётся */

    const VERT = `
attribute vec2 aPos;
uniform sampler2D uGapTex;
uniform float uTime, uOpen, uMode, uSide;
uniform vec2 uPointer;
varying float vM, vV, vX, vZ, vSx, vSy, vComp, vGlow, vOC, vBand;

void main() {
  float u = aPos.x;
  float v = aPos.y;            /* по высоте, 0 — верх */
  float isP = uMode;           /* 1 — ламбрекен */

  /* полотно рисуется двумя половинами (uSide), с крошечным нахлёстом у шва —
     иначе квад через шов растягивается на весь проём при раскрытии */
  float m = isP > 0.5 ? u : mix(u * 0.502, 0.498 + 0.502 * u, uSide);
  float sideR = isP > 0.5 ? step(0.5, m) : uSide;   /* 1 — правая половина */

  vec4 g = texture2D(uGapTex, vec2(m, 0.5));
  float D    = ((g.r * 65280.0 + g.a * 255.0) / 65535.0 - 0.5) * 0.30;
  float dDdm = (g.g - 0.5) * 8.0;
  float glow = g.b;

  /* каскад раскрытия: колонны у среднего шва стартуют первыми */
  float dSeam = abs(m - 0.5) * 2.0;
  float oc = smoothstep(0.0, 1.0, clamp(uOpen * 1.35 - dSeam * 0.35, 0.0, 1.0)) * (1.0 - isP);

  /* вертикальный профиль щели: верх подвешен к штанге, максимум у курсора */
  float vprof = smoothstep(0.02, 0.30, v) * (0.40 + 0.60 * exp(-pow((v - uPointer.y) / 0.42, 2.0)));
  float gapMul = vprof * (1.0 - oc) * (1.0 - isP);

  /* стопки у краёв; overshoot пружины слегка поджимает их */
  float stack = 0.135 - 0.02 * clamp(uOpen - 1.0, 0.0, 1.0);
  float xOpen = mix(m * 2.0 * stack, 1.0 - (1.0 - m) * 2.0 * stack, sideR);
  float xClosed = m + D * gapMul;
  float x = mix(xClosed, xOpen, oc);

  /* локальное сжатие ткани: <1 — складки сбиты в кучу, >1 — растянута (щель) */
  float comp = mix(max(0.05, 1.0 + dDdm * gapMul), 2.0 * stack, oc);

  /* профиль складок: 3 частоты в материальных координатах + дыхание */
  float NF = mix(15.0, 32.0, isP);
  float breathe = (sin(uTime * 0.45 + v * 2.2) + 0.5 * sin(uTime * 0.23 + m * 4.0)) * 0.30 * (1.0 - isP);
  float ph = m * NF * 6.28318 + breathe;
  float p2 = ph * 2.17 + 1.7;
  float p3 = ph * 0.53 + uTime * 0.25;
  float zn  = 0.60 * sin(ph) + 0.27 * sin(p2) + 0.13 * sin(p3);
  float dzn = (0.60 * cos(ph) + 0.586 * cos(p2) + 0.069 * cos(p3)) * NF * 6.28318;

  float amp = mix(0.016, 0.006, isP) * (0.40 + 0.60 * v);
  amp *= 0.78 + 0.34 * sin(m * 14.4 + 1.0) * sin(m * 5.3 + v);  /* неровная драпировка */
  amp *= 1.0 + glow * 0.7 * (1.0 - oc) * (1.0 - isP);   /* у щели складки набухают */
  amp *= pow(1.0 / max(comp, 0.30), 0.30);              /* сжатая ткань — глубже рельеф */

  x += cos(ph) * amp * 0.22;

  /* волнистый подол, чуть приподнят над полом */
  float hem = smoothstep(0.70, 1.0, v) * (0.010 + 0.008 * sin(ph * 0.5 + uTime * 0.6)) * (1.0 - isP);
  float y = mix(v * (1.0 - hem), v * 0.105, isP);

  vM = m; vV = v; vX = x; vZ = zn;
  vSx = dzn * amp / max(comp, 0.22);
  vSy = zn * 0.12 + 0.06 * sin(uTime * 0.5 + m * 8.0);
  vComp = comp; vGlow = glow; vOC = oc;
  vBand = 0.55 + 0.45 * sin(x * 9.0 - uTime * 0.5 + uPointer.x * 2.5);
  gl_Position = vec4(x * 2.0 - 1.0, 1.0 - y * 2.0, 0.0, 1.0);
}`;

    const FRAG = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
varying float vM, vV, vX, vZ, vSx, vSy, vComp, vGlow, vOC, vBand;
uniform float uTime, uOpen, uMode, uGlowX, uQual;
uniform vec2 uPointer;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

void main() {
  vec3 N = normalize(vec3(-vSx, -vSy, 1.0));
  float fold = clamp(vZ * 0.5 + 0.5, 0.0, 1.0);

  /* бархат: шоколад в тени, бронза на гребнях */
  vec3 deep = vec3(0.09, 0.045, 0.025);
  vec3 mid  = vec3(0.27, 0.150, 0.078);
  vec3 hi   = vec3(0.46, 0.280, 0.150);
  vec3 alb = mix(deep, mid, smoothstep(0.0, 0.75, fold));
  alb = mix(alb, hi, smoothstep(0.72, 1.0, fold) * 0.65);

  /* тень от ламбрекена сверху, сумрак у пола */
  float vsh = 1.0;
  if (uMode < 0.5) {
    vsh = (0.70 + 0.30 * smoothstep(0.0, 0.22, vV)) * (1.0 - 0.20 * smoothstep(0.72, 1.0, vV));
  }

  /* тёплый ключевой сверху-спереди */
  vec3 L1 = normalize(vec3(0.25, 0.35, 0.90));
  float dif = max(dot(N, L1), 0.0);

  /* ворс бархата: широкий блик на скатах, полоса блика гуляет за курсором */
  float nz = 1.0 - abs(N.z);
  float sheen = nz * nz * vBand;

  /* золотой контровой из щели: ловят скаты, обращённые к разрыву */
  float sgn = uGlowX > vX ? 1.0 : -1.0;
  float facing = clamp(N.x * sgn, 0.0, 1.0);
  float rim = vGlow * (1.0 - vOC) * (0.12 + 0.85 * facing * facing) * (0.45 + 0.55 * fold) * (1.0 - uMode);

  /* при распахивании внутренние кромки вспыхивают светом сцены,
     а у собранных стопок кромка остаётся тронутой светом рампы */
  float P = sin(clamp(uOpen, 0.0, 1.0) * 3.14159);
  float seamProx = smoothstep(0.55, 1.0, 1.0 - abs(vM - 0.5) * 2.0);
  float sgn2 = vM < 0.5 ? 1.0 : -1.0;
  float toScene = clamp(N.x * sgn2, 0.0, 1.0);
  rim += (P * (0.20 + 0.8 * toScene) + vOC * seamProx * toScene * 0.30) * seamProx * (1.0 - uMode);

  /* AO: сбитые в стопку складки темнее внутри */
  float ao = mix(0.68, 1.0, clamp(vComp, 0.0, 1.0));
  ao *= 0.78 + 0.22 * fold;

  /* зерно и нить ткани — только на полном качестве */
  float th = 1.0, grain = 0.5;
  if (uQual > 0.5) {
    grain = hash(gl_FragCoord.xy * 0.7);
    th = 0.965 + 0.035 * sin(vX * 1600.0);
  }

  vec3 gold = vec3(1.0, 0.80, 0.47);
  vec3 col = alb * (0.25 + 1.05 * dif) * vsh * ao * th;
  col += vec3(0.82, 0.65, 0.42) * sheen * 0.30 * vsh;
  col += gold * rim * 0.8;
  col += (grain - 0.5) * 0.035;

  /* щель: ткань расходится, узкая кромка вспыхивает золотом */
  float alpha = 1.0;
  float part = smoothstep(1.30, 1.85, vComp) * (1.0 - vOC);
  float edge = part * (1.0 - part) * 4.0;
  col += gold * edge * edge * 0.55 * (0.4 + 0.6 * vGlow);
  alpha *= 1.0 - part;

  /* золотая коса на ведущих кромках (у шва и на стопках); гаснет раньше ткани,
     чтобы не оставлять пунктир в щели */
  float dSeam = abs(vM - 0.5) * 2.0;
  float lead = (1.0 - smoothstep(0.004, 0.014, dSeam)) * (1.0 - smoothstep(0.10, 0.45, part));
  col = mix(col, gold * (0.35 + 0.65 * dif), lead * 0.65 * (1.0 - uMode));

  if (uMode < 0.5) {
    /* золотая тесьма и бахрома по подолу */
    float trim = smoothstep(0.943, 0.949, vV) * (1.0 - smoothstep(0.957, 0.962, vV));
    col = mix(col, gold * (0.50 + 0.50 * dif), trim * 0.9);
    if (vV > 0.960) {
      float sw = sin(uTime * 1.4 + vX * 44.0 + vZ * 2.5) * 0.010;
      float str = fract((vX + sw) * 130.0);
      float strand = smoothstep(0.12, 0.30, str) * (1.0 - smoothstep(0.60, 0.80, str));
      alpha *= strand;
      col = mix(col, gold * (0.45 + 0.45 * dif) * (0.75 + 0.25 * sin(str * 12.0)), 0.85);
    }
  } else {
    /* ламбрекен: фестоны с золотым кантом */
    float sc = 1.0 - 0.30 * (0.5 + 0.5 * cos(vM * 6.28318 * 9.0));
    alpha *= 1.0 - smoothstep(sc - 0.05, sc, vV);
    float tr = smoothstep(sc - 0.16, sc - 0.06, vV);
    col = mix(col, gold * (0.50 + 0.50 * dif), tr * 0.8);
  }

  gl_FragColor = vec4(col * alpha, alpha);
}`;

    const VERT_GLOW = `
attribute vec2 aPos;
varying vec2 vUv;
void main() { vUv = aPos; gl_Position = vec4(aPos.x * 2.0 - 1.0, 1.0 - aPos.y * 2.0, 0.0, 1.0); }`;

    const FRAG_GLOW = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
varying vec2 vUv;
uniform float uTime, uOpen, uGlowS, uGlowX;

void main() {
  float op = clamp(uOpen, 0.0, 1.0);
  float dx = vUv.x - uGlowX;
  float I = uGlowS * (1.0 - smoothstep(0.15, 0.5, op));
  /* тёплый столб света из щели + пятно на полу */
  float shaft = exp(-dx * dx / 0.0016) * (0.25 + 0.75 * smoothstep(0.05, 0.95, vUv.y));
  float pool  = exp(-dx * dx / 0.020) * smoothstep(0.70, 1.0, vUv.y);
  float flick = 0.92 + 0.08 * sin(uTime * 2.1 + vUv.y * 4.0);
  /* вспышка по центру в момент распахивания */
  float P = sin(op * 3.14159);
  float cx = vUv.x - 0.5;
  float burst = exp(-cx * cx / 0.02) * P * P * (0.20 + 0.80 * smoothstep(0.2, 1.0, vUv.y));
  vec3 gold = vec3(1.0, 0.72, 0.40);
  vec3 col = gold * (shaft * 0.22 + pool * 0.40) * I * flick + gold * burst * 0.22;
  gl_FragColor = vec4(col, 0.0);   /* premultiplied: alpha 0 => аддитивный свет */
}`;

    function makeShader(type, src) {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) || "shader");
      return s;
    }
    function makeProgram(vs, fs) {
      const p = gl.createProgram();
      gl.attachShader(p, makeShader(gl.VERTEX_SHADER, vs));
      gl.attachShader(p, makeShader(gl.FRAGMENT_SHADER, fs));
      gl.linkProgram(p);
      if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p) || "link");
      return p;
    }

    let progC, progG;
    try {
      progC = makeProgram(VERT, FRAG);
      progG = makeProgram(VERT_GLOW, FRAG_GLOW);
    } catch (e) {
      console.warn("curtain webgl fallback:", e);
      canvas.style.display = "none";
      return;
    }
    stage.classList.add("stage--gl");   /* CSS-занавес больше не нужен */

    /* программный растеризатор (SwiftShader/llvmpipe) очень чувствителен
       к числу треугольников — там берём грубую сетку и низкое качество */
    let software = false;
    try {
      const dbg = gl.getExtension("WEBGL_debug_renderer_info");
      const rend = dbg ? String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL)) : "";
      software = /swiftshader|llvmpipe|softpipe|software|swangle/i.test(rend);
    } catch (e) { /* ignore */ }

    /* сетки: полотно (рисуется дважды — половины) и ламбрекен (низкий) */
    function makeGrid(cols, rows) {
      const verts = new Float32Array((cols + 1) * (rows + 1) * 2);
      let k = 0;
      for (let r = 0; r <= rows; r++)
        for (let c = 0; c <= cols; c++) { verts[k++] = c / cols; verts[k++] = r / rows; }
      const idx = new Uint16Array(cols * rows * 6);
      k = 0;
      for (let r = 0; r < rows; r++)
        for (let c = 0; c < cols; c++) {
          const a = r * (cols + 1) + c, b = a + 1, d = a + cols + 1, e2 = d + 1;
          idx[k++] = a; idx[k++] = d; idx[k++] = b;
          idx[k++] = b; idx[k++] = d; idx[k++] = e2;
        }
      const vb = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, vb);
      gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);
      const ib = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ib);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, idx, gl.STATIC_DRAW);
      return { vb: vb, ib: ib, count: idx.length };
    }
    const mesh = software ? makeGrid(72, 30) : makeGrid(150, 70);
    const pelmet = software ? makeGrid(90, 5) : makeGrid(170, 8);

    const quadBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]), gl.STATIC_DRAW);

    /* 1D-текстура состояния колонн */
    const N = 160;
    const gapTex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, gapTex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    const texData = new Uint8Array(N * 4);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, N, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, texData);

    const uC = {};
    ["uGapTex", "uTime", "uOpen", "uMode", "uSide", "uPointer", "uGlowX", "uQual"].forEach((n) => { uC[n] = gl.getUniformLocation(progC, n); });
    const aPosC = gl.getAttribLocation(progC, "aPos");
    const uG = {};
    ["uTime", "uOpen", "uGlowS", "uGlowX"].forEach((n) => { uG[n] = gl.getUniformLocation(progG, n); });
    const aPosG = gl.getAttribLocation(progG, "aPos");

    gl.disable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);

    /* пружины: раскрытие + колонны щели */
    const D = new Float32Array(N), Vel = new Float32Array(N), Glow = new Float32Array(N);
    let openV = 0, openVel = 0;
    let gx = 0.5, gy = 0.45, glowS = 0;

    function physics() {
      const target = stage.classList.contains("is-open") ? 1 : 0;
      openVel += (target - openV) * 0.016;   /* недодемпфировано: лёгкий overshoot */
      openVel *= 0.90;
      openV += openVel;

      gx += (pointer.tx - gx) * 0.16;
      gy += (pointer.ty - gy) * 0.16;

      const act = pointer.active && openV < 0.35 ? 1 : 0;
      const A = 0.085, R = 0.19, w = 0.045;
      let gs = 0;
      for (let i = 0; i < N; i++) {
        const xr = i / (N - 1);
        const dx = xr - gx;
        const fall = Math.exp(-(dx * dx) / (R * R));
        const T = act * A * Math.tanh(dx / w) * fall;
        const l = i > 0 ? D[i - 1] : D[i];
        const r0 = i < N - 1 ? D[i + 1] : D[i];
        Vel[i] += (T - D[i]) * 0.09 + (l + r0 - 2 * D[i]) * 0.25; /* связность ткани */
        Vel[i] *= 0.80;
        D[i] += Vel[i];
        const tight = Math.exp(-(dx * dx) / (R * R * 0.45));
        Glow[i] += (act * tight - Glow[i]) * 0.09;
        if (Glow[i] > gs) gs = Glow[i];
      }
      glowS = gs;

      for (let i = 0; i < N; i++) {
        const l = i > 0 ? D[i - 1] : D[i];
        const r0 = i < N - 1 ? D[i + 1] : D[i];
        const dDdm = (r0 - l) * (N - 1) / 2;
        const dv = Math.max(0, Math.min(65535, Math.round((D[i] / 0.30 + 0.5) * 65535)));
        texData[i * 4] = dv >> 8;
        texData[i * 4 + 3] = dv & 255;
        texData[i * 4 + 1] = Math.max(0, Math.min(255, Math.round((dDdm / 8 + 0.5) * 255)));
        texData[i * 4 + 2] = Math.max(0, Math.min(255, Math.round(Glow[i] * 255)));
      }
      gl.bindTexture(gl.TEXTURE_2D, gapTex);
      gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, N, 1, gl.RGBA, gl.UNSIGNED_BYTE, texData);
    }

    function draw(tSec) {
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clear(gl.COLOR_BUFFER_BIT);

      /* свет из щели — под тканью (пропускаем, когда света нет) */
      const P = Math.sin(Math.min(Math.max(openV, 0), 1) * Math.PI);
      if (glowS > 0.012 || P > 0.02) {
        gl.useProgram(progG);
        gl.uniform1f(uG.uTime, tSec);
        gl.uniform1f(uG.uOpen, openV);
        gl.uniform1f(uG.uGlowS, glowS);
        gl.uniform1f(uG.uGlowX, gx);
        gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf);
        gl.enableVertexAttribArray(aPosG);
        gl.vertexAttribPointer(aPosG, 2, gl.FLOAT, false, 0, 0);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      }

      /* две половины полотна + ламбрекен */
      gl.useProgram(progC);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, gapTex);
      gl.uniform1i(uC.uGapTex, 0);
      gl.uniform1f(uC.uTime, tSec);
      gl.uniform1f(uC.uOpen, openV);
      gl.uniform2f(uC.uPointer, gx, gy);
      gl.uniform1f(uC.uGlowX, gx);
      gl.uniform1f(uC.uQual, quality);
      gl.bindBuffer(gl.ARRAY_BUFFER, mesh.vb);
      gl.enableVertexAttribArray(aPosC);
      gl.vertexAttribPointer(aPosC, 2, gl.FLOAT, false, 0, 0);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.ib);
      gl.uniform1f(uC.uMode, 0);
      gl.uniform1f(uC.uSide, 0);
      gl.drawElements(gl.TRIANGLES, mesh.count, gl.UNSIGNED_SHORT, 0);
      gl.uniform1f(uC.uSide, 1);
      gl.drawElements(gl.TRIANGLES, mesh.count, gl.UNSIGNED_SHORT, 0);
      gl.uniform1f(uC.uMode, 1);
      gl.bindBuffer(gl.ARRAY_BUFFER, pelmet.vb);
      gl.vertexAttribPointer(aPosC, 2, gl.FLOAT, false, 0, 0);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, pelmet.ib);
      gl.drawElements(gl.TRIANGLES, pelmet.count, gl.UNSIGNED_SHORT, 0);
    }

    /* адаптивное внутреннее разрешение: на слабом/программном GL
       снижаем плотность пикселей, CSS-размер не меняется */
    let resScale = software ? 0.5 : 1;
    let quality = 1;
    function resize() {
      const dpr = Math.min(devicePixelRatio || 1, 2) * resScale;
      const w = stage.offsetWidth, h = stage.offsetHeight;
      canvas.width = Math.max(2, Math.round(w * dpr));
      canvas.height = Math.max(2, Math.round(h * dpr));
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
    }
    addEventListener("resize", resize);
    resize();

    /* одноразовая калибровка: медленный кадр => сразу вниз по разрешению */
    try {
      physics();
      gl.finish();
      const c0 = performance.now();
      draw(0.1);
      gl.finish();
      const cost = performance.now() - c0;
      if (cost > 120 && resScale > 0.35) { resScale = 0.35; quality = 0; resize(); }
    } catch (e) { /* ignore */ }

    /* не жжём GPU, пока сцена вне вьюпорта */
    let visible = true;
    if ("IntersectionObserver" in window) {
      new IntersectionObserver((es) => { visible = es[0].isIntersecting; }).observe(stage);
    }

    /* физика на фиксированном шаге 60 Гц — поведение не зависит от fps */
    let lastT = 0, acc = 0, dtEma = 1 / 60, framesSinceAdj = 0;
    (function loop(now) {
      const t = now / 1000;
      const dt = Math.min(Math.max(t - lastT, 0), 1.5);
      lastT = t;
      if (visible) {
        dtEma += (dt - dtEma) * 0.15;
        framesSinceAdj++;
        if (framesSinceAdj > 12 && dtEma > 0.045 && resScale > 0.35) {
          resScale = Math.max(0.35, resScale * 0.7);
          if (resScale <= 0.4) quality = 0;
          resize();
          framesSinceAdj = 0;
        }
        acc += dt;
        const STEP = 1 / 60;
        let n = 0;
        while (acc >= STEP && n < 90) { physics(); acc -= STEP; n++; }
        if (n === 90) acc = 0;
        draw(t);
      } else {
        acc = 0;
      }
      requestAnimationFrame(loop);
    })(0);
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
