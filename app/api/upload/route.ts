import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { put } from "@vercel/blob";

export const dynamic = "force-dynamic";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const IMAGE_MAX = 8 * 1024 * 1024; // 8MB
const MODEL_EXT = ["glb", "gltf"];
const MODEL_MAX = 40 * 1024 * 1024; // 40MB (model 3D bisa besar)

// Penyimpanan: jika BLOB_READ_WRITE_TOKEN ada (produksi/Vercel Blob) → simpan
// ke object storage & kembalikan URL publik permanen. Jika tidak (dev lokal)
// → simpan ke public/uploads seperti sebelumnya.
const useBlob = !!process.env.BLOB_READ_WRITE_TOKEN;

// POST /api/upload — unggah foto (JPG/PNG/WebP/AVIF) ATAU model 3D (.glb/.gltf).
export async function POST(request: Request) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Form tidak valid." }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "File tidak ditemukan." }, { status: 400 });
  }

  const ext = (file.name.split(".").pop() || "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
  const isModel = MODEL_EXT.includes(ext);
  const isImage = IMAGE_TYPES.includes(file.type);

  if (!isImage && !isModel) {
    return NextResponse.json(
      { error: "Format harus gambar (JPG/PNG/WebP/AVIF) atau model 3D (.glb/.gltf)." },
      { status: 400 }
    );
  }

  const max = isModel ? MODEL_MAX : IMAGE_MAX;
  if (file.size > max) {
    return NextResponse.json(
      { error: `Ukuran file maksimal ${Math.round(max / 1048576)}MB.` },
      { status: 400 }
    );
  }

  const safeExt = ext || (isModel ? "glb" : "jpg");
  const base = file.name
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 40)
    .replace(/^-|-$/g, "");
  const filename = `${base || (isModel ? "model" : "foto")}-${Date.now()}.${safeExt}`;
  const kind = isModel ? "model" : "image";

  try {
    if (useBlob) {
      // Simpan ke Vercel Blob → URL publik permanen (berfungsi di serverless).
      const blob = await put(`uploads/${filename}`, file, {
        access: "public",
        contentType: file.type || undefined,
      });
      return NextResponse.json({ url: blob.url, kind }, { status: 201 });
    }

    // Dev lokal: tulis ke public/uploads.
    if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    const bytes = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(path.join(UPLOAD_DIR, filename), bytes);
    return NextResponse.json({ url: `/uploads/${filename}`, kind }, { status: 201 });
  } catch (err) {
    console.error("Upload gagal:", err);
    return NextResponse.json(
      {
        error: useBlob
          ? "Gagal menyimpan ke storage. Coba lagi."
          : "Gagal menyimpan file. Di server produksi (Vercel) aktifkan Vercel Blob agar upload berfungsi.",
      },
      { status: 500 }
    );
  }
}
