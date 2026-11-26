// Premium PBR Interactive 3D Showcase for /3d/:
// Five sculptural stages from a CAN FD signal frame to a grounded AI answer with sources.
// Features ACESFilmic tone mapping, PBR metallic/glass materials, curved fiber conduits,
// smooth camera fly-to presets, hover tooltips, and theme reactivity (dark HUD / light Retro-Tech).

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

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
  renderer.toneMappingExposure = 1.15;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(36, 16 / 9, 0.1, 120);
  camera.position.set(0.6, 6.4, 16.2);

  const controls = new OrbitControls(camera, canvas);
  Object.assign(controls, {
    enableDamping: true,
    dampingFactor: 0.06,
    enablePan: false,
    minDistance: 6.5,
    maxDistance: 26,
    maxPolarAngle: Math.PI * 0.48,
  });
  controls.target.set(0, 0.25, 0);

  // --- Studio 3-Point + Accent Lighting ---
  const hemi = new THREE.HemisphereLight(0xdbeafe, 0x0b1118, 0.85);
  scene.add(hemi);

  const keyLight = new THREE.DirectionalLight(0xffffff, 1.55);
  keyLight.position.set(9, 16, 11);
  scene.add(keyLight);

  const goldLight = new THREE.PointLight(0xf5b83f, 2.2, 22);
  goldLight.position.set(-6.5, 4.2, 3.5);
  scene.add(goldLight);

  const cyanLight = new THREE.PointLight(0x4fd1ff, 2.4, 24);
  cyanLight.position.set(4.5, 4.5, -3.5);
  scene.add(cyanLight);

  const liveLight = new THREE.PointLight(0x45e08f, 1.6, 18);
  liveLight.position.set(6.8, 3.6, 3.0);
  scene.add(liveLight);

  // --- Theme-reactive PBR Materials ---
  const M = {
    acc: new THREE.MeshStandardMaterial({ roughness: 0.28, metalness: 0.65, emissiveIntensity: 0.42 }),
    ai: new THREE.MeshStandardMaterial({ roughness: 0.22, metalness: 0.55, emissiveIntensity: 0.48 }),
    live: new THREE.MeshStandardMaterial({ roughness: 0.28, metalness: 0.45, emissiveIntensity: 0.45 }),
    panel: new THREE.MeshStandardMaterial({ roughness: 0.45, metalness: 0.35 }),
    pedestal: new THREE.MeshStandardMaterial({ roughness: 0.55, metalness: 0.3 }),
    glass: new THREE.MeshPhysicalMaterial({ roughness: 0.12, metalness: 0.1, transmission: 0.35, transparent: true, opacity: 0.85 }),
    metal: new THREE.MeshStandardMaterial({ roughness: 0.25, metalness: 0.85 }),
    muted: new THREE.MeshStandardMaterial({ roughness: 0.5, metalness: 0.2 }),
    die: new THREE.MeshStandardMaterial({ roughness: 0.18, metalness: 0.5, emissiveIntensity: 0.9, transparent: true }),
    pipe: new THREE.MeshStandardMaterial({ roughness: 0.35, metalness: 0.6, transparent: true, opacity: 0.65 }),
    edge: new THREE.LineBasicMaterial({ transparent: true, opacity: 0.32 }),
    ring: new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.35, side: THREE.DoubleSide }),
  };

  // Architectural floor + subtle dual grid
  const floorPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(46, 26),
    new THREE.MeshStandardMaterial({ roughness: 0.82, metalness: 0.18 })
  );
  floorPlane.rotation.x = -Math.PI / 2;
  floorPlane.position.y = -1.22;
  scene.add(floorPlane);

  const grid = new THREE.GridHelper(38, 38);
  grid.position.y = -1.2;
  grid.material.transparent = true;
  scene.add(grid);

  const nodeMats = [];
  let cAcc = new THREE.Color("#f5b83f");
  let cAi = new THREE.Color("#4fd1ff");
  let cLive = new THREE.Color("#45e08f");

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
    M.panel.color = c("--panel", light ? "#f8f1e1" : "#111b26");
    M.pedestal.color = c("--panel-2", light ? "#e6dac0" : "#162230");
    M.glass.color = c("--panel-2", light ? "#ffffff" : "#1a2a3a");
    M.metal.color = c("--muted", light ? "#7c6b55" : "#9db0bf");
    M.muted.color = c("--muted", "#8d9ca8");
    M.pipe.color = c("--line-2", "#2b3c4a");
    M.edge.color.copy(cAi);
    M.ring.color.copy(cAi);

    floorPlane.material.color = c("--bg-2", light ? "#e2d6ba" : "#080e15");
    grid.material.color = c("--line", light ? "#c3b28c" : "#1f2e3c");
    grid.material.opacity = light ? 0.38 : 0.65;
    scene.fog = new THREE.Fog(c("--bg-2", light ? "#e2d6ba" : "#080e15"), 17, 42);
    goldLight.color.copy(cAcc);
    cyanLight.color.copy(cAi);
    liveLight.color.copy(cLive);
  }
  applyTheme();
  new MutationObserver(applyTheme).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

  const ghost = new THREE.MeshBasicMaterial({ visible: false });
  const hit = [];
  const pedestals = [];

  function makePedestal(x, accentMat) {
    const pg = new THREE.Group();
    pg.position.set(x, -1.2, 0);
    const base = new THREE.Mesh(new THREE.CylinderGeometry(1.38, 1.54, 0.24, 32), M.pedestal);
    base.position.y = 0.12;
    pg.add(base);
    const trim = new THREE.Mesh(new THREE.TorusGeometry(1.42, 0.028, 12, 48), accentMat);
    trim.rotation.x = Math.PI / 2;
    trim.position.y = 0.25;
    pg.add(trim);
    scene.add(pg);
    pedestals.push({ group: pg, trim });
    return pg;
  }

  // ----- 01 CAN FD Signal Bus (Extruded 3D differential tubes) -----
  makePedestal(X[0], M.acc);
  const g1 = new THREE.Group(); g1.position.set(X[0], 0.1, 0); scene.add(g1);
  const BITS = [1, 0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 1];
  function buildWaveTube(rec, dom, zOff, mat) {
    const pts = [];
    let x = -1.25;
    const step = 2.5 / BITS.length;
    for (const b of BITS) {
      const y = b ? rec : dom;
      pts.push(new THREE.Vector3(x, y, zOff), new THREE.Vector3(x + step * 0.92, y, zOff));
      x += step;
    }
    const curve = new THREE.CatmullRomCurve3(pts, false, "catmullrom", 0.08);
    return new THREE.Mesh(new THREE.TubeGeometry(curve, 96, 0.048, 10, false), mat);
  }
  const waveH = buildWaveTube(0.28, 0.82, 0.26, M.acc);
  const waveL = buildWaveTube(-0.12, -0.58, -0.26, M.ai);
  g1.add(waveH, waveL);
  const busPlate = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.08, 1.15), M.glass);
  busPlate.position.y = -0.82;
  g1.add(busPlate);
  hit.push(new THREE.Mesh(new THREE.BoxGeometry(3.0, 2.4, 2.4), ghost));
  hit[0].position.set(X[0], 0.2, 0);

  // ----- 02 Automotive MCU Silicon Package -----
  makePedestal(X[1], M.acc);
  const g2 = new THREE.Group(); g2.position.set(X[1], -0.1, 0); scene.add(g2);
  const body = new THREE.Mesh(new THREE.BoxGeometry(1.78, 0.34, 1.78), M.panel);
  g2.add(body);
  const heatSpreader = new THREE.Mesh(new THREE.BoxGeometry(1.22, 0.08, 1.22), M.metal);
  heatSpreader.position.y = 0.2;
  g2.add(heatSpreader);
  const dieCore = new THREE.Mesh(new THREE.BoxGeometry(0.64, 0.06, 0.64), M.die);
  dieCore.position.y = 0.26;
  g2.add(dieCore);
  for (let i = 0; i < 6; i++) {
    const o = -0.65 + i * 0.26;
    const p1 = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.06, 0.3), M.metal); p1.position.set(o, -0.1, 1.02);
    const p2 = p1.clone(); p2.position.set(o, -0.1, -1.02);
    const p3 = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.06, 0.08), M.metal); p3.position.set(1.02, -0.1, o);
    const p4 = p3.clone(); p4.position.set(-1.02, -0.1, o);
    g2.add(p1, p2, p3, p4);
  }
  const mcuRing = new THREE.Mesh(new THREE.TorusGeometry(1.05, 0.02, 10, 48), M.acc);
  mcuRing.rotation.x = Math.PI / 2;
  mcuRing.position.y = 0.48;
  g2.add(mcuRing);
  hit.push(new THREE.Mesh(new THREE.BoxGeometry(2.6, 2.2, 2.6), ghost));
  hit[1].position.set(X[1], 0.1, 0);

  // ----- 03 Token Embedding Crystal Matrix -----
  makePedestal(X[2], M.ai);
  const g3 = new THREE.Group(); g3.position.set(X[2], 0.05, 0); scene.add(g3);
  const cubes = [];
  for (let j = 0; j < 3; j++) {
    for (let i = 0; i < 3; i++) {
      const h = 0.36 + ((i * 5 + j * 3) % 4) * 0.16;
      const mat = [M.ai, M.acc, M.live][(i + j) % 3];
      const cube = new THREE.Mesh(new THREE.BoxGeometry(0.42, h, 0.42), mat);
      const baseY = -0.58 + h / 2;
      cube.position.set((i - 1) * 0.56, baseY, (j - 1) * 0.56);
      cube.userData.baseY = baseY;
      cube.userData.phase = i * 0.7 + j * 0.9;
      g3.add(cube);
      cubes.push(cube);
    }
  }
  hit.push(new THREE.Mesh(new THREE.BoxGeometry(2.4, 2.2, 2.4), ghost));
  hit[2].position.set(X[2], 0.2, 0);

  // ----- 04 Sculptural Neural Core -----
  makePedestal(X[3], M.ai);
  const g4 = new THREE.Group(); g4.position.set(X[3], 0.35, 0); scene.add(g4);
  const NET = [3, 4, 4, 2];
  const nodes = [];
  NET.forEach((n, li) => {
    for (let k = 0; k < n; k++) {
      const mat = new THREE.MeshStandardMaterial({ roughness: 0.2, metalness: 0.5, emissiveIntensity: 0.5 });
      nodeMats.push(mat);
      const node = new THREE.Mesh(new THREE.SphereGeometry(0.16, 24, 18), mat);
      node.position.set(-1.14 + li * 0.76, (k - (n - 1) / 2) * 0.56, (k % 2 ? 0.32 : -0.32));
      node.userData.layer = li;
      g4.add(node);
      nodes.push(node);
    }
  });
  const ep = [];
  nodes.forEach((a) => nodes.forEach((b) => { if (b.userData.layer === a.userData.layer + 1) ep.push(a.position, b.position); }));
  g4.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(ep), M.edge));
  hit.push(new THREE.Mesh(new THREE.BoxGeometry(2.9, 2.6, 2.2), ghost));
  hit[3].position.set(X[3], 0.35, 0);

  // ----- 05 Grounded Answer & Citations Monolith -----
  makePedestal(X[4], M.live);
  const g5 = new THREE.Group(); g5.position.set(X[4], 0.45, 0); scene.add(g5);
  const docBack = new THREE.Mesh(new THREE.BoxGeometry(1.72, 2.18, 0.14), M.panel);
  const docGlass = new THREE.Mesh(new THREE.BoxGeometry(1.78, 2.24, 0.06), M.glass);
  docGlass.position.z = 0.08;
  g5.add(docBack, docGlass);
  const bars = [0.84, 0.72, 0.8, 0.54].map((f, i) => {
    const geo = new THREE.BoxGeometry(1.32 * f, 0.08, 0.04);
    geo.translate((1.32 * f) / 2, 0, 0);
    const b = new THREE.Mesh(geo, M.metal);
    b.position.set(-0.66, 0.68 - i * 0.28, 0.14);
    g5.add(b);
    return b;
  });
  const cites = [0, 1].map((i) => {
    const c = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.22, 0.05), i === 0 ? M.acc : M.live);
    c.position.set(-0.42 + i * 0.56, -0.58, 0.14);
    g5.add(c);
    return c;
  });
  const halo = new THREE.Mesh(new THREE.TorusGeometry(1.38, 0.018, 10, 64), M.live);
  halo.rotation.x = Math.PI * 0.38;
  g5.add(halo);
  hit.push(new THREE.Mesh(new THREE.BoxGeometry(2.4, 2.8, 1.8), ghost));
  hit[4].position.set(X[4], 0.45, 0);

  hit.forEach((h, i) => { h.userData.i = i; scene.add(h); });

  // ----- Curved Fiber-Optic Conduits + Luminous Data Packets -----
  const conduits = [];
  const packets = [];
  for (let i = 0; i < 4; i++) {
    const a = new THREE.Vector3(X[i] + 1.15, -0.78, 0);
    const b = new THREE.Vector3(X[i + 1] - 1.15, -0.78, 0);
    const mid = a.clone().lerp(b, 0.5);
    mid.y = -0.25;
    const curve = new THREE.CatmullRomCurve3([a, mid, b]);
    conduits.push(curve);
    scene.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 32, 0.045, 10, false), M.pipe));

    for (let k = 0; k < 2; k++) {
      const pMat = new THREE.MeshBasicMaterial({ color: i < 2 ? cAcc : i === 2 ? cAi : cLive });
      const p = new THREE.Mesh(new THREE.SphereGeometry(0.11, 16, 12), pMat);
      scene.add(p);
      packets.push({ mesh: p, seg: i, t: k * 0.5, speed: 0.42 });
    }
  }

  // ----- Ambient Telemetry Dust -----
  const dustCount = 90;
  const dustPos = new Float32Array(dustCount * 3);
  for (let i = 0; i < dustCount; i++) {
    dustPos[i * 3] = (Math.random() - 0.5) * 24;
    dustPos[i * 3 + 1] = -0.8 + Math.random() * 6.5;
    dustPos[i * 3 + 2] = (Math.random() - 0.5) * 12;
  }
  const dustGeo = new THREE.BufferGeometry();
  dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
  const dust = new THREE.Points(dustGeo, new THREE.PointsMaterial({ color: 0x4fd1ff, size: 0.075, transparent: true, opacity: 0.45 }));
  scene.add(dust);

  // ----- Smooth Camera Fly-To & Presets -----
  let flyPos = null;
  let flyTarget = null;
  const PRESETS = {
    iso: { pos: new THREE.Vector3(0.6, 6.4, 16.2), target: new THREE.Vector3(0, 0.25, 0) },
    top: { pos: new THREE.Vector3(0, 16.5, 4.2), target: new THREE.Vector3(0, 0, 0) },
    low: { pos: new THREE.Vector3(-4.2, 2.8, 13.8), target: new THREE.Vector3(0.5, 0.4, 0) },
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
      flyTo(new THREE.Vector3(X[idx] * 0.82, 3.0, 7.6), new THREE.Vector3(X[idx], 0.35, 0));
      document.querySelectorAll("[data-d3-focus]").forEach((c) => c.classList.toggle("active", c === card));
    });
  });

  controls.addEventListener("start", () => {
    flyPos = null;
    flyTarget = null;
    autoOrbit = false;
  });

  // ----- Hover Tooltips & Click Navigation -----
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

  // ----- Projected Stage Labels -----
  const labelEls = Array.from(document.querySelectorAll("#d3-labels .lab"));
  const tmpV = new THREE.Vector3();

  function resize() {
    const r = stage.getBoundingClientRect();
    const w = Math.max(300, r.width);
    const h = Math.max(240, r.height);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  new ResizeObserver(resize).observe(stage);

  let visible = true;
  new IntersectionObserver((entries) => { visible = entries[0]?.isIntersecting ?? true; }, { threshold: 0.05 }).observe(stage);

  const t0 = performance.now();
  let last = t0;

  function renderFrame(now) {
    requestAnimationFrame(renderFrame);
    if (!visible && fixedT === null) { last = now; return; }
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    const t = fixedT !== null ? fixedT : (reduce ? 5.6 : ((now - t0) / 1000) % LOOP);
    const f = fixedT !== null || reduce ? 1 : fade(t);

    // Smooth camera fly-to or gentle studio orbit
    if (flyPos && flyTarget) {
      camera.position.lerp(flyPos, 0.075);
      controls.target.lerp(flyTarget, 0.075);
      if (camera.position.distanceTo(flyPos) < 0.06) { flyPos = null; flyTarget = null; }
    } else if (autoOrbit && fixedT === null) {
      const ang = now * 0.00018;
      camera.position.x = Math.sin(ang) * 4.2;
      camera.position.z = 15.2 + Math.cos(ang) * 1.1;
    }
    controls.update();

    // Stage 1: gentle wave breathing
    waveH.position.y = Math.sin(now * 0.0022) * 0.06;
    waveL.position.y = -Math.sin(now * 0.0022) * 0.06;

    // Stage 2: MCU die pulse + orbital ring
    M.die.emissiveIntensity = 0.35 + ramp(t, 1.3, 0.6) * f * 1.1;
    mcuRing.rotation.z += dt * 0.9;

    // Stage 3: Levitating token crystals
    cubes.forEach((c, i) => {
      const k = ramp(t, 2.0 + i * 0.1, 0.45) * f;
      c.scale.y = Math.max(0.08, k);
      c.position.y = c.userData.baseY + Math.sin(now * 0.0024 + c.userData.phase) * 0.09;
    });

    // Stage 4: Neural core sweeping activation + slow sculptural rotation
    g4.rotation.y = Math.sin(now * 0.0007) * 0.25;
    nodes.forEach((n, idx) => {
      const act = ramp(t, 3.3 + n.userData.layer * 0.35, 0.45) * f;
      const col = cAi.clone().lerp(cAcc, act);
      nodeMats[idx].color.copy(col);
      nodeMats[idx].emissive.copy(col);
      nodeMats[idx].emissiveIntensity = 0.25 + act * 0.9;
      n.scale.setScalar(0.92 + act * 0.26);
    });

    // Stage 5: Answer bars reveal + rotating verification halo
    bars.forEach((b, i) => { b.scale.x = Math.max(0.02, ramp(t, 5.1 + i * 0.22, 0.42) * f); });
    cites.forEach((c, i) => { c.scale.setScalar(Math.max(0.02, ramp(t, 6.0 + i * 0.2, 0.35) * f)); });
    halo.rotation.z += dt * 0.55;
    g5.position.y = 0.45 + Math.sin(now * 0.0018) * 0.07;

    // Luminous packets flowing along curved fiber conduits
    packets.forEach((p) => {
      if (!reduce && fixedT === null) p.t = (p.t + dt * p.speed) % 1;
      p.mesh.position.copy(conduits[p.seg].getPoint(p.t));
    });

    dust.rotation.y += dt * 0.025;
    renderer.render(scene, camera);

    // Project 3D pedestal positions to 2D HUD labels
    const rw = stage.clientWidth;
    const rh = stage.clientHeight;
    labelEls.forEach((el, i) => {
      tmpV.set(X[i], -1.55, 1.45).project(camera);
      el.style.left = `${(tmpV.x * 0.5 + 0.5) * rw}px`;
      el.style.top = `${(-tmpV.y * 0.5 + 0.5) * rh}px`;
      el.style.opacity = tmpV.z < 1 ? "1" : "0";
    });
  }
  requestAnimationFrame(renderFrame);
}
