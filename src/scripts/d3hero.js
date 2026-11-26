// Studio-Grade Precision CAD 3D Showcase for /3d/:
// Five bespoke hardware-to-AI sculptures mounted along a brushed-slate optical bench.
// Selective high-threshold bloom keeps dark anodized metal & glass razor-sharp with zero neon smear.

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";

const LOOP = 9.0;
const X = [-6.6, -3.3, 0.0, 3.3, 6.6];
const css = (n) => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ease = (v) => v * v * (3 - 2 * v);
const ramp = (t, t0, d) => ease(clamp((t - t0) / d));
const fade = (t) => 1 - ramp(t, 8.3, 0.5);

export function initD3() {
  const stage = document.getElementById("d3-stage");
  const canvas = document.getElementById("d3-canvas");
  if (!stage || !canvas) return;
  const stages = JSON.parse(stage.dataset.stages || "[]");

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  } catch {
    canvas.hidden = true;
    const still = document.getElementById("d3-still");
    const note = document.getElementById("d3-note");
    if (still) still.hidden = false;
    if (note) note.hidden = false;
    return;
  }

  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const q = new URLSearchParams(location.search);
  const fixedT = q.has("t") ? Number(q.get("t")) : null;

  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 16 / 9, 0.1, 120);
  camera.position.set(0.4, 5.8, 15.8);

  // Selective bloom: high threshold (0.85) so ONLY true emissive filaments glow, keeping metal crisp
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(960, 540), 0.28, 0.32, 0.85);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());

  const controls = new OrbitControls(camera, canvas);
  Object.assign(controls, {
    enableDamping: true,
    dampingFactor: 0.06,
    enablePan: false,
    minDistance: 6.5,
    maxDistance: 25,
    maxPolarAngle: Math.PI * 0.48,
  });
  controls.target.set(0, 0.25, 0);

  // --- Studio Key / Rim / Fill Lighting ---
  scene.add(new THREE.HemisphereLight(0xe2e8f0, 0x090e14, 0.95));
  const keyLight = new THREE.DirectionalLight(0xffffff, 1.9);
  keyLight.position.set(8, 16, 12);
  scene.add(keyLight);

  const rimBack = new THREE.DirectionalLight(0x4fd1ff, 0.85);
  rimBack.position.set(-6, 8, -10);
  scene.add(rimBack);

  const goldLight = new THREE.PointLight(0xf5b83f, 1.6, 18);
  goldLight.position.set(-5.5, 3.2, 4.0);
  scene.add(goldLight);

  const cyanLight = new THREE.PointLight(0x4fd1ff, 1.8, 20);
  cyanLight.position.set(3.5, 3.6, 4.0);
  scene.add(cyanLight);

  // --- Precision CAD Materials ---
  const M = {
    acc: new THREE.MeshStandardMaterial({ roughness: 0.25, metalness: 0.75, emissiveIntensity: 0.65 }),
    ai: new THREE.MeshStandardMaterial({ roughness: 0.22, metalness: 0.7, emissiveIntensity: 0.65 }),
    live: new THREE.MeshStandardMaterial({ roughness: 0.25, metalness: 0.65, emissiveIntensity: 0.65 }),
    anodized: new THREE.MeshStandardMaterial({ roughness: 0.35, metalness: 0.82 }),
    slate: new THREE.MeshStandardMaterial({ roughness: 0.55, metalness: 0.45 }),
    chrome: new THREE.MeshStandardMaterial({ roughness: 0.18, metalness: 0.92 }),
    glass: new THREE.MeshPhysicalMaterial({ roughness: 0.12, metalness: 0.1, transmission: 0.45, transparent: true, opacity: 0.88 }),
    die: new THREE.MeshStandardMaterial({ roughness: 0.18, metalness: 0.6, emissiveIntensity: 0.95 }),
    pipe: new THREE.MeshStandardMaterial({ roughness: 0.35, metalness: 0.75 }),
    edgeCyan: new THREE.LineBasicMaterial({ transparent: true, opacity: 0.48 }),
    edgeGold: new THREE.LineBasicMaterial({ transparent: true, opacity: 0.55 }),
  };

  // Continuous Optical Hardware Bench underneath all 5 stages
  const bench = new THREE.Group();
  bench.position.y = -1.2;
  scene.add(bench);

  const floorPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(48, 28),
    new THREE.MeshStandardMaterial({ roughness: 0.88, metalness: 0.15 })
  );
  floorPlane.rotation.x = -Math.PI / 2;
  floorPlane.position.y = -0.06;
  bench.add(floorPlane);

  const grid = new THREE.GridHelper(36, 36);
  grid.position.y = -0.04;
  grid.material.transparent = true;
  bench.add(grid);

  // Machined optical rail spanning X = -8.4 .. +8.4
  const railSlab = new THREE.Mesh(new THREE.BoxGeometry(17.2, 0.14, 3.2), M.slate);
  railSlab.position.y = 0.04;
  bench.add(railSlab);
  const railEdges = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(17.22, 0.15, 3.22)), M.edgeCyan);
  railEdges.position.y = 0.04;
  bench.add(railEdges);

  let cAcc = new THREE.Color("#f5b83f");
  let cAi = new THREE.Color("#4fd1ff");
  let cLive = new THREE.Color("#45e08f");
  const nodeMats = [];

  function applyTheme() {
    const light = document.documentElement.dataset.theme === "light";
    const c = (n, f) => new THREE.Color(css(n) || f);
    cAcc = c("--accent", "#f5b83f");
    cAi = c("--ai", "#4fd1ff");
    cLive = c("--live", "#45e08f");

    M.acc.color.copy(cAcc); M.acc.emissive.copy(cAcc);
    M.ai.color.copy(cAi); M.ai.emissive.copy(cAi);
    M.live.color.copy(cLive); M.live.emissive.copy(cLive);
    M.die.color.copy(cAcc); M.die.emissive.copy(cAcc);

    M.anodized.color.setHex(light ? 0xd8ccb4 : 0x131f2c);
    M.slate.color.setHex(light ? 0xe5dac3 : 0x0f1923);
    M.chrome.color.setHex(light ? 0x6c5c46 : 0xaec2d4);
    M.glass.color.setHex(light ? 0xffffff : 0x1b2e42);
    M.pipe.color.setHex(light ? 0x9e8c6c : 0x24384b);
    M.edgeCyan.color.copy(cAi);
    M.edgeGold.color.copy(cAcc);

    floorPlane.material.color = c("--bg-2", light ? "#e2d6ba" : "#070c12");
    grid.material.color = c("--line", light ? "#c3b28c" : "#1a2836");
    grid.material.opacity = light ? 0.35 : 0.55;
    scene.fog = new THREE.Fog(c("--bg-2", light ? "#e2d6ba" : "#070c12"), 18, 42);
    bloom.strength = light ? 0.12 : 0.28;
  }
  applyTheme();
  new MutationObserver(applyTheme).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

  const ghost = new THREE.MeshBasicMaterial({ visible: false });
  const hit = [];

  function makeMountPad(x, trimMat) {
    const g = new THREE.Group();
    g.position.set(x, -1.08, 0);
    const pad = new THREE.Mesh(new THREE.BoxGeometry(2.35, 0.12, 2.35), M.anodized);
    g.add(pad);
    const rim = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(2.37, 0.13, 2.37)), trimMat);
    g.add(rim);
    scene.add(g);
  }

  // ----- 01 CAN FD Differential Bus (Crisp 3D traces + transceiver block) -----
  makeMountPad(X[0], M.edgeGold);
  const g1 = new THREE.Group(); g1.position.set(X[0], 0.05, 0); scene.add(g1);
  const BITS = [1, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0, 1];
  function buildSquareTrace(highY, lowY, zOff, mat) {
    const pts = [];
    let x = -1.08;
    const step = 2.16 / BITS.length;
    for (const b of BITS) {
      const y = b ? lowY : highY;
      pts.push(new THREE.Vector3(x, y, zOff), new THREE.Vector3(x + step * 0.94, y, zOff));
      x += step;
    }
    const curve = new THREE.CatmullRomCurve3(pts, false, "catmullrom", 0.02);
    return new THREE.Mesh(new THREE.TubeGeometry(curve, 120, 0.032, 8, false), mat);
  }
  const waveH = buildSquareTrace(0.72, 0.22, 0.28, M.acc);
  const waveL = buildSquareTrace(-0.52, -0.04, -0.28, M.ai);
  const scopeScreen = new THREE.Mesh(new THREE.BoxGeometry(2.3, 1.55, 0.06), M.glass);
  scopeScreen.position.set(0, 0.1, 0);
  const scopeFrame = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(2.34, 1.59, 0.08)), M.edgeGold);
  scopeFrame.position.copy(scopeScreen.position);
  g1.add(scopeScreen, scopeFrame, waveH, waveL);
  hit.push(new THREE.Mesh(new THREE.BoxGeometry(2.6, 2.2, 2.2), ghost));
  hit[0].position.set(X[0], 0.1, 0);

  // ----- 02 Automotive MCU Silicon (QFP-32 IC package + brushed heat spreader + die) -----
  makeMountPad(X[1], M.edgeGold);
  const g2 = new THREE.Group(); g2.position.set(X[1], -0.22, 0); scene.add(g2);
  const icBody = new THREE.Mesh(new THREE.BoxGeometry(1.76, 0.28, 1.76), M.anodized);
  const icEdges = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(1.78, 0.29, 1.78)), M.edgeGold);
  const spreader = new THREE.Mesh(new THREE.BoxGeometry(1.18, 0.07, 1.18), M.chrome);
  spreader.position.y = 0.17;
  const dieCore = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.06, 0.58), M.die);
  dieCore.position.y = 0.22;
  g2.add(icBody, icEdges, spreader, dieCore);
  for (let i = 0; i < 8; i++) {
    const o = -0.7 + i * 0.2;
    const leadZ = new THREE.BoxGeometry(0.06, 0.05, 0.26);
    const leadX = new THREE.BoxGeometry(0.26, 0.05, 0.06);
    const p1 = new THREE.Mesh(leadZ, M.chrome); p1.position.set(o, -0.08, 1.0);
    const p2 = new THREE.Mesh(leadZ, M.chrome); p2.position.set(o, -0.08, -1.0);
    const p3 = new THREE.Mesh(leadX, M.chrome); p3.position.set(1.0, -0.08, o);
    const p4 = new THREE.Mesh(leadX, M.chrome); p4.position.set(-1.0, -0.08, o);
    g2.add(p1, p2, p3, p4);
  }
  const mcuRing = new THREE.Mesh(new THREE.TorusGeometry(0.95, 0.016, 12, 64), M.acc);
  mcuRing.rotation.x = Math.PI / 2;
  mcuRing.position.y = 0.52;
  g2.add(mcuRing);
  hit.push(new THREE.Mesh(new THREE.BoxGeometry(2.5, 2.0, 2.5), ghost));
  hit[1].position.set(X[1], 0.0, 0);

  // ----- 03 Hybrid Vector Tensor Cube (3x3x2 dark-glass & active voxel array) -----
  makeMountPad(X[2], M.edgeCyan);
  const g3 = new THREE.Group(); g3.position.set(X[2], 0.12, 0); scene.add(g3);
  const tensorCage = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(1.92, 1.52, 1.92)), M.edgeCyan);
  tensorCage.position.y = 0.08;
  g3.add(tensorCage);
  const cubes = [];
  for (let z = 0; z < 3; z++) {
    for (let x = 0; x < 3; x++) {
      const h = 0.32 + ((x * 5 + z * 3) % 4) * 0.16;
      const isHot = (x + z) % 2 === 0;
      const mat = isHot ? ((x === 1 && z === 1) ? M.acc : M.ai) : M.anodized;
      const voxel = new THREE.Mesh(new THREE.BoxGeometry(0.42, h, 0.42), mat);
      const baseY = -0.58 + h / 2;
      voxel.position.set((x - 1) * 0.56, baseY, (z - 1) * 0.56);
      voxel.userData.baseY = baseY;
      voxel.userData.phase = x * 0.8 + z * 1.1;
      g3.add(voxel);
      cubes.push(voxel);
    }
  }
  hit.push(new THREE.Mesh(new THREE.BoxGeometry(2.4, 2.2, 2.4), ghost));
  hit[2].position.set(X[2], 0.15, 0);

  // ----- 04 Multi-Plane Neural Architecture (3 parallel glass layer slices + crisp nodes) -----
  makeMountPad(X[3], M.edgeCyan);
  const g4 = new THREE.Group(); g4.position.set(X[3], 0.28, 0); scene.add(g4);
  const NET = [3, 4, 3];
  const nodes = [];
  NET.forEach((n, li) => {
    const lx = -0.78 + li * 0.78;
    const slice = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(0.06, 1.72, 1.48)), M.edgeCyan);
    slice.position.x = lx;
    g4.add(slice);
    for (let k = 0; k < n; k++) {
      const mat = new THREE.MeshStandardMaterial({ roughness: 0.22, metalness: 0.7, emissiveIntensity: 0.55 });
      nodeMats.push(mat);
      const node = new THREE.Mesh(new THREE.OctahedronGeometry(0.13, 1), mat);
      node.position.set(lx, (k - (n - 1) / 2) * 0.46, (k % 2 ? 0.28 : -0.28));
      node.userData.layer = li;
      g4.add(node);
      nodes.push(node);
    }
  });
  const ep = [];
  nodes.forEach((a) => nodes.forEach((b) => { if (b.userData.layer === a.userData.layer + 1) ep.push(a.position, b.position); }));
  g4.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(ep), M.edgeCyan));
  hit.push(new THREE.Mesh(new THREE.BoxGeometry(2.6, 2.4, 2.2), ghost));
  hit[3].position.set(X[3], 0.28, 0);

  // ----- 05 Grounded Answer Terminal (Illuminated angled glass display facing camera) -----
  makeMountPad(X[4], M.edgeCyan);
  const g5 = new THREE.Group();
  g5.position.set(X[4], 0.35, 0);
  g5.rotation.y = -0.28; // angled cleanly toward isometric viewer so it's 100% bright & legible
  scene.add(g5);

  const termBack = new THREE.Mesh(new THREE.BoxGeometry(1.76, 2.1, 0.12), M.anodized);
  const termFrame = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(1.8, 2.14, 0.15)), M.edgeCyan);
  const termScreen = new THREE.Mesh(new THREE.BoxGeometry(1.62, 1.94, 0.04), M.glass);
  termScreen.position.z = 0.06;
  g5.add(termBack, termFrame, termScreen);

  const bars = [0.86, 0.72, 0.8, 0.56].map((f, i) => {
    const geo = new THREE.BoxGeometry(1.28 * f, 0.075, 0.04);
    geo.translate((1.28 * f) / 2, 0, 0);
    const b = new THREE.Mesh(geo, i === 0 ? M.ai : M.chrome);
    b.position.set(-0.64, 0.64 - i * 0.26, 0.11);
    g5.add(b);
    return b;
  });
  const cites = [0, 1].map((i) => {
    const c = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.2, 0.05), i === 0 ? M.acc : M.live);
    c.position.set(-0.4 + i * 0.56, -0.56, 0.11);
    g5.add(c);
    return c;
  });
  const halo = new THREE.Mesh(new THREE.TorusGeometry(1.25, 0.015, 12, 64), M.live);
  halo.rotation.x = Math.PI * 0.42;
  g5.add(halo);
  hit.push(new THREE.Mesh(new THREE.BoxGeometry(2.4, 2.6, 1.8), ghost));
  hit[4].position.set(X[4], 0.35, 0);

  hit.forEach((h, i) => { h.userData.i = i; scene.add(h); });

  // ----- Recessed Optical Conduits + Safe Clamped Data Packets -----
  const conduits = [];
  const packets = [];
  for (let i = 0; i < 4; i++) {
    const a = new THREE.Vector3(X[i] + 1.18, -0.92, 0);
    const b = new THREE.Vector3(X[i + 1] - 1.18, -0.92, 0);
    const mid = a.clone().lerp(b, 0.5);
    mid.y = -0.58;
    const curve = new THREE.CatmullRomCurve3([a, mid, b]);
    conduits.push(curve);
    scene.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 28, 0.032, 8, false), M.pipe));

    for (let k = 0; k < 2; k++) {
      const pMat = i < 2 ? M.acc : i === 2 ? M.ai : M.live;
      const p = new THREE.Mesh(new THREE.SphereGeometry(0.085, 14, 10), pMat);
      scene.add(p);
      packets.push({ mesh: p, seg: i, t: k * 0.5, speed: 0.44 });
    }
  }

  // ----- Camera Presets & Stage Card Fly-To -----
  let flyPos = null;
  let flyTarget = null;
  const PRESETS = {
    iso: { pos: new THREE.Vector3(0.4, 5.8, 15.8), target: new THREE.Vector3(0, 0.25, 0) },
    top: { pos: new THREE.Vector3(0, 16.2, 3.8), target: new THREE.Vector3(0, 0, 0) },
    low: { pos: new THREE.Vector3(-4.0, 2.6, 13.4), target: new THREE.Vector3(0.4, 0.3, 0) },
  };
  let autoOrbit = !reduce;

  function flyTo(pos, target) {
    flyPos = pos.clone();
    flyTarget = target.clone();
  }

  document.querySelectorAll("[data-d3-cam]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const k = btn.getAttribute("data-d3-cam");
      if (k === "orbit") {
        autoOrbit = !autoOrbit;
        btn.classList.toggle("active", autoOrbit);
        return;
      }
      if (PRESETS[k]) {
        autoOrbit = false;
        flyTo(PRESETS[k].pos, PRESETS[k].target);
        document.querySelectorAll("[data-d3-cam]").forEach((b) => {
          if (b.getAttribute("data-d3-cam") !== "orbit") b.classList.toggle("active", b === btn);
        });
      }
    });
  });

  document.querySelectorAll("[data-d3-focus]").forEach((card) => {
    card.addEventListener("click", () => {
      const idx = Number(card.getAttribute("data-d3-focus"));
      if (Number.isNaN(idx) || idx < 0 || idx >= X.length) return;
      autoOrbit = false;
      flyTo(new THREE.Vector3(X[idx] * 0.85, 2.7, 7.2), new THREE.Vector3(X[idx], 0.25, 0));
      document.querySelectorAll("[data-d3-focus]").forEach((c) => c.classList.toggle("active", c === card));
    });
  });

  controls.addEventListener("start", () => {
    flyPos = null;
    flyTarget = null;
    autoOrbit = false;
  });

  // ----- Hover Tooltips -----
  const tip = document.getElementById("d3-tip");
  const ray = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  let hover = -1;

  canvas.addEventListener("pointermove", (e) => {
    const r = canvas.getBoundingClientRect();
    mouse.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(mouse, camera);
    const h = ray.intersectObjects(hit)[0];
    hover = h ? h.object.userData.i : -1;
    canvas.style.cursor = hover >= 0 ? "pointer" : "grab";
    if (tip && hover >= 0 && stages[hover]) {
      tip.hidden = false;
      tip.querySelector("b").textContent = `${stages[hover].n} · ${stages[hover].name}`;
      tip.querySelector("span").textContent = stages[hover].desc;
      tip.style.left = Math.min(r.width - 295, Math.max(12, e.clientX - r.left + 16)) + "px";
      tip.style.top = Math.max(12, e.clientY - r.top + 16) + "px";
    } else if (tip) {
      tip.hidden = true;
    }
  });
  canvas.addEventListener("pointerleave", () => { if (tip) tip.hidden = true; hover = -1; });
  canvas.addEventListener("dblclick", () => { if (hover >= 0 && stages[hover]) location.href = stages[hover].href; });

  const labelEls = Array.from(document.querySelectorAll("#d3-labels .lab"));
  const tmpV = new THREE.Vector3();

  function resize() {
    const r = stage.getBoundingClientRect();
    const w = Math.max(300, r.width);
    const h = Math.max(240, r.height);
    renderer.setSize(w, h, false);
    composer.setSize(w, h);
    bloom.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  new ResizeObserver(resize).observe(stage);

  let visible = true;
  new IntersectionObserver((entries) => { visible = entries[0]?.isIntersecting ?? true; }, { threshold: 0.05 }).observe(stage);

  let startTime = 0;
  let last = 0;

  function renderFrame(now) {
    requestAnimationFrame(renderFrame);
    if (!startTime) startTime = now;
    if (!visible && fixedT === null) { last = now; return; }
    const dt = last ? Math.max(0, Math.min((now - last) / 1000, 0.05)) : 0.016;
    last = now;
    const elapsed = Math.max(0, (now - startTime) / 1000);
    const t = fixedT !== null ? fixedT : (reduce ? 6.2 : elapsed % LOOP);
    const f = fixedT !== null || reduce ? 1 : fade(t);

    if (flyPos && flyTarget) {
      camera.position.lerp(flyPos, 0.08);
      controls.target.lerp(flyTarget, 0.08);
      if (camera.position.distanceTo(flyPos) < 0.06) { flyPos = null; flyTarget = null; }
    } else if (autoOrbit && fixedT === null) {
      const ang = elapsed * 0.18;
      camera.position.x = Math.sin(ang) * 3.8;
      camera.position.z = 15.2 + Math.cos(ang) * 1.0;
    }
    controls.update();

    waveH.position.y = Math.sin(elapsed * 2.2) * 0.04;
    waveL.position.y = -Math.sin(elapsed * 2.2) * 0.04;

    M.die.emissiveIntensity = 0.4 + ramp(t, 1.2, 0.6) * f * 0.85;
    mcuRing.rotation.z += dt * 0.9;

    cubes.forEach((c, i) => {
      const k = 0.68 + 0.32 * ramp(t, 1.8 + i * 0.08, 0.45) * f;
      c.scale.y = k;
      c.position.y = c.userData.baseY + Math.sin(elapsed * 2.4 + c.userData.phase) * 0.06;
    });

    g4.rotation.y = Math.sin(elapsed * 0.6) * 0.18;
    nodes.forEach((n, idx) => {
      const act = ramp(t, 3.2 + n.userData.layer * 0.35, 0.45) * f;
      const col = cAi.clone().lerp(cAcc, act);
      nodeMats[idx].color.copy(col);
      nodeMats[idx].emissive.copy(col);
      nodeMats[idx].emissiveIntensity = 0.35 + act * 0.65;
      n.scale.setScalar(0.95 + act * 0.22);
    });

    bars.forEach((b, i) => { b.scale.x = 0.65 + 0.35 * ramp(t, 5.0 + i * 0.2, 0.42) * f; });
    cites.forEach((c, i) => { c.scale.setScalar(0.75 + 0.25 * ramp(t, 5.9 + i * 0.2, 0.35) * f); });
    halo.rotation.z += dt * 0.55;
    g5.position.y = 0.35 + Math.sin(elapsed * 1.8) * 0.05;

    packets.forEach((p) => {
      if (!reduce && fixedT === null) {
        p.t = ((p.t + dt * p.speed) % 1 + 1) % 1;
      }
      p.mesh.position.copy(conduits[p.seg].getPoint(clamp(p.t, 0, 0.9999)));
    });

    composer.render();

    const rw = stage.clientWidth;
    const rh = stage.clientHeight;
    labelEls.forEach((el, i) => {
      tmpV.set(X[i], -1.48, 1.55).project(camera);
      el.style.left = `${(tmpV.x * 0.5 + 0.5) * rw}px`;
      el.style.top = `${(-tmpV.y * 0.5 + 0.5) * rh}px`;
      el.style.opacity = tmpV.z < 1 ? "1" : "0";
    });
  }
  requestAnimationFrame(renderFrame);
}
