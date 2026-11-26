/* Top bar: phone menu, "you are here" highlight for the home sections, compact shadow once scrolled.
   The reading-progress line is pure CSS (scroll-driven animation) where the browser supports it. */
const header = document.querySelector("header.site");
const nav = document.getElementById("nav");
const btn = header?.querySelector(".menu");

/* ---------- phone menu ---------- */
if (header && nav && btn) {
  const set = (on) => {
    header.classList.toggle("open", on);
    btn.setAttribute("aria-expanded", String(on));
    if (on) nav.querySelector("a")?.focus({ preventScroll: true });
  };
  btn.addEventListener("click", () => set(!header.classList.contains("open")));
  nav.addEventListener("click", (e) => { if (e.target.closest("a")) set(false); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && header.classList.contains("open")) { set(false); btn.focus(); } });
  document.addEventListener("pointerdown", (e) => { if (header.classList.contains("open") && !header.contains(e.target)) set(false); });
  matchMedia("(min-width: 861px)").addEventListener("change", (m) => m.matches && set(false));
}

/* ---------- scrolled state ---------- */
let ticking = false;
const onScroll = () => {
  if (ticking) return; ticking = true;
  requestAnimationFrame(() => { header?.classList.toggle("scrolled", scrollY > 8); ticking = false; });
};
addEventListener("scroll", onScroll, { passive: true }); onScroll();

/* ---------- scroll spy (home page only) ---------- */
const links = nav ? [...nav.querySelectorAll("a[data-sec]")] : [];
const secs = links.map((a) => document.getElementById(a.dataset.sec)).filter(Boolean);
if (secs.length && "IntersectionObserver" in window) {
  const vis = new Map();
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) vis.set(e.target.id, e.isIntersecting ? e.intersectionRatio : 0);
    // the topmost section that occupies the middle band of the screen wins
    const cur = secs.find((s) => vis.get(s.id) > 0)?.id;
    for (const a of links) a.classList.toggle("on", a.dataset.sec === cur);
  }, { rootMargin: "-45% 0px -50% 0px", threshold: [0, 0.01] });
  secs.forEach((s) => io.observe(s));
}
