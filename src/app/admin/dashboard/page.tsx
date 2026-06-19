import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getStatsAdmin } from "@/lib/actions/institucion";

export default async function AdminDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: roles } = await supabase
    .from("miembros_institucion")
    .select("institucion_id")
    .eq("usuario_id", user.id);

  const member = roles?.[0];
  if (!member) redirect("/dashboard");

  const { data: inst } = await supabase
    .from("instituciones")
    .select("nombre")
    .eq("id", member.institucion_id)
    .single();

  const stats = await getStatsAdmin(member.institucion_id);

  return (
    <div>
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
  );
}
