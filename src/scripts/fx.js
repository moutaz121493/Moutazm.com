/* Motion layer (styles in global.css, "fx" section):
   - cards: edge glow follows the cursor, springy 3D tilt; buttons: magnetic pull
   - circuit-board background that lights up around the cursor (canvas, 30 fps cap, idle-loaded)
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
  if (!s) { s = { kind, v: tgt.map(() => 0), vel: tgt.map(() => 0), tgt }; S.set(el, s); if (kind === "tilt") el.classList.add("fx-tilting"); }
  s.tgt = tgt;
  if (!raf) { last = 0; raf = requestAnimationFrame(loop); }
}
function loop(now) {
  const dt = last ? Math.min(0.032, (now - last) / 1000) : 1 / 60; last = now;
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
      if (s.kind === "tilt") { el.style.transform = ""; el.classList.remove("fx-tilting"); } else el.style.translate = "";
      S.delete(el);
    }
  }
  raf = S.size ? requestAnimationFrame(loop) : 0;
}

/* ---------- pointer: edge glow position, tilt, magnet ---------- */
let hovCard = null, hovMag = null;
document.addEventListener("pointermove", (e) => {
  const t = e.target instanceof Element ? e.target : null; if (!t) return;
  const card = t.closest(CARD);
  if (card) {
    const r = card.getBoundingClientRect(), px = e.clientX - r.left, py = e.clientY - r.top;
    card.style.setProperty("--mx", px + "px"); card.style.setProperty("--my", py + "px");
    if (fine && !reduce && !card.hasAttribute("data-notilt")) {
      const k = Math.min(1, 380 / Math.max(r.width, r.height));   // big cards tilt less
      want(card, "tilt", [(0.5 - py / r.height) * 7 * k, (px / r.width - 0.5) * 9 * k, -3]);
    }
  }
  if (hovCard && hovCard !== card && S.has(hovCard)) want(hovCard, "tilt", [0, 0, 0]);
  hovCard = card;
  if (!fine || reduce) return;
  const m = t.closest(MAG);
  if (m) {
    const r = m.getBoundingClientRect();
    const pull = m.matches(".langs a") ? 0.12 : 0.26;
    want(m, "mag", [(e.clientX - (r.left + r.width / 2)) * pull, (e.clientY - (r.top + r.height / 2)) * pull]);
  }
  if (hovMag && hovMag !== m) want(hovMag, "mag", [0, 0]);
  hovMag = m;
}, { passive: true });
document.addEventListener("pointerleave", () => {
  if (hovCard && S.has(hovCard)) want(hovCard, "tilt", [0, 0, 0]);
  if (hovMag) want(hovMag, "mag", [0, 0]);
  hovCard = hovMag = null;
});
addEventListener("blur", () => { for (const [el, s] of S) want(el, s.kind, s.tgt.map(() => 0)); });

/* ---------- background: circuit traces that light up around the cursor ---------- */
let BG = null;
function circuit() {
  const cv = document.createElement("canvas"); cv.id = "fx-bg"; cv.setAttribute("aria-hidden", "true");
  document.body.prepend(cv);
  const ctx = cv.getContext("2d");
  let W = 0, H = 0, dpr = 1, traces = [], pulses = [], dim = null, hot = null, col = {}, mx = -999, my = -999;
  let vis = !document.hidden, lastT = 0, rafB = 0, speed = 1;
  const read = () => {
    const s = getComputedStyle(doc);
    col = { t: s.getPropertyValue("--trace").trim(), h: s.getPropertyValue("--trace-hi").trim(), p: s.getPropertyValue("--pulse").trim() };
  };
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
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
    const layer = (color, a) => {
      const o = document.createElement("canvas"); o.width = W * dpr; o.height = H * dpr;
      const x = o.getContext("2d"); x.scale(dpr, dpr); x.strokeStyle = color; x.globalAlpha = a; x.lineWidth = 1.2; x.lineJoin = "round";
      for (const { pts } of traces) {
        x.beginPath(); pts.forEach(([px, py], k) => (k ? x.lineTo(px, py) : x.moveTo(px, py))); x.stroke();
        for (const [px, py] of [pts[0], pts[pts.length - 1]]) { x.beginPath(); x.arc(px, py, 2.6, 0, 7); x.stroke(); }
      }
      return o;
    };
    dim = layer(col.t, 0.38); hot = layer(col.h, 1);
    pulses = Array.from({ length: Math.min(18, Math.round(traces.length / 6)) }, () => ({ tr: traces[Math.floor(rnd() * traces.length)], d: rnd(), v: 40 + rnd() * 70 }));
  }
  function resize() {
    dpr = Math.min(1.5, devicePixelRatio || 1); W = innerWidth; H = innerHeight;
    cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    read(); build(); frame(performance.now(), true);
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
  function frame(now, force) {
    if (!force && now - lastT < 33) { rafB = requestAnimationFrame(frame); return; }
    const dt = lastT ? Math.min(0.1, (now - lastT) / 1000) : 0; lastT = now;
    ctx.clearRect(0, 0, W, H);
    ctx.drawImage(dim, 0, 0, W, H);
    if (mx > -900) for (const [r, a] of [[180, 0.22], [120, 0.3], [65, 0.45]]) {   // stacked rings = soft edge
      ctx.save(); ctx.beginPath(); ctx.arc(mx, my, r, 0, 7); ctx.clip(); ctx.globalAlpha = a; ctx.drawImage(hot, 0, 0, W, H); ctx.restore();
    }
    ctx.fillStyle = col.p; ctx.shadowColor = col.p; ctx.shadowBlur = 8;
    for (const p of pulses) {
      p.d += (p.v * speed * dt) / p.tr.L;
      if (p.d > 1) { p.tr = traces[Math.floor(Math.random() * traces.length)]; p.d = 0; }
      const [x, y] = at(p.tr, p.d); ctx.globalAlpha = 0.85; ctx.beginPath(); ctx.arc(x, y, 1.8, 0, 7); ctx.fill();
    }
    ctx.shadowBlur = 0; ctx.globalAlpha = 1;
    if (vis && !force) rafB = requestAnimationFrame(frame);
  }
  const start = () => { cancelAnimationFrame(rafB); lastT = 0; if (vis) rafB = requestAnimationFrame(frame); };
  let rt = 0;
  addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(resize, 150); });
  document.addEventListener("visibilitychange", () => { vis = !document.hidden; start(); });
  if (fine) document.addEventListener("pointermove", (e) => { mx = e.clientX; my = e.clientY; }, { passive: true });
  resize(); start();
  doc.classList.add("fx-bg");
  return { colors() { requestAnimationFrame(() => { read(); build(); }); }, turbo(on) { speed = on ? 4 : 1; } };
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
