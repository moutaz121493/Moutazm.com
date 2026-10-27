// Interactive 3D hero for /3d/: twisted pair (CAN_H / CAN_L) carrying a CAN FD frame into a rotating neural network.
// The nodes of the third layer are the projects: hover shows the name, click opens the page.
// Colours come from the site's CSS variables (dark HUD / light Retro), reduced motion = no auto motion.
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const LAYERS = [4, 6, 0, 3];          // layer 2 is filled with one node per project at runtime
const css = (n) => getComputedStyle(document.documentElement).getPropertyValue(n).trim();

export function initD3() {
  const stage = document.getElementById("d3-stage");
  const canvas = document.getElementById("d3-canvas");
  if (!stage || !canvas) return;
  const items = JSON.parse(stage.dataset.items || "[]");
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
  // ?t=<seconds>&loop=<seconds>: render one fixed moment (used to export the seamless WebP loop)
  const q = new URLSearchParams(location.search);
  const fixedT = q.has("t") ? Number(q.get("t")) : null;
  const TURN = q.has("loop") ? Number(q.get("loop")) : 36;
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 16 / 9, 0.1, 100);
  camera.position.set(-2.2, 0.9, 8.6);
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.enablePan = false;
  controls.minDistance = 5;
  controls.maxDistance = 16;
  controls.target.set(-1.6, -0.35, 0);

  // ----- materials (theme aware) -----
  const mats = {
    node: new THREE.MeshBasicMaterial(), proj: new THREE.MeshBasicMaterial(), edge: new THREE.LineBasicMaterial({ transparent: true, opacity: 0.28 }),
    h: new THREE.MeshBasicMaterial(), l: new THREE.MeshBasicMaterial(), frame: new THREE.MeshBasicMaterial(), pulse: new THREE.MeshBasicMaterial(),
  };
  const grid = new THREE.GridHelper(40, 40);
  grid.position.y = -2.6;
  scene.add(grid);
  function applyTheme() {
    const ai = new THREE.Color(css("--ai") || "#4fd1ff"), acc = new THREE.Color(css("--accent") || "#f5b83f");
    mats.node.color.copy(ai); mats.edge.color.copy(ai); mats.l.color.copy(ai);
    mats.proj.color.copy(acc); mats.h.color.copy(acc); mats.frame.color.copy(acc); mats.pulse.color.copy(acc);
    const line = new THREE.Color(css("--line") || "#1f2c37");
    grid.material.color = line; grid.material.vertexColors = false; grid.material.transparent = true; grid.material.opacity = 0.7;
    scene.fog = new THREE.Fog(new THREE.Color(css("--bg-2") || "#0b1118"), 9, 26);
  }
  applyTheme();
  new MutationObserver(applyTheme).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

  // ----- network -----
  const net = new THREE.Group();
  scene.add(net);
  const layers = LAYERS.map((n, i) => (i === 2 ? items.length : n));
  const radius = [0.75, 1.1, 1.1, 0.62];
  const nodes = [];                 // {mesh, layer, item}
  const sphere = new THREE.SphereGeometry(0.09, 20, 14);
  const big = new THREE.SphereGeometry(0.14, 24, 16);
  layers.forEach((n, li) => {
    for (let k = 0; k < n; k++) {
      const a = (2 * Math.PI * k) / n + li * 0.45;
      const isProj = li === 2;
      const m = new THREE.Mesh(isProj ? big : sphere, isProj ? mats.proj : mats.node);
      m.position.set(-1.95 + li * 1.3, radius[li] * Math.cos(a), radius[li] * Math.sin(a));
      net.add(m);
      nodes.push({ mesh: m, layer: li, item: isProj ? items[k] : null });
    }
  });
  const pts = [];
  for (let li = 0; li < layers.length - 1; li++) {
    for (const a of nodes.filter((n) => n.layer === li)) for (const b of nodes.filter((n) => n.layer === li + 1)) pts.push(a.mesh.position, b.mesh.position);
  }
  net.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(pts), mats.edge));

  // ----- twisted pair into the input layer -----
  const start = new THREE.Vector3(-7.5, -1.6, 1.2), end = new THREE.Vector3(-2.25, 0, 0);
  function helix(sign, phase) {
    const P = [];
    const dir = end.clone().sub(start), len = dir.length();
    dir.normalize();
    const up = new THREE.Vector3(0, 1, 0).cross(dir).normalize(), side = dir.clone().cross(up).normalize();
    for (let i = 0; i <= 160; i++) {
      const s = i / 160, a = 2 * Math.PI * 9 * s + phase + (sign > 0 ? 0 : Math.PI);
      const r = 0.09 * (0.4 + 0.6 * Math.sin(Math.PI * Math.min(1, s * 1.1)));
      P.push(start.clone().add(dir.clone().multiplyScalar(len * s)).add(up.clone().multiplyScalar(r * Math.cos(a))).add(side.clone().multiplyScalar(r * Math.sin(a))));
    }
    return new THREE.CatmullRomCurve3(P);
  }
  const wires = [1, -1].map((sg) => {
    const m = new THREE.Mesh(new THREE.TubeGeometry(helix(sg, 0), 320, 0.022, 8), sg > 0 ? mats.h : mats.l);
    scene.add(m);
    return m;
  });
  const frame = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.14, 0.14), mats.frame);
  scene.add(frame);
  const pulses = Array.from({ length: 5 }, () => {
    const m = new THREE.Mesh(new THREE.SphereGeometry(0.05, 12, 8), mats.pulse);
    m.visible = false;
    net.add(m);
    return m;
  });
  let seed = 7;                                    // deterministic routes (same picture every load)
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const routes = pulses.map(() => layers.map((n, li) => nodes.filter((x) => x.layer === li)[Math.floor(rnd() * n)].mesh.position));

  // ----- hover / click on project nodes -----
  const tip = document.getElementById("d3-tip");
  const ray = new THREE.Raycaster(), mouse = new THREE.Vector2();
  const projMeshes = nodes.filter((n) => n.item).map((n) => n.mesh);
  let hover = null;
  canvas.addEventListener("pointermove", (e) => {
    const r = canvas.getBoundingClientRect();
    mouse.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(mouse, camera);
    const hit = ray.intersectObjects(projMeshes)[0];
    hover = hit ? nodes.find((n) => n.mesh === hit.object) : null;
    canvas.style.cursor = hover ? "pointer" : "";
    if (hover) {
      tip.hidden = false;
      tip.querySelector("b").textContent = hover.item.title;
      tip.querySelector("span").textContent = hover.item.tagline;
      tip.style.left = Math.min(r.width - 290, e.clientX - r.left + 14) + "px";
      tip.style.top = e.clientY - r.top + 14 + "px";
    } else tip.hidden = true;
  });
  canvas.addEventListener("pointerleave", () => { tip.hidden = true; hover = null; });
  canvas.addEventListener("click", () => { if (hover) location.href = hover.item.href; });

  // ----- size, visibility, loop -----
  function resize() {
    const w = stage.clientWidth, h = stage.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.fov = w < 640 ? 66 : 38;
    controls.target.set(w < 640 ? -0.9 : -1.6, -0.35, 0);
    camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(stage);
  resize();
  let visible = true;
  new IntersectionObserver(([en]) => { visible = en.isIntersecting; }).observe(stage);
  const clock = new THREE.Clock();
  const BURST = 6, TRAVEL = 2;
  const tmp = new THREE.Vector3();
  function tick() {
    requestAnimationFrame(tick);
    if (fixedT === null && (!visible || document.hidden)) return;
    const t = fixedT !== null ? fixedT : reduce ? 0 : clock.getElapsedTime();
    net.rotation.x = (t * 2 * Math.PI) / TURN;
    const u = (t % BURST) / TRAVEL;
    frame.visible = !reduce && u < 1;
    if (frame.visible) {
      frame.position.lerpVectors(start, end, u);
      frame.lookAt(end);
    }
    pulses.forEach((p, i) => {
      const v = ((t % BURST) - TRAVEL - i * 0.12) / 2.4;
      p.visible = !reduce && v >= 0 && v <= 1;
      if (p.visible) {
        const seg = Math.min(2, Math.floor(v * 3)), f = v * 3 - seg, r = routes[i];
        p.position.copy(tmp.lerpVectors(r[seg], r[seg + 1], f));
      }
    });
    projMeshes.forEach((m) => m.scale.setScalar(hover && hover.mesh === m ? 1.6 : 1 + (reduce ? 0 : 0.12 * Math.sin(t * 2 + m.position.y * 3))));
    controls.update();
    renderer.render(scene, camera);
    if (fixedT !== null) window.__d3ready = true;
  }
  tick();
}
