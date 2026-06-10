"use client";

import { createElement, useEffect, useState } from "react";

// Penampil 3D produk berbasis <model-viewer> (web component Google).
// Library di-import dinamis (client-only) saat komponen dipasang, agar tidak
// membebani halaman lain. Mendukung rotate, zoom, dan AR di perangkat yang mendukung.
export default function ModelViewer3D({
  src,
  alt,
  poster,
}: {
  src: string;
  alt: string;
  poster?: string;
}) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    import("@google/model-viewer")
      .then(() => active && setReady(true))
      .catch(() => active && setReady(false));
    return () => {
      active = false;
    };
  }, []);

  if (!ready) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-slate-100 text-sm text-slate-500">
        Memuat 3D… / Loading 3D…
      </div>
    );
  }

  // Pakai createElement agar atribut custom-element (camera-controls, dll)
  // tidak bentrok dengan tipe JSX intrinsik React.
  return createElement("model-viewer", {
    src,
    alt,
    poster,
    "camera-controls": true,
    "auto-rotate": true,
    "auto-rotate-delay": "0",
    "rotation-per-second": "20deg",
    ar: true,
    "ar-modes": "webxr scene-viewer quick-look",
    "shadow-intensity": "1",
    exposure: "1",
    "touch-action": "pan-y",
    style: {
      width: "100%",
      height: "100%",
      backgroundColor: "#f1f5f9",
      "--poster-color": "#f1f5f9",
    },
  });
}
