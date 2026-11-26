import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";

const cv = document.getElementById("hero3d-core") as HTMLCanvasElement | null;
if (cv) {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let renderer: THREE.WebGLRenderer | null = null;
  try {
    renderer = new THREE.WebGLRenderer({ canvas: cv, antialias: true, alpha: true, powerPreference: "high-performance" });
  } catch {
    renderer = null;
  }

  if (renderer) {
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.02;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1.5, 0.1, 60);
    camera.position.set(0, 1.4, 6.8);
    camera.lookAt(0, 0, 0);

    // Selective high-threshold bloom: crisp dark anodized metal, zero whiteout!
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const bloom = new UnrealBloomPass(new THREE.Vector2(400, 300), 0.28, 0.35, 0.86);
    composer.addPass(bloom);
    composer.addPass(new OutputPass());

    scene.add(new THREE.HemisphereLight(0xdbeafe, 0x090f16, 0.9));
    const key = new THREE.DirectionalLight(0xffffff, 1.8);
    key.position.set(5, 8, 6);
    scene.add(key);
    const rimGold = new THREE.PointLight(0xf5b83f, 2.2, 14);
    rimGold.position.set(-4, 2.5, 3);
    scene.add(rimGold);
    const rimCyan = new THREE.PointLight(0x4fd1ff, 2.4, 14);
    rimCyan.position.set(4, -1.5, 3.5);
    scene.add(rimCyan);

    const rig = new THREE.Group();
    rig.rotation.x = 0.22;
    scene.add(rig);

    // Precision dark-titanium faceted core + crisp cyan wireframe edge cage
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x13202e,
      emissive: 0x0c2d42,
      emissiveIntensity: 0.45,
      roughness: 0.24,
      metalness: 0.88,
      flatShading: true,
    });
    const core = new THREE.Mesh(new THREE.OctahedronGeometry(0.92, 1), coreMat);
    rig.add(core);

    const innerCoreMat = new THREE.MeshBasicMaterial({ color: 0x4fd1ff });
    const innerPulse = new THREE.Mesh(new THREE.OctahedronGeometry(0.38, 0), innerCoreMat);
    rig.add(innerPulse);

    const cageMat = new THREE.LineBasicMaterial({ color: 0x4fd1ff, transparent: true, opacity: 0.65 });
    const cage = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(1.26, 1)), cageMat);
    rig.add(cage);

    // Anodized silicon wafer base ring with precision gold pins
    const waferGroup = new THREE.Group();
    const waferRing = new THREE.Mesh(
      new THREE.CylinderGeometry(2.15, 2.25, 0.08, 48, 1, true),
      new THREE.MeshStandardMaterial({ color: 0x182635, roughness: 0.35, metalness: 0.8, side: THREE.DoubleSide })
    );
    waferGroup.add(waferRing);
    const pinGeo = new THREE.BoxGeometry(0.05, 0.04, 0.22);
    const pinMat = new THREE.MeshStandardMaterial({ color: 0xf5b83f, emissive: 0xf5b83f, emissiveIntensity: 0.55, roughness: 0.25, metalness: 0.9 });
    for (let i = 0; i < 24; i++) {
      const a = (i / 24) * Math.PI * 2;
      const p = new THREE.Mesh(pinGeo, pinMat);
      p.position.set(Math.cos(a) * 2.2, 0, Math.sin(a) * 2.2);
      p.rotation.y = -a;
      waferGroup.add(p);
    }
    waferGroup.rotation.x = 0.15;
    rig.add(waferGroup);

    // Three ultra-crisp machined gimbal rings
    const r1Mat = new THREE.MeshStandardMaterial({ color: 0xf5b83f, emissive: 0xf5b83f, emissiveIntensity: 0.85, roughness: 0.2, metalness: 0.85 });
    const r2Mat = new THREE.MeshStandardMaterial({ color: 0x4fd1ff, emissive: 0x4fd1ff, emissiveIntensity: 0.85, roughness: 0.2, metalness: 0.85 });
    const r3Mat = new THREE.MeshStandardMaterial({ color: 0x45e08f, emissive: 0x45e08f, emissiveIntensity: 0.75, roughness: 0.2, metalness: 0.85 });

    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(1.68, 0.022, 16, 96), r1Mat);
    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(1.96, 0.018, 16, 96), r2Mat);
    const ring3 = new THREE.Mesh(new THREE.TorusGeometry(2.42, 0.014, 12, 96), r3Mat);
    ring1.rotation.set(Math.PI * 0.36, 0.2, 0);
    ring2.rotation.set(-Math.PI * 0.3, 0.55, 0.35);
    ring3.rotation.set(Math.PI * 0.48, -0.35, 0.2);
    rig.add(ring1, ring2, ring3);

    // Orbiting telemetry nodes
    const orbNodes: { mesh: THREE.Mesh; radius: number; speed: number; phase: number; tilt: number }[] = [];
    const orbGeo = new THREE.SphereGeometry(0.065, 16, 12);
    for (let i = 0; i < 9; i++) {
      const mat = i % 3 === 0 ? r1Mat : i % 3 === 1 ? r2Mat : r3Mat;
      const m = new THREE.Mesh(orbGeo, mat);
      rig.add(m);
      orbNodes.push({
        mesh: m,
        radius: i % 3 === 0 ? 1.68 : i % 3 === 1 ? 1.96 : 2.42,
        speed: (i % 2 === 0 ? 1 : -1) * (0.6 + (i % 3) * 0.2),
        phase: (i / 9) * Math.PI * 2,
        tilt: i % 3 === 0 ? 0.6 : i % 3 === 1 ? -0.5 : 0.85,
      });
    }

    const syncTheme = () => {
      const light = document.documentElement.dataset.theme === "light";
      const css = (n: string, f: string) => getComputedStyle(document.documentElement).getPropertyValue(n).trim() || f;
      const acc = new THREE.Color(css("--hex-accent", "#f7bd4a"));
      const ai = new THREE.Color(css("--hex-ai", "#5ad4ff"));
      const live = new THREE.Color(css("--hex-live", "#4ae39a"));
      coreMat.color.setHex(light ? 0xd9cdb4 : 0x13202e);
      r1Mat.color.copy(acc); r1Mat.emissive.copy(acc);
      pinMat.color.copy(acc); pinMat.emissive.copy(acc);
      r2Mat.color.copy(ai); r2Mat.emissive.copy(ai);
      r3Mat.color.copy(live); r3Mat.emissive.copy(live);
      innerCoreMat.color.copy(ai);
      cageMat.color.copy(ai);
      bloom.strength = light ? 0.12 : 0.28;
    };
    syncTheme();
    new MutationObserver(syncTheme).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    let tx = 0, ty = 0.22;
    const box = cv.parentElement!;
    box.addEventListener("pointermove", (e) => {
      const r = box.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width - 0.5) * 0.85;
      ty = 0.22 + ((e.clientY - r.top) / r.height - 0.5) * 0.55;
    });
    box.addEventListener("pointerleave", () => { tx = 0; ty = 0.22; });

    const resize = () => {
      const r = box.getBoundingClientRect();
      const w = Math.max(240, r.width);
      const h = Math.max(220, r.height);
      renderer!.setSize(w, h, false);
      composer.setSize(w, h);
      bloom.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    new ResizeObserver(resize).observe(box);

    let visible = true;
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0.05 }).observe(box);

    let last = 0;
    const tick = (now: number) => {
      requestAnimationFrame(tick);
      if (!visible) { last = now; return; }
      const dt = last ? Math.max(0, Math.min((now - last) / 1000, 0.05)) : 0.016;
      last = now;

      rig.rotation.y += (tx - rig.rotation.y) * 0.06;
      rig.rotation.x += (ty - rig.rotation.x) * 0.06;

      if (!reduce) {
        core.rotation.y += dt * 0.42;
        cage.rotation.y -= dt * 0.28;
        waferGroup.rotation.y += dt * 0.18;
        ring1.rotation.z += dt * 0.55;
        ring2.rotation.z -= dt * 0.4;
        ring3.rotation.y += dt * 0.3;
        innerPulse.scale.setScalar(0.92 + Math.sin(now * 0.0035) * 0.12);

        const t = now * 0.001;
        orbNodes.forEach((o) => {
          const a = t * o.speed + o.phase;
          o.mesh.position.set(
            Math.cos(a) * o.radius,
            Math.sin(a) * o.radius * Math.cos(o.tilt),
            Math.sin(a) * o.radius * Math.sin(o.tilt)
          );
        });
      }
      composer.render();
      if (!shown) { shown = true; cv.closest(".viz")?.classList.add("live"); }   // fade out the still picture
    };
    let shown = false;
    requestAnimationFrame(tick);
  }
}
