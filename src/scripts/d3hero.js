// Interactive 3D hero for /3d/: one pipeline in five stages, the same story as the GitHub profile banner.
//   01 CAN FD bits -> 02 decode (MCU) -> 03 embed (tokens) -> 04 reason (layered network) -> 05 answer + sources
// One 8 s timeline drives everything; hover a stage for its explanation, click to open the related project.
// Colours come from the site's CSS variables (dark HUD / light Retro); reduced motion shows the finished state.
// ?t=<seconds> renders one fixed moment (used to export the WebP loop).
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const LOOP = 8;
const X = [-6.2, -2.9, -0.2, 2.8, 6.0];                  // stage positions along the pipeline
const css = (n) => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ease = (v) => v * v * (3 - 2 * v);
const ramp = (t, t0, d) => ease(clamp((t - t0) / d));   // 0 -> 1 between t0 and t0 + d
const fade = (t) => 1 - ramp(t, 7.4, 0.4);               // everything resets at the end of the loop

export function initD3() {
  const stage = document.getElementById("d3-stage");
  const canvas = document.getElementById("d3-canvas");
  if (!stage || !canvas) return;
  const stages = JSON.parse(stage.dataset.stages || "[]");
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  } catch (e) {
    canvas.hidden = true;
    document.getElementById("d3-still").hidden = false;
    document.getElementById("d3-note").hidden = false;
    return;
  }
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const q = new URLSearchParams(location.search);
  const fixedT = q.has("t") ? Number(q.get("t")) : null;
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.localClippingEnabled = true;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 16 / 9, 0.1, 100);
  camera.position.set(0, 6.2, 14.6);
  const controls = new OrbitControls(camera, canvas);
  Object.assign(controls, { enableDamping: true, enablePan: false, minDistance: 7, maxDistance: 24, maxPolarAngle: Math.PI * 0.49 });
  controls.target.set(0, -0.7, 0);

  // ----- theme-aware materials -----
  const M = {
    acc: new THREE.MeshBasicMaterial(), ai: new THREE.MeshBasicMaterial(), live: new THREE.MeshBasicMaterial(),
    panel: new THREE.MeshBasicMaterial(), side: new THREE.MeshBasicMaterial(), muted: new THREE.MeshBasicMaterial(),
    line: new THREE.LineBasicMaterial({ transparent: true, opacity: 0.45 }), edge: new THREE.LineBasicMaterial({ transparent: true, opacity: 0.25 }),
    die: new THREE.MeshBasicMaterial({ transparent: true }), hL: new THREE.LineBasicMaterial(), lL: new THREE.LineBasicMaterial(),
  };
  const grid = new THREE.GridHelper(40, 40);
  grid.position.y = -1.2;
  grid.material.transparent = true;
  scene.add(grid);
  const nodeMats = [];
  function applyTheme() {
    const c = (n, f) => new THREE.Color(css(n) || f);
    M.acc.color = c("--accent", "#f5b83f"); M.ai.color = c("--ai", "#4fd1ff"); M.live.color = c("--live", "#45e08f");
    M.panel.color = c("--panel", "#0f161d"); M.side.color = c("--line-2", "#2b3c4a"); M.muted.color = c("--muted", "#8d9ca8");
    M.line.color = c("--line-2", "#2b3c4a"); M.edge.color = c("--ai", "#4fd1ff"); M.die.color = c("--accent", "#f5b83f");
    M.hL.color = c("--accent", "#f5b83f"); M.lL.color = c("--ai", "#4fd1ff");
    grid.material.color = c("--line", "#1f2c37"); grid.material.opacity = document.documentElement.dataset.theme === "light" ? 0.45 : 0.8;
    scene.fog = new THREE.Fog(c("--bg-2", "#0b1118"), 14, 34);
  }
  applyTheme();
  new MutationObserver(applyTheme).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  const slab = (w, h, d, mat, x, y, z) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat); m.position.set(x, y, z); return m; };
  const ghost = new THREE.MeshBasicMaterial({ visible: false });
  const hit = [];                                           // invisible hover volumes, one per stage

  // ----- 01 CAN FD bits: CAN_H / CAN_L square waves above a plate; the pattern scrolls towards the chip -----
  const g1 = new THREE.Group(); g1.position.x = X[0]; scene.add(g1);
  g1.add(slab(3.4, 0.08, 1.6, M.side, 0, -0.55, 0));
  const BITS = [1, 0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 1];
  const period = BITS.length * 0.28;
  function wave(rec, dom) {                                  // 1 = recessive, 0 = dominant
    const pts = []; let x = 0;
    for (let r = 0; r < 3; r++) for (const b of BITS) { const y = b ? rec : dom; pts.push(new THREE.Vector3(x, y, 0), new THREE.Vector3(x + 0.28, y, 0)); x += 0.28; }
    return new THREE.BufferGeometry().setFromPoints(pts);
  }
  const clips = [new THREE.Plane(new THREE.Vector3(1, 0, 0), 1.7 - X[0]), new THREE.Plane(new THREE.Vector3(-1, 0, 0), 1.7 + X[0])];
  M.hL.clippingPlanes = clips; M.lL.clippingPlanes = clips;
  const waves = [new THREE.Line(wave(0.25, 0.75), M.hL), new THREE.Line(wave(-0.05, -0.45), M.lL)];
  waves[0].position.z = 0.2; waves[1].position.z = -0.2;
  waves.forEach((w) => g1.add(w));
  hit.push(slab(3.6, 2, 2, ghost, X[0], 0.1, 0));

  // ----- 02 decode: MCU package with pins; the die lights up when the frame arrives -----
  const g2 = new THREE.Group(); g2.position.x = X[1]; scene.add(g2);
  g2.add(slab(1.7, 0.3, 1.7, M.panel, 0, -0.25, 0));
  for (let i = 0; i < 6; i++) {
    const o = -0.65 + i * 0.26;
    g2.add(slab(0.08, 0.05, 0.25, M.muted, o, -0.38, 0.95), slab(0.08, 0.05, 0.25, M.muted, o, -0.38, -0.95),
           slab(0.25, 0.05, 0.08, M.muted, 0.95, -0.38, o), slab(0.25, 0.05, 0.08, M.muted, -0.95, -0.38, o));
  }
  g2.add(slab(0.8, 0.02, 0.8, M.die, 0, -0.09, 0));
  hit.push(slab(2.2, 1.6, 2.2, ghost, X[1], 0, 0));

  // ----- 03 embed: 3 x 3 token cubes appear one by one -----
  const g3 = new THREE.Group(); g3.position.x = X[2]; scene.add(g3);
  const cubes = [];
  for (let j = 0; j < 3; j++) for (let i = 0; i < 3; i++) {
    const h = 0.35 + ((i * 7 + j * 3) % 3) * 0.15;
    const m = slab(0.42, h, 0.42, [M.ai, M.acc, M.live][(i + j) % 3], (i - 1) * 0.5, -0.55 + h / 2, (j - 1) * 0.5);
    g3.add(m); cubes.push(m);
  }
  hit.push(slab(1.8, 1.6, 1.8, ghost, X[2], 0, 0));

  // ----- 04 reason: layered network in columns; an activation wave sweeps layer by layer -----
  const g4 = new THREE.Group(); g4.position.x = X[3]; scene.add(g4);
  const NET = [3, 4, 4, 2], nodes = [];
  NET.forEach((n, li) => { for (let k = 0; k < n; k++) {
    const mat = new THREE.MeshBasicMaterial(); nodeMats.push(mat);
    const node = new THREE.Mesh(new THREE.SphereGeometry(0.17, 20, 14), mat);
    node.position.set(-1.35 + li * 0.9, 0.2 + (k - (n - 1) / 2) * 0.55, k % 2 ? 0.25 : -0.25);
    node.userData.layer = li; g4.add(node); nodes.push(node);
  } });
  const ep = [];
  nodes.forEach((a) => nodes.forEach((b) => { if (b.userData.layer === a.userData.layer + 1) ep.push(a.position, b.position); }));
  g4.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(ep), M.edge));
  hit.push(slab(3.4, 2.6, 1.6, ghost, X[3], 0.2, 0));

  // ----- 05 answer + sources: an upright document; lines write themselves, then [1] [2] -----
  const g5 = new THREE.Group(); g5.position.x = X[4]; scene.add(g5);
  g5.add(slab(1.7, 2.1, 0.12, M.panel, 0, 0.3, 0), slab(1.74, 2.14, 0.08, M.side, 0.05, 0.26, -0.09));
  const bars = [0.82, 0.7, 0.78, 0.5].map((f, i) => {
    const b = slab(1.3 * f, 0.07, 0.02, M.muted, 0, 0.95 - i * 0.24, 0.08);
    b.geometry.translate(1.3 * f / 2, 0, 0); b.position.x = -0.65;     // grow from the left edge
    g5.add(b); return b;
  });
  const cites = [0, 1].map((i) => { const c = slab(0.36, 0.2, 0.03, M.acc, -0.45 + i * 0.46, -0.45, 0.08); g5.add(c); return c; });
  hit.push(slab(2, 2.6, 0.8, ghost, X[4], 0.3, 0));
  hit.forEach((h, i) => { h.userData.i = i; scene.add(h); });

  // ----- links + the packet that travels them -----
  const LINKS = [[X[0] + 1.75, X[1] - 1.05, 1.25], [X[1] + 1.05, X[2] - 0.85, 1.75], [X[2] + 0.85, X[3] - 1.6, 2.75], [X[3] + 1.6, X[4] - 0.95, 4.6]];
  LINKS.forEach(([a, b]) => scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(a, 0, 0), new THREE.Vector3(b, 0, 0)]), M.line)));
  const packet = new THREE.Mesh(new THREE.SphereGeometry(0.11, 16, 12), M.acc); scene.add(packet);

  // ----- hover / click -----
  const tip = document.getElementById("d3-tip");
  const ray = new THREE.Raycaster(), mouse = new THREE.Vector2();
  let hover = -1;
  canvas.addEventListener("pointermove", (e) => {
    const r = canvas.getBoundingClientRect();
    mouse.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(mouse, camera);
    const h = ray.intersectObjects(hit)[0];
    hover = h ? h.object.userData.i : -1;
    canvas.style.cursor = hover >= 0 ? "pointer" : "";
    if (hover >= 0 && stages[hover]) {
      tip.hidden = false;
      tip.querySelector("b").textContent = `${stages[hover].n} · ${stages[hover].name}`;
      tip.querySelector("span").textContent = stages[hover].desc;
      tip.style.left = Math.min(r.width - 290, e.clientX - r.left + 14) + "px";
      tip.style.top = e.clientY - r.top + 14 + "px";
    } else tip.hidden = true;
  });
  canvas.addEventListener("pointerleave", () => { tip.hidden = true; hover = -1; });
  canvas.addEventListener("click", () => { if (hover >= 0 && stages[hover]) location.href = stages[hover].href; });

  // ----- labels (HTML, localised) follow their stage -----
  const labs = [...document.querySelectorAll("#d3-labels .lab")];
  const tmp = new THREE.Vector3();
  function placeLabels() {
    const w = stage.clientWidth, h = stage.clientHeight;
    labs.forEach((el, i) => {
      tmp.set(X[i], -1.35, 0.9).project(camera);
      el.style.left = ((tmp.x + 1) / 2) * w + "px";
      el.style.top = ((1 - tmp.y) / 2) * h + "px";
    });
  }

  // ----- size, visibility, loop -----
  function resize() {
    const w = stage.clientWidth, h = stage.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    const narrow = w < 640;
    camera.fov = narrow ? 40 : 34;
    if (narrow) camera.position.set(0, 7, 15.5);
    camera.updateProjectionMatrix();
    labs.forEach((el, i) => { el.textContent = narrow ? stages[i].n : `${stages[i].n} · ${stages[i].name}`; });
  }
  new ResizeObserver(resize).observe(stage);
  resize();
  let visible = true;
  new IntersectionObserver(([en]) => { visible = en.isIntersecting; }).observe(stage);
  const clock = new THREE.Clock();
  function tick() {
    requestAnimationFrame(tick);
    if (fixedT === null && (!visible || document.hidden)) return;
    const t = fixedT !== null ? fixedT % LOOP : reduce ? 6.9 : clock.getElapsedTime() % LOOP;
    const f = fade(t);
    const shift = reduce ? 0 : ((t / (LOOP / 2)) % 1) * period;
    waves.forEach((w) => { w.position.x = -1.7 - period + shift; });
    M.die.opacity = 0.2 + 0.75 * ramp(t, 1.5, 0.3) * (1 - 0.55 * ramp(t, 1.8, 0.8)) * f;
    cubes.forEach((c, n) => { const s = Math.max(0.001, ramp(t, 2.0 + n * 0.11, 0.18) * f); c.scale.set(s, s, s); });
    nodes.forEach((nd) => { const a = ramp(t, 3.0 + nd.userData.layer * 0.5, 0.2) * f; nd.material.color.copy(M.ai.color).lerp(M.acc.color, a * 0.85); });
    bars.forEach((b, i) => { b.scale.x = Math.max(0.001, ramp(t, 5.0 + i * 0.28, 0.3) * f); });
    cites.forEach((c, i) => { c.visible = ramp(t, 6.25 + i * 0.2, 0.15) * f > 0.5; });
    let shown = false;
    for (const [a, b, t0] of LINKS) {
      const u = (t - t0) / 0.45;
      if (u >= 0 && u <= 1 && !reduce) { packet.position.set(a + (b - a) * u, 0, 0); shown = true; }
    }
    packet.visible = shown;
    controls.update();
    renderer.render(scene, camera);
    placeLabels();
    if (fixedT !== null) window.__d3ready = true;
  }
  tick();
}
