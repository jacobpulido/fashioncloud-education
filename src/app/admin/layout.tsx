import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const nombre = user.user_metadata?.nombre || "Admin";
  let instNombre = "";

  // Fetch institution info
  try {
    const { data: membres } = await supabase
      .from("miembros_institucion")
      .select("institucion_id")
      .eq("usuario_id", user.id)
      .limit(1);

    if (membres && membres.length > 0) {
      const { data: inst } = await supabase
        .from("instituciones")
        .select("nombre")
        .eq("id", membres[0].institucion_id)
        .single();
      instNombre = inst?.nombre || "";
    }
  } catch (e) {}

  return (
    <div className="flex min-h-screen">
      <aside className="fixed inset-y-0 left-0 w-64 bg-[#0b1120] px-4 py-6">
        <div className="mb-8 px-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/40">FashionCloud</p>
          <p className="text-lg font-bold text-white">Education</p>
          <p className="mt-0.5 text-xs text-white/50">{nombre}</p>
          <p className="text-xs text-white/30">{instNombre}</p>
        </div>
        <nav className="space-y-1">
          <Link href="/admin/dashboard" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-white/70 transition hover:bg-white/10">
            <span>Dashboard</span>
          </Link>
          <Link href="/admin/miembros" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-white/70 transition hover:bg-white/10">
            <span>Miembros</span>
          </Link>
        </nav>
        <div className="absolute bottom-6 left-4 right-4 space-y-2 border-t border-white/10 pt-4">
          <a href="/dashboard"
            className="block rounded-md px-3 py-2 text-sm text-white/40 transition hover:bg-white/5 hover:text-white/70">
            ← Ver como docente
          </a>
          <form action="/auth/salir" method="post">
            <button type="submit" className="w-full rounded-md px-3 py-2 text-left text-sm text-white/40 transition hover:bg-white/5 hover:text-white/70">
              Cerrar sesión
            </button>
          </form>
        </div>
      </aside>
      <div className="flex-1 pl-64">
        <main className="min-h-screen bg-gray-50 px-6 py-8">{children}</main>
      </div>
    </div>
  );
}
