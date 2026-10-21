/* Motion layer (styles in global.css, "fx" section):
   - cards: edge glow follows the cursor, springy 3D tilt; buttons: magnetic pull
   - circuit-board background that lights up around the cursor (static trace layer + a live layer that only
     repaints small dirty rects, runs at the display's refresh rate, 120 Hz included; idle-loaded)
   - decorative CSS loops pause while off-screen
   - theme switch (HUD dark ↔ Retro-Tech light) with a circular reveal
   - scroll reveals, local clock, easter egg ↑↑↓↓←→←→BA
   Touch screens get the looks without tilt / magnet; reduced motion turns the motion off. */
const doc = document.documentElement;
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
const CARD = ".card, .proj, .tile, .polaroid";
const MAG = ".btn, .theme, .langs a, .links a";

/* ---------- theme ---------- */
const themeBtn = document.querySelector(".theme");
function setTheme(next, from) {
  const apply = () => {
    doc.dataset.theme = next;
    try { localStorage.setItem("theme", next); } catch (e) {}
    BG?.colors();
  };
  if (!document.startViewTransition || reduce) return apply();
  const r = from?.getBoundingClientRect() ?? { left: innerWidth - 40, top: 30, width: 0, height: 0 };
  const x = r.left + r.width / 2, y = r.top + r.height / 2;
  const R = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  document.startViewTransition(apply).ready.then(() => {
    doc.animate({ clipPath: [`circle(0 at ${x}px ${y}px)`, `circle(${R}px at ${x}px ${y}px)`] },
                { duration: 750, easing: "cubic-bezier(.2,.7,.2,1)", pseudoElement: "::view-transition-new(root)" });
  }).catch(() => {});
}
themeBtn?.addEventListener("click", () => setTheme(doc.dataset.theme === "light" ? "dark" : "light", themeBtn));

/* ---------- reveal on scroll (staggered inside a group) ---------- */
const els = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
  }, { rootMargin: "0px 0px -8% 0px" });
  els.forEach((el) => {
    const sib = el.parentElement ? [...el.parentElement.children].filter((c) => c.classList.contains("reveal")) : [];
    el.style.setProperty("--d", String(Math.max(0, sib.indexOf(el))));
    io.observe(el);
  });
} else els.forEach((el) => el.classList.add("in"));

/* ---------- local time tile ---------- */
const clock = document.querySelectorAll("[data-clock]");
if (clock.length) {
  const fmt = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Berlin", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
  const tick = () => { const s = fmt.format(new Date()); clock.forEach((c) => (c.textContent = s)); };
  tick(); setInterval(tick, 1000);
}

/* ---------- springs: tilt (rx, ry, lift) + magnet (x, y), one rAF loop ---------- */
const S = new Map();
let raf = 0, last = 0;
const K = 190, C = 17;
function want(el, kind, tgt) {
  let s = S.get(el);
  if (!s) { s = { kind, v: tgt.map(() => 0), vel: tgt.map(() => 0), tgt }; S.set(el, s); el.classList.add(kind === "tilt" ? "fx-tilting" : "fx-mag"); }
  s.tgt = tgt;
  if (!raf) { last = 0; raf = requestAnimationFrame(loop); }
}
function loop(now) {
  const dt = last ? Math.min(0.032, (now - last) / 1000) : 1 / 120; last = now;
  for (const [el, s] of S) {
    let moving = false;
    for (let i = 0; i < s.v.length; i++) {
      const a = K * (s.tgt[i] - s.v[i]) - C * s.vel[i];
      s.vel[i] += a * dt; s.v[i] += s.vel[i] * dt;
      if (Math.abs(s.vel[i]) > 0.01 || Math.abs(s.tgt[i] - s.v[i]) > 0.01) moving = true;
    }
    if (s.kind === "tilt") el.style.transform = `perspective(1100px) rotateX(${s.v[0].toFixed(2)}deg) rotateY(${s.v[1].toFixed(2)}deg) translateY(${s.v[2].toFixed(2)}px)`;
    else el.style.translate = `${s.v[0].toFixed(2)}px ${s.v[1].toFixed(2)}px`;
    if (!moving && s.tgt.every((t) => t === 0)) {   // at rest: hand the element back to CSS
      if (s.kind === "tilt") { el.style.transform = ""; el.classList.remove("fx-tilting"); } else { el.style.translate = ""; el.classList.remove("fx-mag"); }
      S.delete(el);
    }
  }
  raf = S.size ? requestAnimationFrame(loop) : 0;
}

