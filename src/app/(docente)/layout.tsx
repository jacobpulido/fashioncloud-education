import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { MobileNav } from "./mobile-nav";

export default async function DocenteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const rol = user.user_metadata?.rol;
  if (!rol) redirect("/login");

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 bg-[#0b1120] px-4 py-6 lg:block">
        <div className="mb-8 px-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/40">
            FashionCloud
          </p>
          <p className="text-lg font-bold text-white">Education</p>
          <p className="mt-0.5 text-xs text-white/50">
            {user.user_metadata?.nombre || "Docente"}
          </p>
        </div>

        <nav className="space-y-1">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-white/70 transition hover:bg-white/10"
          >
            <span>Dashboard</span>
          </Link>
          <Link
            href="/materias"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-white/70 transition hover:bg-white/10"
          >
            <span>Materias</span>
          </Link>
          <Link
            href="/actividades"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-white/70 transition hover:bg-white/10"
          >
            <span>Actividades</span>
          </Link>
          <Link
            href="/carga-rapida"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-white/70 transition hover:bg-white/10"
          >
            <span>Carga rápida</span>
          </Link>
        </nav>

        <div className="absolute bottom-6 left-4 right-4 space-y-2 border-t border-white/10 pt-4">
          <a href="/admin/dashboard"
            className="block rounded-md px-3 py-2 text-sm text-white/40 transition hover:bg-white/5 hover:text-white/70">
            Ir al admin →
          </a>
          <form action="/auth/salir" method="post">
            <button
              type="submit"
              className="w-full rounded-md px-3 py-2 text-left text-sm text-white/40 transition hover:bg-white/5 hover:text-white/70"
            >
              Cerrar sesión
            </button>
          </form>
        </div>
      </aside>

      <MobileNav nombre={user.user_metadata?.nombre} />

      {/* Main content */}
      <div className="flex-1 lg:pl-64">
        <main className="min-h-screen bg-gray-50 px-6 py-8 lg:pt-8 pt-20">{children}</main>
      </div>
    </div>
  );
}
