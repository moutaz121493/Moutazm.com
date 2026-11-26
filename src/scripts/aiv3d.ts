import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";

document.querySelectorAll<HTMLElement>(".aiv3d").forEach((root) => {
  const raw = root.dataset.spec;
  const canvas = root.querySelector<HTMLCanvasElement>("[data-canvas]");
  if (!raw || !canvas) return;
  const spec = JSON.parse(raw);

  const tabs = Array.from(root.querySelectorAll<HTMLButtonElement>("[data-sc]"));
  const camBtns = Array.from(root.querySelectorAll<HTMLButtonElement>("[data-cam]"));
  const stepCards = Array.from(root.querySelectorAll<HTMLElement>("[data-step-card]"));
  const nodeNameEl = root.querySelector<HTMLElement>("[data-node-name]");
  const badgeEl = root.querySelector<HTMLElement>("[data-badge]");
  const stepEl = root.querySelector<HTMLElement>("[data-step-num]");
  const latEl = root.querySelector<HTMLElement>("[data-lat]");
  const costEl = root.querySelector<HTMLElement>("[data-cost]");
  const guardEl = root.querySelector<HTMLElement>("[data-guard]");
  const toggleBtn = root.querySelector<HTMLButtonElement>("[data-toggle]");

  const playTxt = root.dataset.play || "Auto-Play";
  const pauseTxt = root.dataset.pause || "Pause";
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let curScenario = 0;
  let curStep = 0;
  let autoPlay = !reduced;
  let stepTimer = 0;

  let renderer: THREE.WebGLRenderer | null = null;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  } catch {
    return;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.04;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 16 / 10, 0.1, 100);

  // Selective high-threshold bloom: crisp CAD metal & glass, zero whiteout!
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(640, 420), 0.26, 0.32, 0.85);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());

  const camTargets = {
    iso: { theta: 0.56, phi: 0.82, dist: 14.2 },
    top: { theta: 0.02, phi: 0.24, dist: 15.0 },
    front: { theta: 0.24, phi: 1.08, dist: 12.8 },
  };
  let targetCam = { ...camTargets.iso };
  let currentCam = { ...camTargets.iso };

  scene.add(new THREE.HemisphereLight(0xe2e8f0, 0x090f16, 0.95));
  const dirLight = new THREE.DirectionalLight(0xffffff, 1.75);
  dirLight.position.set(8, 14, 10);
  scene.add(dirLight);
  const rimLight = new THREE.PointLight(0x4fd1ff, 1.6, 26);
  rimLight.position.set(-7, 5, -5);
  scene.add(rimLight);

  // Architectural CAD base plate + grid
  const baseMat = new THREE.MeshStandardMaterial({ color: 0x0d1620, roughness: 0.78, metalness: 0.28 });
  const baseMesh = new THREE.Mesh(new THREE.BoxGeometry(14.8, 0.16, 7.2), baseMat);
  baseMesh.position.y = -0.09;
  scene.add(baseMesh);

  const baseRim = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.BoxGeometry(14.82, 0.17, 7.22)),
    new THREE.LineBasicMaterial({ color: 0x263b4f, transparent: true, opacity: 0.65 })
  );
  baseRim.position.y = -0.09;
  scene.add(baseRim);

  const grid = new THREE.GridHelper(14.4, 18, 0x264059, 0x162636);
  grid.scale.set(1, 1, 0.48);
  grid.position.y = 0.01;
  scene.add(grid);

  const positions = [
    new THREE.Vector3(-5.2, 0, 1.05),
    new THREE.Vector3(-2.6, 0, -1.05),
    new THREE.Vector3(0.0, 0, 0.95),
    new THREE.Vector3(2.6, 0, -1.05),
    new THREE.Vector3(5.2, 0, 1.05),
  ];

  const kindColors: Record<string, number> = {
    in: 0x45e08f,
    sec: 0xf5b83f,
    core: 0x4fd1ff,
    ai: 0xa78bfa,
    out: 0x45e08f,
  };

  const metalDark = new THREE.MeshStandardMaterial({ color: 0x152231, roughness: 0.34, metalness: 0.82 });
  const chromeMat = new THREE.MeshStandardMaterial({ color: 0x9eb2c4, roughness: 0.2, metalness: 0.9 });

  // Build bespoke multi-part 3D CAD sculptures instead of plain cubes!
  function buildSculpture(kind: string, accentMat: THREE.MeshStandardMaterial, edgeMat: THREE.LineBasicMaterial) {
    const wrap = new THREE.Group();
    const spinParts: THREE.Object3D[] = [];

    if (kind === "in") {
      // Angled transceiver monolith + 3 concentric signal arcs
      const slab = new THREE.Mesh(new THREE.BoxGeometry(1.15, 1.45, 0.18), metalDark);
      slab.position.y = 0.82;
      slab.rotation.y = 0.3;
      slab.rotation.x = -0.18;
      const screen = new THREE.Mesh(new THREE.BoxGeometry(0.95, 1.2, 0.04), accentMat);
      screen.position.z = 0.1;
      slab.add(screen);
      wrap.add(slab);
      for (let i = 0; i < 3; i++) {
        const arc = new THREE.Mesh(new THREE.TorusGeometry(0.55 + i * 0.24, 0.018, 10, 32, Math.PI * 0.75), accentMat);
        arc.position.set(0, 1.45, 0);
        arc.rotation.z = Math.PI * 0.12;
        wrap.add(arc);
        spinParts.push(arc);
      }
    } else if (kind === "sec") {
      // Twin hexagonal armored shield pylons + rotating laser scan ring
      const pGeo = new THREE.CylinderGeometry(0.32, 0.36, 1.6, 6);
      const p1 = new THREE.Mesh(pGeo, metalDark); p1.position.set(-0.48, 0.85, 0);
      const p2 = new THREE.Mesh(pGeo, metalDark); p2.position.set(0.48, 0.85, 0);
      const gate = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(0.82, 1.38, 0.08)), edgeMat);
      gate.position.y = 0.85;
      const scanRing = new THREE.Mesh(new THREE.TorusGeometry(0.76, 0.02, 12, 48), accentMat);
      scanRing.rotation.x = Math.PI / 2;
      scanRing.position.y = 0.95;
      wrap.add(p1, p2, gate, scanRing);
      spinParts.push(scanRing);
    } else if (kind === "core") {
      // 3-blade horizontal server stack with LED strips & heat-sink frame
      const rack = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(1.52, 1.72, 1.32)), edgeMat);
      rack.position.y = 0.92;
      wrap.add(rack);
      for (let b = 0; b < 3; b++) {
        const y = 0.42 + b * 0.5;
        const blade = new THREE.Mesh(new THREE.BoxGeometry(1.36, 0.32, 1.18), metalDark);
        blade.position.y = y;
        const led = new THREE.Mesh(new THREE.BoxGeometry(0.92, 0.05, 0.04), accentMat);
        led.position.set(0, y, 0.61);
        wrap.add(blade, led);
      }
    } else if (kind === "ai") {
      // Faceted octahedron AI core suspended inside dual counter-rotating gimbal rings
      const core = new THREE.Mesh(new THREE.OctahedronGeometry(0.48, 0), accentMat);
      core.position.y = 1.05;
      const g1 = new THREE.Mesh(new THREE.TorusGeometry(0.78, 0.022, 12, 48), accentMat);
      g1.position.y = 1.05;
      g1.rotation.x = 0.6;
      const g2 = new THREE.Mesh(new THREE.TorusGeometry(0.94, 0.016, 12, 48), chromeMat);
      g2.position.y = 1.05;
      g2.rotation.y = 0.8;
      wrap.add(core, g1, g2);
      spinParts.push(core, g1, g2);
    } else {
      // Angled glass verification terminal with illuminated bars
      const stand = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.36, 0.45, 16), chromeMat);
      stand.position.y = 0.25;
      const mon = new THREE.Mesh(new THREE.BoxGeometry(1.38, 1.05, 0.1), metalDark);
      mon.position.y = 0.98;
      mon.rotation.x = -0.22;
      mon.rotation.y = -0.25;
      const monEdge = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(1.42, 1.09, 0.12)), edgeMat);
      mon.add(monEdge);
      for (let k = 0; k < 3; k++) {
        const bar = new THREE.Mesh(new THREE.BoxGeometry(0.9 - k * 0.18, 0.08, 0.03), accentMat);
        bar.position.set(-0.1, 0.22 - k * 0.22, 0.07);
        mon.add(bar);
      }
      wrap.add(stand, mon);
    }
    return { wrap, spinParts };
  }

  const nodeObjs: {
    group: THREE.Group;
    hitBox: THREE.Mesh;
    accentMat: THREE.MeshStandardMaterial;
    padRing: THREE.Mesh;
    spinParts: THREE.Object3D[];
  }[] = [];

  const ghostMat = new THREE.MeshBasicMaterial({ visible: false });

  spec.nodes.forEach((nd: any, idx: number) => {
    const col = kindColors[nd.kind] || 0x4fd1ff;
    const g = new THREE.Group();
    const pos = positions[idx];
    g.position.set(pos.x, 0, pos.z);

    const pad = new THREE.Mesh(new THREE.CylinderGeometry(1.08, 1.16, 0.1, 24), metalDark);
    pad.position.y = 0.05;
    g.add(pad);

    const accentMat = new THREE.MeshStandardMaterial({
      color: col,
      emissive: col,
      emissiveIntensity: 0.35,
      roughness: 0.25,
      metalness: 0.72,
    });
    const edgeMat = new THREE.LineBasicMaterial({ color: col, transparent: true, opacity: 0.65 });

    const padRing = new THREE.Mesh(new THREE.TorusGeometry(1.12, 0.022, 10, 48), accentMat);
    padRing.rotation.x = Math.PI / 2;
    padRing.position.y = 0.11;
    g.add(padRing);

    const { wrap, spinParts } = buildSculpture(nd.kind, accentMat, edgeMat);
    g.add(wrap);

    const hitBox = new THREE.Mesh(new THREE.BoxGeometry(2.1, 2.2, 2.1), ghostMat);
    hitBox.position.y = 1.0;
    hitBox.userData.nodeIdx = idx;
    g.add(hitBox);

    scene.add(g);
    nodeObjs.push({ group: g, hitBox, accentMat, padRing, spinParts });
  });

  // Curved 3D conduits + clamped packets
  const curves: THREE.CatmullRomCurve3[] = [];
  for (let i = 0; i < positions.length - 1; i++) {
    const a = positions[i].clone().setY(0.28);
    const b = positions[i + 1].clone().setY(0.28);
    const mid = a.clone().lerp(b, 0.5);
    mid.y = 0.68;
    const curve = new THREE.CatmullRomCurve3([a, mid, b]);
    curves.push(curve);
    scene.add(
      new THREE.Mesh(
        new THREE.TubeGeometry(curve, 28, 0.035, 8, false),
        new THREE.MeshStandardMaterial({ color: 0x284057, roughness: 0.4, metalness: 0.7 })
      )
    );
  }

  const packets: { mesh: THREE.Mesh; seg: number; t: number; speed: number }[] = [];
  const pktGeo = new THREE.SphereGeometry(0.1, 14, 12);
  const pktMat = new THREE.MeshStandardMaterial({ color: 0x45e08f, emissive: 0x45e08f, emissiveIntensity: 0.95 });
  for (let i = 0; i < curves.length; i++) {
    for (let k = 0; k < 2; k++) {
      const mesh = new THREE.Mesh(pktGeo, pktMat);
      scene.add(mesh);
      packets.push({ mesh, seg: i, t: k * 0.5, speed: 0.46 });
    }
  }

  function syncTheme() {
    const light = document.documentElement.dataset.theme === "light";
    baseMat.color.setHex(light ? 0xe5dcc6 : 0x0d1620);
    metalDark.color.setHex(light ? 0xd5c8ae : 0x152231);
    bloom.strength = light ? 0.1 : 0.26;
  }
  syncTheme();
  new MutationObserver(syncTheme).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

  // Orbit drag + raycast click
  let dragging = false;
  let moved = false;
  let lastX = 0;
  let lastY = 0;
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();

  canvas.addEventListener("pointerdown", (e) => {
    dragging = true;
    moved = false;
    lastX = e.clientX;
    lastY = e.clientY;
    canvas.setPointerCapture(e.pointerId);
  });
  canvas.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    if (Math.abs(dx) + Math.abs(dy) > 4) moved = true;
    targetCam.theta -= dx * 0.0065;
    targetCam.phi = Math.max(0.22, Math.min(1.26, targetCam.phi - dy * 0.005));
    lastX = e.clientX;
    lastY = e.clientY;
  });
  canvas.addEventListener("pointerup", (e) => {
    dragging = false;
    if (!moved) {
      const rect = canvas.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(nodeObjs.map((n) => n.hitBox));
      if (hits.length > 0) {
        const idx = hits[0].object.userData.nodeIdx;
        autoPlay = false;
        updateToggleLabel();
        renderStep(curScenario, idx);
      }
    }
  });

  function resize() {
    const w = Math.max(280, canvas!.clientWidth || 640);
    const h = Math.max(240, canvas!.clientHeight || 420);
    renderer!.setSize(w, h, false);
    composer.setSize(w, h);
    bloom.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  new ResizeObserver(resize).observe(canvas);

  function updateToggleLabel() {
    if (toggleBtn) toggleBtn.textContent = autoPlay ? pauseTxt : playTxt;
  }

  function renderStep(scIdx: number, stIdx: number) {
    curScenario = scIdx;
    curStep = stIdx;
    const sc = spec.scenarios[scIdx];
    const st = sc.steps[stIdx];
    const nd = spec.nodes[st.idx];

    tabs.forEach((t, i) => {
      t.classList.toggle("active", i === scIdx);
      t.setAttribute("aria-selected", i === scIdx ? "true" : "false");
    });

    // Update all 5 timeline cards simultaneously when scenario changes, and expand active step
    sc.steps.forEach((sObj: any, idx: number) => {
      const hEl = root.querySelector<HTMLElement>(`[data-st-head="${idx}"]`);
      const mEl = root.querySelector<HTMLElement>(`[data-st-msg="${idx}"]`);
      const wEl = root.querySelector<HTMLElement>(`[data-st-why="${idx}"]`);
      if (hEl) hEl.textContent = sObj.headline;
      if (mEl) mEl.textContent = sObj.msg;
      if (wEl) wEl.textContent = sObj.why;
    });

    stepCards.forEach((card, i) => {
      card.classList.toggle("active", i === stIdx);
      card.classList.toggle("done", i < stIdx);
    });

    if (stepEl) stepEl.textContent = `${String(stIdx + 1).padStart(2, "0")} / ${String(sc.steps.length).padStart(2, "0")}`;
    if (nodeNameEl && nd) nodeNameEl.textContent = `${nd.code} · ${nd.title}`;
    if (badgeEl) {
      badgeEl.textContent = sc.badge;
      badgeEl.dataset.tone = sc.tone;
    }
    if (latEl) latEl.textContent = sc.latency;
    if (costEl) costEl.textContent = sc.cost;
    if (guardEl) guardEl.textContent = sc.guard;

    const toneHex = sc.tone === "accent" ? 0xf5b83f : sc.tone === "ai" ? 0xa78bfa : 0x45e08f;
    pktMat.color.setHex(toneHex);
    pktMat.emissive.setHex(toneHex);
  }

  tabs.forEach((t, i) => t.addEventListener("click", () => { stepTimer = 0; renderStep(i, 0); }));
  stepCards.forEach((c, i) => c.addEventListener("click", () => { autoPlay = false; updateToggleLabel(); renderStep(curScenario, i); }));
  camBtns.forEach((b) => {
    b.addEventListener("click", () => {
      const key = b.dataset.cam as keyof typeof camTargets;
      if (!camTargets[key]) return;
      targetCam = { ...camTargets[key] };
      camBtns.forEach((c) => c.classList.toggle("active", c === b));
    });
  });
  toggleBtn?.addEventListener("click", () => {
    autoPlay = !autoPlay;
    stepTimer = 0;
    updateToggleLabel();
  });

  updateToggleLabel();
  renderStep(0, 0);

  let visible = true;
  new IntersectionObserver((entries) => { visible = entries[0]?.isIntersecting ?? true; }, { threshold: 0.05 }).observe(root);

  let lastTime = 0;
  function tick(now: number) {
    requestAnimationFrame(tick);
    if (!visible) { lastTime = now; return; }
    const dt = lastTime ? Math.max(0, Math.min((now - lastTime) / 1000, 0.05)) : 0.016;
    lastTime = now;

    if (autoPlay) {
      stepTimer += dt;
      if (stepTimer >= 3.2) {
        stepTimer = 0;
        const len = spec.scenarios[curScenario].steps.length;
        renderStep(curScenario, (curStep + 1) % len);
      }
    }

    const sway = reduced || dragging ? 0 : Math.sin(now * 0.00038) * 0.09;
    currentCam.theta += (targetCam.theta + sway - currentCam.theta) * 0.08;
    currentCam.phi += (targetCam.phi - currentCam.phi) * 0.08;
    currentCam.dist += (targetCam.dist - currentCam.dist) * 0.08;

    camera.position.set(
      Math.sin(currentCam.theta) * Math.sin(currentCam.phi) * currentCam.dist,
      Math.cos(currentCam.phi) * currentCam.dist,
      Math.cos(currentCam.theta) * Math.sin(currentCam.phi) * currentCam.dist
    );
    camera.lookAt(0, 0.75, 0);

    const activeIdx = spec.scenarios[curScenario].steps[curStep].idx;
    nodeObjs.forEach((n, i) => {
      const isActive = i === activeIdx;
      const isDone = i < activeIdx;
      const targetEmissive = isActive ? 0.85 : isDone ? 0.35 : 0.14;
      n.accentMat.emissiveIntensity += (targetEmissive - n.accentMat.emissiveIntensity) * 0.12;
      n.padRing.scale.setScalar(isActive ? 1.12 + Math.sin(now * 0.005) * 0.05 : 1.0);
      n.spinParts.forEach((sp, k) => {
        sp.rotation.z += dt * (isActive ? 1.4 : 0.3) * (k % 2 === 0 ? 1 : -1);
        sp.rotation.y += dt * (isActive ? 0.9 : 0.2);
      });
    });

    packets.forEach((p) => {
      p.t = ((p.t + dt * p.speed) % 1 + 1) % 1;
      const clampedT = Math.max(0, Math.min(0.9999, p.t));
      p.mesh.position.copy(curves[p.seg].getPoint(clampedT));
      p.mesh.visible = p.seg <= activeIdx;
    });

    composer.render();
  }
  requestAnimationFrame(tick);
});