/* ---------- pointer: edge glow position, tilt, magnet ----------
   pointermove can fire faster than the screen refreshes; keep only the latest event and handle it once per frame.
   Rects are cached per element (measured untilted on first touch) and dropped on scroll/resize. */
let hovCard = null, hovMag = null, pend = null, prf = 0;
const R = new WeakMap();
const rectOf = (el) => { let r = R.get(el); if (!r) { r = el.getBoundingClientRect(); R.set(el, r); } return r; };
const forget = () => { hovCard && R.delete(hovCard); hovMag && R.delete(hovMag); };
addEventListener("scroll", forget, { passive: true });
addEventListener("resize", forget, { passive: true });
function onPointer() {
  prf = 0; const e = pend; pend = null; if (!e) return;
  const t = e.target instanceof Element ? e.target : null; if (!t) return;
  const card = t.closest(CARD);
  if (card) {
    const r = rectOf(card), px = e.clientX - r.left, py = e.clientY - r.top;
    card.style.setProperty("--mx", px + "px"); card.style.setProperty("--my", py + "px");
    if (fine && !reduce && !card.hasAttribute("data-notilt")) {
      const k = Math.min(1, 380 / Math.max(r.width, r.height));   // big cards tilt less
      want(card, "tilt", [(0.5 - py / r.height) * 7 * k, (px / r.width - 0.5) * 9 * k, -3]);
    }
  }
  if (hovCard && hovCard !== card) { R.delete(hovCard); if (S.has(hovCard)) want(hovCard, "tilt", [0, 0, 0]); }
  hovCard = card;
  if (!fine || reduce) return;
  const m = t.closest(MAG);
  if (m) {
    const r = rectOf(m);
    const pull = m.matches(".langs a") ? 0.12 : 0.26;
    want(m, "mag", [(e.clientX - (r.left + r.width / 2)) * pull, (e.clientY - (r.top + r.height / 2)) * pull]);
  }
  if (hovMag && hovMag !== m) { R.delete(hovMag); want(hovMag, "mag", [0, 0]); }
  hovMag = m;
}
document.addEventListener("pointermove", (e) => { pend = e; if (!prf) prf = requestAnimationFrame(onPointer); }, { passive: true });
document.addEventListener("pointerleave", () => {
  pend = null;
  if (hovCard && S.has(hovCard)) want(hovCard, "tilt", [0, 0, 0]);
  if (hovMag) want(hovMag, "mag", [0, 0]);
  hovCard = hovMag = null;
});
addEventListener("blur", () => { for (const [el, s] of S) want(el, s.kind, s.tgt.map(() => 0)); });

/* ---------- decorative CSS loops (drawings, pipeline packets) pause while off-screen ---------- */
if ("IntersectionObserver" in window) {
  const po = new IntersectionObserver((es) => { for (const e of es) e.target.classList.toggle("fx-off", !e.isIntersecting); }, { rootMargin: "80px" });
  document.querySelectorAll(".illo, .flow").forEach((el) => po.observe(el));
}

