import type { Metadata } from "next";
import { Suspense } from "react";
import Logo from "@/components/Logo";
import LoginForm from "@/components/admin/LoginForm";

export const metadata: Metadata = {
  title: "Login Admin",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center text-center">
          <Logo />
          <h1 className="mt-4 text-xl font-bold text-slate-900">Panel Admin</h1>
          <p className="mt-1 text-sm text-slate-500">
            Masuk untuk mengelola produk Lucksport.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <Suspense fallback={null}>
            <LoginForm />
          </Suspense>
        </div>
        <p className="mt-4 text-center text-xs text-slate-400">
          Khusus tim Lucksport. Akses tidak sah dilarang.
        </p>
      </div>
    </div>
  );
}
