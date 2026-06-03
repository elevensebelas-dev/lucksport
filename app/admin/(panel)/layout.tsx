import Logo from "@/components/Logo";
import AdminNav from "@/components/admin/AdminNav";

// Chrome panel admin (header + nav). Halaman login berada di luar grup ini.
export default function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="container-content flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo />
            <span className="rounded-full bg-brand-100 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-brand-700">
              Admin
            </span>
          </div>
          <AdminNav />
        </div>
      </header>
      <div className="container-content py-8">{children}</div>
    </div>
  );
}
