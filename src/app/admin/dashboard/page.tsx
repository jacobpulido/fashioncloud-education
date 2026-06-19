import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Use raw SQL query via the supabase client
  // This bypasses RLS issues with the table
  const { data: rows, error } = await supabase
    .rpc("admin_check_role");

  // If the RPC doesn't exist, fallback
  let isAdmin = false;
  if (!error && rows === true) {
    isAdmin = true;
  }

  // Fallback: check user_metadata
  if (!isAdmin && user.user_metadata?.rol) {
    // Try direct fetch with admin client
    // For now, use a simpler approach
    const { data: membres } = await supabase
      .from("miembros_institucion")
      .select("rol")
      .eq("usuario_id", user.id);
    
    isAdmin = membres?.some(r => r.rol === "admin_plantel" || r.rol === "coordinador") ?? false;
  }

  if (!isAdmin) redirect("/dashboard");

  const nombre = user.user_metadata?.nombre || "Admin";

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="fixed inset-y-0 left-0 w-64 bg-[#0b1120] px-4 py-6">
        <div className="mb-8 px-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/40">FashionCloud</p>
          <p className="text-lg font-bold text-white">Education</p>
          <p className="mt-0.5 text-xs text-white/50">{nombre}</p>
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
        <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
        <p className="mt-1 text-sm text-gray-500">Bienvenido al panel de administración</p>
        <div className="mt-6 rounded-xl border bg-white p-6">
          <p className="text-sm text-gray-700">Aquí podrás gestionar tu institución.</p>
          <Link href="/admin/miembros" className="mt-3 inline-flex items-center rounded-lg bg-[#0b1120] px-4 py-2 text-sm font-medium text-white hover:bg-[#1a2235]">
            Gestionar miembros
          </Link>
        </div>
      </div>
    </div>
  );
}