/* ---------- background: circuit traces that light up around the cursor ---------- */
let BG = null;
function circuit() {
  // two layers (few full-screen layers = little GPU fill work, and no CSS opacity group): "base" holds all traces,
  // drawn once per resize/theme, and the glow around the cursor, repainted only in its box when the pointer moved;
  // "live" carries the pulses and clears just their small dirty rects. Opacity is baked into the drawing.
  // If the device starts missing frames, the pulses update every 2nd/3rd frame until it recovers.
  const box = document.createElement("div"); box.id = "fx-bg"; box.setAttribute("aria-hidden", "true");
  const base = document.createElement("canvas"), cv = document.createElement("canvas");
  box.append(base, cv); document.body.prepend(box);
  const bctx = base.getContext("2d"), ctx = cv.getContext("2d"), gctx = bctx;
  let W = 0, H = 0, dpr = 1, traces = [], pulses = [], hot = null, dim = null, dot = null, col = {}, mx = -999, my = -999, A = 0.6;
  let vis = !document.hidden, lastT = 0, rafB = 0, speed = 1, dirty = [], gBox = null, gMoved = false;
  let best = 1000, ema = 0, skip = 1, fcount = 0, acc = 0;
  const read = () => {
    const s = getComputedStyle(doc);
    col = { t: s.getPropertyValue("--trace").trim(), h: s.getPropertyValue("--trace-hi").trim(), p: s.getPropertyValue("--pulse").trim() };
    A = parseFloat(s.getPropertyValue("--fx-bg-a")) || 0.6;
  };
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
  const paint = (x, color, a) => {
    x.strokeStyle = color; x.globalAlpha = a; x.lineWidth = 1.2; x.lineJoin = "round";
    x.beginPath();
    for (const { pts } of traces) pts.forEach(([px, py], k) => (k ? x.lineTo(px, py) : x.moveTo(px, py)));
    x.stroke(); x.beginPath();
    for (const { pts } of traces) for (const [px, py] of [pts[0], pts[pts.length - 1]]) { x.moveTo(px + 2.6, py); x.arc(px, py, 2.6, 0, 7); }
    x.stroke(); x.globalAlpha = 1;
  };
  function build() {
    seed = 7; traces = [];
    const g = W < 700 ? 34 : 28, n = Math.round((W * H) / (g * g * 16));
    for (let i = 0; i < n; i++) {
      let x = Math.round((rnd() * W) / g) * g, y = Math.round((rnd() * H) / g) * g;
      const pts = [[x, y]]; let dir = Math.floor(rnd() * 4);
      const steps = 3 + Math.floor(rnd() * 6);
      for (let k = 0; k < steps; k++) {
        const len = (1 + Math.floor(rnd() * 4)) * g, D = [[1, 0], [0, 1], [-1, 0], [0, -1]][dir];
        if (rnd() < 0.5) { const d2 = [[1, 1], [-1, 1], [-1, -1], [1, -1]][dir]; x += d2[0] * g; y += d2[1] * g; pts.push([x, y]); }  // 45° jog, PCB style
        x += D[0] * len; y += D[1] * len; pts.push([x, y]);
        dir = (dir + (rnd() < 0.5 ? 1 : 3)) % 4;
      }
      let L = 0; for (let k = 1; k < pts.length; k++) L += Math.hypot(pts[k][0] - pts[k - 1][0], pts[k][1] - pts[k - 1][1]);
      traces.push({ pts, L });
    }
    dim = document.createElement("canvas"); dim.width = W * dpr; dim.height = H * dpr;
    const dx = dim.getContext("2d"); dx.scale(dpr, dpr); paint(dx, col.t, 0.38 * A);
    bctx.setTransform(1, 0, 0, 1, 0, 0); bctx.clearRect(0, 0, base.width, base.height); bctx.drawImage(dim, 0, 0);
    bctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (fine) {   // the bright copy is only needed where a cursor can light it up
      hot = document.createElement("canvas"); hot.width = W * dpr; hot.height = H * dpr;
      const x = hot.getContext("2d"); x.scale(dpr, dpr); paint(x, col.h, 1);
    }
    dot = document.createElement("canvas"); dot.width = dot.height = Math.ceil(24 * dpr);   // pre-rendered glow, no shadowBlur per frame
    const d = dot.getContext("2d"), c = dot.width / 2, gr = d.createRadialGradient(c, c, 0, c, c, c);
    if (/^#[0-9a-f]{6}$/i.test(col.p)) {
      gr.addColorStop(0, col.p); gr.addColorStop(0.16, col.p); gr.addColorStop(0.3, col.p + "88"); gr.addColorStop(1, col.p + "00");
      d.fillStyle = gr; d.fillRect(0, 0, dot.width, dot.height);
    } else { d.fillStyle = col.p; d.beginPath(); d.arc(c, c, 1.8 * dpr, 0, 7); d.fill(); }
    pulses = Array.from({ length: Math.min(18, Math.round(traces.length / 6)) }, () => ({ tr: traces[Math.floor(rnd() * traces.length)], d: rnd(), v: 40 + rnd() * 70 }));
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, cv.width, cv.height); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    dirty = []; gBox = null; gMoved = true;
  }
  function resize() {
    // phones resize the viewport while the address bar slides; only rebuild on width changes or a taller view
    const w = innerWidth, h = Math.max(innerHeight, document.documentElement.clientHeight);
    const nd = Math.min(1.5, devicePixelRatio || 1);
    if (w === W && h <= H && nd === dpr) return;
    dpr = nd; W = w; H = Math.max(h, Math.min(screen.height || 0, h * 1.35));   // a little headroom for the sliding bar
    for (const c of [base, cv]) { c.width = W * dpr; c.height = H * dpr; c.style.height = H + "px"; }
    read(); build();
  }
  const at = (tr, d) => {
    let rest = d * tr.L;
    for (let k = 1; k < tr.pts.length; k++) {
      const [ax, ay] = tr.pts[k - 1], [bx, by] = tr.pts[k], s = Math.hypot(bx - ax, by - ay);
      if (rest <= s) return [ax + ((bx - ax) * rest) / s, ay + ((by - ay) * rest) / s];
      rest -= s;
    }
    return tr.pts[tr.pts.length - 1];
  };
  function drawGlow() {   // stacked rings = soft edge; copy only the ring's bounding box
    gMoved = false;
    if (gBox) {   // put the plain traces back where the glow was
      const [x, y, w, h] = gBox;
      gctx.clearRect(x, y, w, h); gctx.drawImage(dim, x * dpr, y * dpr, w * dpr, h * dpr, x, y, w, h);
    }
    gBox = null;
    if (!hot || mx < -900) return;
    for (const [r, a] of [[180, 0.22], [120, 0.3], [65, 0.45]]) {
      const x = Math.max(0, mx - r), y = Math.max(0, my - r), w = Math.min(W - x, 2 * r), h = Math.min(H - y, 2 * r);
      if (w <= 0 || h <= 0) continue;
      gctx.save(); gctx.beginPath(); gctx.arc(mx, my, r, 0, 7); gctx.clip(); gctx.globalAlpha = a * A;
      gctx.drawImage(hot, x * dpr, y * dpr, w * dpr, h * dpr, x, y, w, h); gctx.restore();
    }
    const x = Math.max(0, Math.floor(mx - 182)), y = Math.max(0, Math.floor(my - 182));
    gBox = [x, y, Math.min(W - x, Math.ceil(mx + 182) - x), Math.min(H - y, Math.ceil(my + 182) - y)];
  }
  function frame(now) {
    const iv = lastT ? now - lastT : 0; lastT = now;
    if (vis) rafB = requestAnimationFrame(frame);
    if (gMoved) drawGlow();
    if (iv) {   // adapt: best = the display's frame time; slow average = the device is struggling
      best = Math.min(best, Math.max(4, iv)); ema = ema ? ema * 0.9 + iv * 0.1 : iv;
      if (++fcount > 30) { fcount = 0; if (ema > best * 1.6 && skip < 3) skip++; else if (ema < best * 1.15 && skip > 1) skip--; }
    }
    acc += iv;
    if ((fcount % skip) !== 0) return;
    const dt = Math.min(0.05, acc / 1000); acc = 0;
    for (const [x, y, w, h] of dirty) ctx.clearRect(x, y, w, h);
    dirty = [];
    ctx.globalAlpha = 0.9 * A;
    for (const p of pulses) {
      p.d += (p.v * speed * dt) / p.tr.L;
      if (p.d > 1) { p.tr = traces[Math.floor(Math.random() * traces.length)]; p.d = 0; }
      const [x, y] = at(p.tr, p.d);
      ctx.drawImage(dot, x - 12, y - 12, 24, 24); dirty.push([x - 13, y - 13, 26, 26]);
    }
    ctx.globalAlpha = 1;
  }
  const start = () => { cancelAnimationFrame(rafB); lastT = 0; if (vis) rafB = requestAnimationFrame(frame); };
  let rt = 0;
  addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(resize, 150); });
  document.addEventListener("visibilitychange", () => { vis = !document.hidden; start(); });
  if (fine) document.addEventListener("pointermove", (e) => { mx = e.clientX; my = e.clientY; gMoved = true; }, { passive: true });
  resize(); start();
  doc.classList.add("fx-bg");
  const rebuild = () => { read(); build(); };
  return { colors() { requestAnimationFrame(rebuild); }, turbo(on) { speed = on ? 4 : 1; } };
}
if (!reduce) {
  const idle = window.requestIdleCallback || ((f) => setTimeout(f, 200));
  const go = () => idle(() => { BG = circuit(); }, { timeout: 800 });
  if (document.readyState === "complete") go(); else addEventListener("load", go, { once: true });
}

/* ---------- easter egg ---------- */
const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
let kpos = 0;
document.addEventListener("keydown", (e) => {
  const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
  kpos = k === KONAMI[kpos] ? kpos + 1 : k === KONAMI[0] ? 1 : 0;
  if (kpos === KONAMI.length) { kpos = 0; const on = doc.classList.toggle("fx-oc"); BG?.turbo(on); BG?.colors(); }
});
