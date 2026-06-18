"use client";

import { useEffect, useRef } from "react";

// ─────────────────────────────────────────────────────────────────────────
// LakeScene — danau Jatiluhur (Purwakarta) sinematik, Three.js:
// pencahayaan nyata (matahari + langit) sehingga kayak & pendayung
// ber-shading dimensional, lambung 3D dengan kokpit & dayung, PANTULAN
// kayak di air, bayangan kontak, kabut kedalaman, burung melintas, keramba
// jaring apung, dan GERAK KAMERA sinematik yang melayang pelan.
// Client-only; pause saat di luar layar; hormati prefers-reduced-motion;
// fallback gradien CSS bila WebGL tak tersedia.
// ─────────────────────────────────────────────────────────────────────────

const FALLBACK_BG =
  "linear-gradient(to bottom, #2a7fd0 0%, #4f9ad8 32%, #7fb8e6 55%, #aed4f0 75%, #d6ecf8 90%, #1d6aa0 100%)";

const HULL_COLOR = 0x2ea8ff; // biru terang (sesuai preferensi)
const PADDLER_COLOR = 0x5bbdff; // biru terang sedikit lebih muda
const BLADE_COLOR = 0xeaf6ff;

export default function LakeScene({ className = "" }: { className?: string }) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let disposed = false;
    let cleanup: () => void = () => {};

    (async () => {
      const host = hostRef.current;
      if (!host) return;

      let THREE: typeof import("three");
      try {
        THREE = await import("three");
      } catch {
        host.style.background = FALLBACK_BG;
        return;
      }
      if (disposed) return;

      let renderer: import("three").WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({
          antialias: true,
          powerPreference: "high-performance",
        });
      } catch {
        host.style.background = FALLBACK_BG;
        return;
      }

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.setSize(host.clientWidth, host.clientHeight);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.08;
      host.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      // Kabut kedalaman → objek jauh berbaur dengan kabut horizon.
      scene.fog = new THREE.Fog(0xcfe6f5, 40, 280);

      // ── Langit siang (gradient via CanvasTexture) ──
      const skyCanvas = document.createElement("canvas");
      skyCanvas.width = 16;
      skyCanvas.height = 1024;
      const ctx = skyCanvas.getContext("2d")!;
      const grad = ctx.createLinearGradient(0, 0, 0, 1024);
      grad.addColorStop(0.0, "#1f6fc4");
      grad.addColorStop(0.35, "#4f9ad8");
      grad.addColorStop(0.58, "#7fb8e6");
      grad.addColorStop(0.74, "#aed4f0");
      grad.addColorStop(0.85, "#d6ecf8");
      grad.addColorStop(1.0, "#eaf6fd");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 16, 1024);
      const skyTex = new THREE.CanvasTexture(skyCanvas);
      skyTex.colorSpace = THREE.SRGBColorSpace;
      scene.background = skyTex;

      const camera = new THREE.PerspectiveCamera(
        52,
        host.clientWidth / host.clientHeight,
        0.1,
        600
      );
      const CAM_BASE = new THREE.Vector3(0, 2.4, 9);
      camera.position.copy(CAM_BASE);
      const camTarget = new THREE.Vector3(0, 1.5, -60);
      camera.lookAt(camTarget);

      // ── Pencahayaan ──
      const hemi = new THREE.HemisphereLight(0xdfeeff, 0x21556e, 1.05);
      scene.add(hemi);
      const sunLight = new THREE.DirectionalLight(0xfff1d6, 1.55);
      sunLight.position.set(9, 16, 10); // dari kanan-atas, depan
      scene.add(sunLight);
      const rim = new THREE.DirectionalLight(0xbfe0ff, 0.5);
      rim.position.set(-8, 6, -10); // cahaya tepi dari belakang
      scene.add(rim);

      // ── Matahari + halo ──
      const sun = new THREE.Mesh(
        new THREE.CircleGeometry(5, 48),
        new THREE.MeshBasicMaterial({ color: 0xffffff, fog: false })
      );
      sun.position.set(7, 24, -200);
      scene.add(sun);

      const glowCanvas = document.createElement("canvas");
      glowCanvas.width = glowCanvas.height = 256;
      const gctx = glowCanvas.getContext("2d")!;
      const rg = gctx.createRadialGradient(128, 128, 0, 128, 128, 128);
      rg.addColorStop(0, "rgba(255,255,255,0.9)");
      rg.addColorStop(0.4, "rgba(225,242,255,0.28)");
      rg.addColorStop(1, "rgba(225,242,255,0)");
      gctx.fillStyle = rg;
      gctx.fillRect(0, 0, 256, 256);
      const glowTex = new THREE.CanvasTexture(glowCanvas);
      const glow = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: glowTex,
          transparent: true,
          depthWrite: false,
          fog: false,
        })
      );
      glow.scale.set(80, 80, 1);
      glow.position.copy(sun.position);
      scene.add(glow);

      // ── Perbukitan Jatiluhur (dua lapis siluet berkabut) ──
      const makeRidge = (
        z: number,
        baseH: number,
        amp: number,
        color: number,
        seed: number
      ) => {
        const shape = new THREE.Shape();
        shape.moveTo(-320, -4);
        for (let x = -320; x <= 320; x += 16) {
          const y =
            baseH +
            Math.sin(x * 0.012 + seed) * amp +
            Math.sin(x * 0.031 + seed * 2.7) * amp * 0.45;
          shape.lineTo(x, y);
        }
        shape.lineTo(320, -4);
        shape.closePath();
        const mesh = new THREE.Mesh(
          new THREE.ShapeGeometry(shape),
          new THREE.MeshBasicMaterial({ color })
        );
        mesh.position.set(0, 0, z);
        return mesh;
      };
      scene.add(makeRidge(-202, 11, 5.5, 0x8fb6d6, 1.3));
      scene.add(makeRidge(-178, 7.5, 4, 0x4f9460, 4.1));

      // ── Air danau (shader kustom: gradasi kedalaman, pantulan matahari,
      //    kilau spekular, Fresnel langit) ──
      const uniforms = {
        uTime: { value: 0 },
        uDeep: { value: new THREE.Color("#155f93") },
        uHorizon: { value: new THREE.Color("#cfe6f5") },
        uSun: { value: new THREE.Color("#ffffff") },
        uSky: { value: new THREE.Color("#bfe0ff") },
      };
      const water = new THREE.Mesh(
        new THREE.PlaneGeometry(440, 260, 180, 120),
        new THREE.ShaderMaterial({
          uniforms,
          vertexShader: /* glsl */ `
            uniform float uTime;
            varying vec3 vWorld;
            void main() {
              vec3 pos = position;
              float h =
                sin(position.x * 0.18 + uTime * 0.8) * 0.13 +
                sin(position.y * 0.12 - uTime * 0.6) * 0.16 +
                sin((position.x + position.y) * 0.07 + uTime * 0.35) * 0.09;
              pos.z += h;
              vec4 wp = modelMatrix * vec4(pos, 1.0);
              vWorld = wp.xyz;
              gl_Position = projectionMatrix * viewMatrix * wp;
            }
          `,
          fragmentShader: /* glsl */ `
            uniform float uTime;
            uniform vec3 uDeep, uHorizon, uSun, uSky;
            varying vec3 vWorld;
            float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
            float noise(vec2 p){
              vec2 i = floor(p), f = fract(p);
              f = f * f * (3.0 - 2.0 * f);
              return mix(
                mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
                mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
                f.y);
            }
            void main() {
              float dist = clamp(-vWorld.z / 150.0, 0.0, 1.0);
              vec3 col = mix(uDeep, uHorizon, pow(dist, 1.8));
              // Fresnel: makin jauh makin memantulkan warna langit.
              col = mix(col, uSky, pow(dist, 2.4) * 0.5);
              // Pantulan matahari (jalur cahaya mengikuti posisi matahari).
              float streak = exp(-pow((vWorld.x - 7.0 * dist) / (2.0 + dist * 9.0), 2.0));
              float shimmer = noise(vec2(vWorld.x * 2.2, vWorld.z * 0.55 - uTime * 1.1));
              shimmer = smoothstep(0.4, 0.96, shimmer);
              col += uSun * streak * shimmer * (0.22 + 0.95 * dist);
              // Kilau spekular halus tersebar.
              float sp = pow(noise(vWorld.xz * 3.0 + uTime * 0.6), 24.0);
              col += vec3(1.0, 0.97, 0.85) * sp * 0.5 * dist;
              float sp2 = pow(noise(vWorld.xz * 6.0 - uTime * 0.9), 30.0);
              col += vec3(1.0) * sp2 * 0.35;
              gl_FragColor = vec4(col, 1.0);
            }
          `,
        })
      );
      water.rotation.x = -Math.PI / 2;
      water.position.set(0, 0, -90);
      scene.add(water);

      // ── Kayak 3D detail + pantulan ──
      const hullMat = new THREE.MeshStandardMaterial({
        color: HULL_COLOR,
        roughness: 0.42,
        metalness: 0.18,
      });
      const deckMat = new THREE.MeshStandardMaterial({
        color: 0x1f7fd0,
        roughness: 0.55,
        metalness: 0.1,
      });
      const paddlerMat = new THREE.MeshStandardMaterial({
        color: PADDLER_COLOR,
        roughness: 0.6,
        metalness: 0.05,
      });
      const bladeMat = new THREE.MeshStandardMaterial({
        color: BLADE_COLOR,
        roughness: 0.5,
        metalness: 0.1,
      });
      // Material pantulan (unlit, transparan, dibalik di bawah permukaan).
      const reflMat = new THREE.MeshBasicMaterial({
        color: HULL_COLOR,
        transparent: true,
        opacity: 0.16,
        depthWrite: false,
      });

      const buildKayak = () => {
        const g = new THREE.Group();

        // Lambung canoe/kayak: spindle yang MERUNCING di kedua ujung
        // (bow & stern) — profil radius mengecil ke nol di ujung,
        // dibalik (lathe) lalu dipipihkan ramping.
        const HULL_LEN = 3.95;
        const HULL_R = 0.46;
        const profile: import("three").Vector2[] = [];
        const hsegs = 20;
        for (let i = 0; i <= hsegs; i++) {
          const tt = i / hsegs;
          const y = (tt - 0.5) * HULL_LEN;
          // 0 di ujung, penuh di tengah, sedikit meruncing.
          const r = HULL_R * Math.pow(Math.sin(Math.PI * tt), 0.6);
          profile.push(new THREE.Vector2(Math.max(r, 0.0008), y));
        }
        const hull = new THREE.Mesh(
          new THREE.LatheGeometry(profile, 22),
          hullMat
        );
        hull.rotation.z = Math.PI / 2; // membujur ke sumbu X
        hull.scale.set(0.6, 1, 0.5); // pipih (tinggi) & ramping (lebar)
        hull.position.y = 0.2;
        g.add(hull);

        // Rim kokpit (cincin) tempat pendayung duduk.
        const rimMesh = new THREE.Mesh(
          new THREE.TorusGeometry(0.26, 0.06, 10, 22),
          deckMat
        );
        rimMesh.rotation.x = Math.PI / 2;
        rimMesh.position.set(0.05, 0.28, 0);
        g.add(rimMesh);

        // Pendayung: torso, kepala, dua lengan.
        const torso = new THREE.Mesh(
          new THREE.CylinderGeometry(0.16, 0.22, 0.66, 12),
          paddlerMat
        );
        torso.position.set(0.06, 0.6, 0);
        g.add(torso);
        const head = new THREE.Mesh(
          new THREE.SphereGeometry(0.16, 16, 16),
          paddlerMat
        );
        head.position.set(0.06, 1.06, 0);
        g.add(head);

        const armGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.62, 8);
        const armL = new THREE.Mesh(armGeo, paddlerMat);
        armL.position.set(0.06, 0.72, 0.26);
        armL.rotation.x = 0.9;
        g.add(armL);
        const armR = new THREE.Mesh(armGeo, paddlerMat);
        armR.position.set(0.06, 0.72, -0.26);
        armR.rotation.x = -0.9;
        g.add(armR);

        // Dayung: poros + dua bilah.
        const paddle = new THREE.Group();
        const shaft = new THREE.Mesh(
          new THREE.CylinderGeometry(0.035, 0.035, 2.4, 10),
          bladeMat
        );
        shaft.rotation.x = Math.PI / 2;
        paddle.add(shaft);
        const blade = new THREE.Mesh(
          new THREE.BoxGeometry(0.06, 0.42, 0.22),
          bladeMat
        );
        blade.position.set(0, 0, 1.18);
        paddle.add(blade);
        const blade2 = blade.clone();
        blade2.position.set(0, 0, -1.18);
        paddle.add(blade2);
        paddle.position.set(0.06, 0.74, 0);
        // Pivot dayung pada hub di tangan pendayung agar bilah menyelam
        // bergantian ke kedua sisi (bukan berputar di tempat).
        g.add(paddle);

        // Bayangan kontak (elips gelap lembut di permukaan air).
        const shadow = new THREE.Mesh(
          new THREE.CircleGeometry(1.0, 24),
          new THREE.MeshBasicMaterial({
            color: 0x07304a,
            transparent: true,
            opacity: 0.22,
            depthWrite: false,
          })
        );
        shadow.rotation.x = -Math.PI / 2;
        shadow.scale.set(2.0, 0.7, 1);
        shadow.position.set(0, 0.04, 0);
        g.add(shadow);

        return { group: g, paddle, torso, armL, armR };
      };

      const buildReflection = (src: import("three").Group) => {
        const r = src.clone();
        r.traverse((o) => {
          const m = o as import("three").Mesh;
          if ((m as unknown as { isMesh?: boolean }).isMesh) m.material = reflMat;
        });
        r.scale.y = -1; // balik di bawah permukaan
        return r;
      };

      type Boat = {
        group: import("three").Group;
        paddle: import("three").Group;
        torso: import("three").Mesh;
        armL: import("three").Mesh;
        armR: import("three").Mesh;
        refl: import("three").Group;
        baseX: number;
        z: number;
        phase: number;
        sway: number;
        yaw: number;
      };

      const team: Boat[] = [
        { baseX: -5.5, z: -30, phase: 0.0, sway: 5, yaw: -0.35 },
        { baseX: 0.8, z: -22, phase: 1.4, sway: 6, yaw: -0.3 },
        { baseX: 5.8, z: -16, phase: 2.6, sway: 4.5, yaw: -0.4 },
      ].map((cfg) => {
        const { group, paddle, torso, armL, armR } = buildKayak();
        group.rotation.y = cfg.yaw;
        group.position.set(cfg.baseX, 0.16, cfg.z);
        scene.add(group);
        const refl = buildReflection(group);
        refl.rotation.y = cfg.yaw;
        scene.add(refl);
        return { group, paddle, torso, armL, armR, refl, ...cfg };
      });

      // ── Keramba jaring apung (ciri khas Jatiluhur) di kejauhan ──
      const keramba = new THREE.Group();
      const kerMat = new THREE.MeshStandardMaterial({
        color: 0x2c5468,
        roughness: 0.8,
      });
      for (let i = 0; i < 7; i++) {
        const k = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.18, 2.2), kerMat);
        k.position.set(
          -20 - (i % 4) * 4.2,
          0.12,
          -62 - Math.floor(i / 4) * 5 - (i % 3) * 2
        );
        keramba.add(k);
        if (i % 3 === 0) {
          const hut = new THREE.Mesh(
            new THREE.BoxGeometry(1.1, 0.9, 1.0),
            kerMat
          );
          hut.position.set(k.position.x, 0.6, k.position.z);
          keramba.add(hut);
        }
      }
      scene.add(keramba);

      // ── Burung melintas ──
      const birdCanvas = document.createElement("canvas");
      birdCanvas.width = 64;
      birdCanvas.height = 32;
      const bctx = birdCanvas.getContext("2d")!;
      bctx.strokeStyle = "rgba(20,40,60,0.85)";
      bctx.lineWidth = 4;
      bctx.lineCap = "round";
      bctx.beginPath();
      bctx.moveTo(6, 22);
      bctx.quadraticCurveTo(20, 6, 32, 20);
      bctx.quadraticCurveTo(44, 6, 58, 22);
      bctx.stroke();
      const birdTex = new THREE.CanvasTexture(birdCanvas);
      const birds: {
        s: import("three").Sprite;
        v: number;
        y0: number;
        off: number;
      }[] = [];
      for (let i = 0; i < 5; i++) {
        const s = new THREE.Sprite(
          new THREE.SpriteMaterial({
            map: birdTex,
            transparent: true,
            depthWrite: false,
            fog: false,
          })
        );
        s.scale.set(2.2, 1.1, 1);
        const y0 = 8 + (i % 3) * 1.6;
        s.position.set(-45 - i * 14, y0, -110);
        birds.push({ s, v: 2.6 + (i % 2) * 0.7, y0, off: i * 1.7 });
        scene.add(s);
      }

      // ── Kabut tipis melayang di atas air ──
      const mistCanvas = document.createElement("canvas");
      mistCanvas.width = 256;
      mistCanvas.height = 64;
      const mctx = mistCanvas.getContext("2d")!;
      const mg = mctx.createRadialGradient(128, 32, 4, 128, 32, 128);
      mg.addColorStop(0, "rgba(235,243,248,0.5)");
      mg.addColorStop(1, "rgba(235,243,248,0)");
      mctx.fillStyle = mg;
      mctx.fillRect(0, 0, 256, 64);
      const mistTex = new THREE.CanvasTexture(mistCanvas);
      const mists: import("three").Sprite[] = [];
      for (let i = 0; i < 5; i++) {
        const m = new THREE.Sprite(
          new THREE.SpriteMaterial({
            map: mistTex,
            transparent: true,
            opacity: 0.14,
            depthWrite: false,
            fog: false,
          })
        );
        m.scale.set(55 + i * 12, 5.5, 1);
        m.position.set((i - 2) * 22, 1.4 + (i % 3) * 0.5, -120 - i * 14);
        mists.push(m);
        scene.add(m);
      }

      // ── Partikel kilau di udara ──
      const pCount = 70;
      const pPos = new Float32Array(pCount * 3);
      for (let i = 0; i < pCount; i++) {
        pPos[i * 3] = (Math.random() - 0.5) * 50;
        pPos[i * 3 + 1] = 0.3 + Math.random() * 4.5;
        pPos[i * 3 + 2] = -4 - Math.random() * 70;
      }
      const pGeo = new THREE.BufferGeometry();
      pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
      const particles = new THREE.Points(
        pGeo,
        new THREE.PointsMaterial({
          color: 0xeaf6ff,
          size: 0.1,
          transparent: true,
          opacity: 0.5,
          depthWrite: false,
          fog: false,
        })
      );
      scene.add(particles);

      // ── Loop render ──
      const clock = new THREE.Clock();
      let raf = 0;
      let visible = true;

      const renderFrame = () => {
        const t = clock.getElapsedTime();
        uniforms.uTime.value = t;

        // Gerak kamera sinematik: melayang halus + sedikit mengorbit.
        if (!reduceMotion) {
          camera.position.set(
            CAM_BASE.x + Math.sin(t * 0.07) * 1.7,
            CAM_BASE.y + Math.sin(t * 0.05) * 0.28,
            CAM_BASE.z + Math.sin(t * 0.04) * 0.7
          );
          camera.lookAt(camTarget);
        }

        team.forEach((k) => {
          const bob = Math.sin(t * 1.15 + k.phase) * 0.05;
          const x = k.baseX + Math.sin(t * 0.07 + k.phase) * k.sway;

          // Mendayung bergantian kanan-kiri seperti kayak sungguhan:
          // bilah menyelam ke satu sisi (roll pada sumbu maju), lalu menyapu
          // ke belakang (yaw), bergantian tiap setengah siklus.
          const stroke = t * 2.0 + k.phase;
          const dip = Math.sin(stroke);
          k.paddle.rotation.set(dip * 0.78, Math.cos(stroke) * 0.24, 0);

          // Tubuh condong ke sisi yang mendayung; lengan menyertai.
          k.torso.rotation.x = dip * 0.13;
          k.armL.rotation.x = 0.9 + dip * 0.38;
          k.armR.rotation.x = -0.9 + dip * 0.38;

          // Perahu sedikit miring mengikuti tarikan dayung.
          k.group.position.set(x, 0.16 + bob, k.z);
          k.group.rotation.z = -dip * 0.05;

          // Pantulan: ikut posisi x, balik di bawah permukaan.
          k.refl.position.set(x, -0.16 - bob, k.z);
          k.refl.rotation.z = dip * 0.05;
        });

        birds.forEach((b) => {
          b.s.position.x += b.v * 0.016;
          b.s.position.y = b.y0 + Math.sin(t * 1.5 + b.off) * 0.35;
          b.s.scale.y = 1.1 * (0.7 + 0.3 * Math.abs(Math.sin(t * 6 + b.off)));
          if (b.s.position.x > 50) b.s.position.x = -52;
        });

        mists.forEach((m, i) => {
          m.position.x += Math.sin(t * 0.05 + i) * 0.004;
        });

        glow.material.opacity = 0.82 + Math.sin(t * 0.6) * 0.08;
        particles.rotation.y = t * 0.006;
        renderer.render(scene, camera);
      };

      const loop = () => {
        if (!visible) return;
        renderFrame();
        raf = requestAnimationFrame(loop);
      };

      if (reduceMotion) {
        renderFrame();
      } else {
        loop();
      }

      const io = new IntersectionObserver(([e]) => {
        const wasVisible = visible;
        visible = e.isIntersecting;
        if (visible && !wasVisible && !reduceMotion) loop();
        if (!visible) cancelAnimationFrame(raf);
      });
      io.observe(host);

      const onResize = () => {
        const w = host.clientWidth;
        const h = host.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
        if (reduceMotion) renderFrame();
      };
      window.addEventListener("resize", onResize);

      cleanup = () => {
        cancelAnimationFrame(raf);
        io.disconnect();
        window.removeEventListener("resize", onResize);
        scene.traverse((obj) => {
          const m = obj as import("three").Mesh;
          if ((m as unknown as { isMesh?: boolean }).isMesh) {
            m.geometry?.dispose();
            const mat = m.material as
              | import("three").Material
              | import("three").Material[];
            if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
            else mat?.dispose();
          }
        });
        skyTex.dispose();
        glowTex.dispose();
        mistTex.dispose();
        birdTex.dispose();
        renderer.dispose();
        host.contains(renderer.domElement) &&
          host.removeChild(renderer.domElement);
      };
    })();

    return () => {
      disposed = true;
      cleanup();
    };
  }, []);

  return (
    <div
      ref={hostRef}
      aria-hidden
      className={`absolute inset-0 [&>canvas]:block [&>canvas]:h-full [&>canvas]:w-full ${className}`}
      style={{ background: "#4f9ad8" }}
    />
  );
}
