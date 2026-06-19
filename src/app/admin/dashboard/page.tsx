import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getStatsAdmin } from "@/lib/actions/institucion";

export default async function AdminDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: rows } = await supabase.from("miembros_institucion")
    .select("rol, institucion_id").eq("usuario_id", user.id);

  const admin = rows?.find(r => r.rol === "admin_plantel" || r.rol === "coordinador");
  if (!admin) redirect("/dashboard");

  const { data: inst } = await supabase.from("instituciones")
    .select("nombre").eq("id", admin.institucion_id).single();

  const stats = await getStatsAdmin(admin.institucion_id);
  const nombre = user.user_metadata?.nombre || "Admin";

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="fixed inset-y-0 left-0 w-64 bg-[#0b1120] px-4 py-6">
        <div className="mb-8 px-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/40">FashionCloud</p>
          <p className="text-lg font-bold text-white">Education</p>
          <p className="mt-0.5 text-xs text-white/50">{nombre}</p>
          <p className="text-xs text-white/30">{inst?.nombre || ""}</p>
        </div>
        <nav className="space-y-1">
          <Link href="/admin/dashboard" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-white/70 transition hover:bg-white/10">Dashboard</Link>
          <Link href="/admin/miembros" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-white/70 transition hover:bg-white/10">Miembros</Link>
        </nav>
        <div className="absolute bottom-6 left-4 right-4 border-t border-white/10 pt-4">
          <a href="/dashboard" className="block rounded-md px-3 py-2 text-sm text-white/40 transition hover:bg-white/5 hover:text-white/70">← Vista docente</a>
          <form action="/auth/salir" method="post">
            <button type="submit" className="w-full rounded-md px-3 py-2 text-left text-sm text-white/40 transition hover:bg-white/5 hover:text-white/70">Cerrar sesión</button>
          </form>
        </div>
      </aside>
      <div className="flex-1 pl-64 p-8">
        <h1 className="text-2xl font-bold text-gray-900">{inst?.nombre || "Admin"}</h1>
        <p className="mt-1 text-sm text-gray-500">Panel de administración</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border bg-white p-5">
            <p className="text-sm font-medium text-gray-500">Docentes</p><p className="mt-1 text-3xl font-bold text-gray-900">{stats.docentes}</p></div>
          <div className="rounded-xl border bg-white p-5">
            <p className="text-sm font-medium text-gray-500">Alumnos</p><p className="mt-1 text-3xl font-bold text-gray-900">{stats.alumnos}</p></div>
          <div className="rounded-xl border bg-white p-5">
            <p className="text-sm font-medium text-gray-500">Materias</p><p className="mt-1 text-3xl font-bold text-gray-900">{stats.materias}</p></div>
          <div className="rounded-xl border bg-white p-5">
            <p className="text-sm font-medium text-gray-500">Actividades</p><p className="mt-1 text-3xl font-bold text-gray-900">{stats.actividades}</p></div>
        </div>
      </div>
    </div>
  );
}
