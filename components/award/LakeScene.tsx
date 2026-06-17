"use client";

import { useEffect, useRef } from "react";

// ─────────────────────────────────────────────────────────────────────────
// LakeScene — siang hari cerah di Danau Jatiluhur (Purwakarta), Three.js:
// matahari tinggi, langit biru terang, air ber-shader biru dengan jalur
// cahaya putih, TIGA kayak pendayung sedang berlatih, burung melintas,
// dan siluet keramba jaring apung di kejauhan.
// Client-only; pause saat di luar layar; hormati prefers-reduced-motion;
// fallback gradien CSS bila WebGL tak tersedia.
// ─────────────────────────────────────────────────────────────────────────

const FALLBACK_BG =
  "linear-gradient(to bottom, #2a7fd0 0%, #4f9ad8 32%, #7fb8e6 55%, #aed4f0 75%, #d6ecf8 90%, #1d6aa0 100%)";

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
      host.appendChild(renderer.domElement);

      const scene = new THREE.Scene();

      // ── Langit pagi (gradient via CanvasTexture) ──
      const skyCanvas = document.createElement("canvas");
      skyCanvas.width = 16;
      skyCanvas.height = 1024;
      const ctx = skyCanvas.getContext("2d")!;
      const grad = ctx.createLinearGradient(0, 0, 0, 1024);
      grad.addColorStop(0.0, "#1f6fc4"); // biru langit siang di puncak
      grad.addColorStop(0.35, "#4f9ad8"); // biru cerah
      grad.addColorStop(0.58, "#7fb8e6"); // biru muda
      grad.addColorStop(0.74, "#aed4f0"); // biru pucat
      grad.addColorStop(0.85, "#d6ecf8"); // kabut terang di horizon
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
      camera.position.set(0, 2.4, 9);
      camera.lookAt(0, 1.6, -60);

      // ── Matahari siang tinggi + halo terang ──
      const sun = new THREE.Mesh(
        new THREE.CircleGeometry(5, 48),
        new THREE.MeshBasicMaterial({ color: 0xffffff })
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
        })
      );
      glow.scale.set(75, 75, 1);
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
      scene.add(makeRidge(-202, 11, 5.5, 0x8fb6d6, 1.3)); // bukit jauh, biru kabut terang
      scene.add(makeRidge(-178, 7.5, 4, 0x4f9460, 4.1)); // bukit dekat, hijau sinar siang

      // ── Air danau pagi (shader kustom) ──
      const uniforms = {
        uTime: { value: 0 },
        uDeep: { value: new THREE.Color("#1c6aa3") },
        uHorizon: { value: new THREE.Color("#c4e4f4") },
        uSun: { value: new THREE.Color("#ffffff") },
      };
      const water = new THREE.Mesh(
        new THREE.PlaneGeometry(420, 240, 140, 90),
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
            uniform vec3 uDeep, uHorizon, uSun;
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
              vec3 col = mix(uDeep, uHorizon, pow(dist, 1.9));
              // pantulan matahari siang (digeser mengikuti posisi matahari)
              float streak = exp(-pow((vWorld.x - 7.0 * dist) / (2.0 + dist * 9.0), 2.0));
              float shimmer = noise(vec2(vWorld.x * 2.2, vWorld.z * 0.55 - uTime * 1.1));
              shimmer = smoothstep(0.45, 0.95, shimmer);
              col += uSun * streak * shimmer * (0.18 + 0.85 * dist);
              // kilau halus
              float sp = pow(noise(vWorld.xz * 3.0 + uTime * 0.6), 22.0);
              col += vec3(1.0, 0.93, 0.75) * sp * 0.4 * dist;
              gl_FragColor = vec4(col, 1.0);
            }
          `,
        })
      );
      water.rotation.x = -Math.PI / 2;
      water.position.set(0, 0, -90);
      scene.add(water);

      // ── Kabut pagi di atas air ──
      const mistCanvas = document.createElement("canvas");
      mistCanvas.width = 256;
      mistCanvas.height = 64;
      const mctx = mistCanvas.getContext("2d")!;
      const mg = mctx.createRadialGradient(128, 32, 4, 128, 32, 128);
      mg.addColorStop(0, "rgba(235,243,248,0.55)");
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
            opacity: 0.16,
            depthWrite: false,
          })
        );
        m.scale.set(55 + i * 12, 5.5, 1);
        m.position.set((i - 2) * 22, 1.4 + (i % 3) * 0.5, -120 - i * 14);
        mists.push(m);
        scene.add(m);
      }

      // ── Tim dayung: tiga kayak berlatih ──
      // Perahu (hull), dayung, dan pendayung semuanya biru terang.
      const silhouette = new THREE.MeshBasicMaterial({ color: 0x2ea8ff });
      const paddler = silhouette;
      const makeKayak = () => {
        const g = new THREE.Group();
        const hull = new THREE.Mesh(
          new THREE.CapsuleGeometry(0.3, 3.2, 6, 12),
          silhouette
        );
        hull.rotation.z = Math.PI / 2;
        hull.scale.set(1, 1, 0.4);
        g.add(hull);
        const torso = new THREE.Mesh(
          new THREE.CylinderGeometry(0.15, 0.21, 0.66, 10),
          paddler
        );
        torso.position.set(0.08, 0.52, 0);
        g.add(torso);
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.15, 12, 12), paddler);
        head.position.set(0.08, 1.0, 0);
        g.add(head);
        const paddle = new THREE.Mesh(
          new THREE.CylinderGeometry(0.032, 0.032, 2.3, 8),
          silhouette
        );
        paddle.position.set(0.08, 0.66, 0);
        paddle.rotation.x = Math.PI / 2.3;
        const bladeL = new THREE.Mesh(new THREE.SphereGeometry(0.15, 10, 10), silhouette);
        bladeL.scale.set(0.5, 1.6, 0.18);
        bladeL.position.set(0, 0, 1.12);
        paddle.add(bladeL);
        const bladeR = bladeL.clone();
        bladeR.position.set(0, 0, -1.12);
        paddle.add(bladeR);
        g.add(paddle);
        return { group: g, paddle };
      };

      const team = [
        { ...makeKayak(), baseX: -5.5, z: -30, phase: 0.0, sway: 5 },
        { ...makeKayak(), baseX: 0.8, z: -22, phase: 1.4, sway: 6 },
        { ...makeKayak(), baseX: 5.8, z: -16, phase: 2.6, sway: 4.5 },
      ];
      team.forEach((k) => {
        k.group.position.set(k.baseX, 0.15, k.z);
        k.group.rotation.y = -0.35;
        scene.add(k.group);
      });

      // ── Keramba jaring apung (ciri khas Jatiluhur) di kejauhan ──
      const keramba = new THREE.Group();
      const kerMat = new THREE.MeshBasicMaterial({ color: 0x2c5468 });
      for (let i = 0; i < 7; i++) {
        const k = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.18, 2.2), kerMat);
        k.position.set(
          -20 - (i % 4) * 4.2,
          0.12,
          -62 - Math.floor(i / 4) * 5 - (i % 3) * 2
        );
        keramba.add(k);
        if (i % 3 === 0) {
          const hut = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.9, 1.0), kerMat);
          hut.position.set(k.position.x, 0.6, k.position.z);
          keramba.add(hut);
        }
      }
      scene.add(keramba);

      // ── Burung pagi melintas ──
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
      const birds: { s: import("three").Sprite; v: number; y0: number; off: number }[] = [];
      for (let i = 0; i < 4; i++) {
        const s = new THREE.Sprite(
          new THREE.SpriteMaterial({ map: birdTex, transparent: true, depthWrite: false })
        );
        s.scale.set(2.2, 1.1, 1);
        const y0 = 7 + (i % 3) * 1.6;
        s.position.set(-45 - i * 14, y0, -110);
        birds.push({ s, v: 2.6 + (i % 2) * 0.7, y0, off: i * 1.7 });
        scene.add(s);
      }

      // ── Partikel embun pagi ──
      const pCount = 60;
      const pPos = new Float32Array(pCount * 3);
      for (let i = 0; i < pCount; i++) {
        pPos[i * 3] = (Math.random() - 0.5) * 50;
        pPos[i * 3 + 1] = 0.3 + Math.random() * 4;
        pPos[i * 3 + 2] = -4 - Math.random() * 70;
      }
      const pGeo = new THREE.BufferGeometry();
      pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
      const particles = new THREE.Points(
        pGeo,
        new THREE.PointsMaterial({
          color: 0xd7ecff,
          size: 0.1,
          transparent: true,
          opacity: 0.45,
          depthWrite: false,
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

        // tim dayung: kayuhan bergantian + laju bolak-balik perlahan (latihan)
        team.forEach((k) => {
          k.group.position.y = 0.15 + Math.sin(t * 1.15 + k.phase) * 0.05;
          k.group.rotation.z = Math.sin(t * 0.85 + k.phase) * 0.04;
          k.group.position.x = k.baseX + Math.sin(t * 0.07 + k.phase) * k.sway;
          k.paddle.rotation.z = Math.sin(t * 2.1 + k.phase) * 0.6;
        });

        // burung terbang menyilang, mengepak
        birds.forEach((b) => {
          b.s.position.x += b.v * 0.016;
          b.s.position.y = b.y0 + Math.sin(t * 1.5 + b.off) * 0.35;
          b.s.scale.y = 1.1 * (0.7 + 0.3 * Math.abs(Math.sin(t * 6 + b.off)));
          if (b.s.position.x > 50) b.s.position.x = -52;
        });

        // kabut hanyut perlahan
        mists.forEach((m, i) => {
          m.position.x += Math.sin(t * 0.05 + i) * 0.004;
        });

        glow.material.opacity = 0.8 + Math.sin(t * 0.6) * 0.08;
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
        renderer.dispose();
        water.geometry.dispose();
        (water.material as import("three").Material).dispose();
        pGeo.dispose();
        skyTex.dispose();
        glowTex.dispose();
        mistTex.dispose();
        birdTex.dispose();
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
