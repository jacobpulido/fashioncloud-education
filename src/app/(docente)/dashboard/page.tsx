import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function DocenteDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const nombre = user?.user_metadata?.nombre || "Docente";

  // Real counts
  const { count: materiasActivas } = await supabase
    .from("materias_carga")
    .select("id", { count: "exact", head: true })
    .eq("docente_id", user?.id)
    .eq("estado", "activa");

  const { count: totalMaterias } = await supabase
    .from("materias_carga")
    .select("id", { count: "exact", head: true })
    .eq("docente_id", user?.id);

  const { count: actividadesPendientes } = await supabase
    .from("actividades_carga")
    .select("id", { count: "exact", head: true })
    .eq("docente_id", user?.id)
    .eq("estado", "borrador");

  const { count: totalActividades } = await supabase
    .from("actividades_carga")
    .select("id", { count: "exact", head: true })
    .eq("docente_id", user?.id);

  // Get alumnos across all materias
  const { data: materias } = await supabase
    .from("materias_carga")
    .select("id")
    .eq("docente_id", user?.id);

  let totalAlumnos = 0;
  if (materias && materias.length > 0) {
    const { count } = await supabase
      .from("inscripciones_carga")
      .select("alumno_id", { count: "exact", head: true })
      .in("materia_id", materias.map(m => m.id));
    totalAlumnos = count || 0;
  }

  const { count: entregasPorRevisar } = await supabase
    .from("entregas_carga")
    .select("id", { count: "exact", head: true })
    .eq("estado", "entregada");

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Bienvenido, {nombre}</h1>
      <p className="mt-1 text-sm text-gray-500">Panel del docente — FashionCloud Education</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-white p-5">
          <p className="text-sm font-medium text-gray-500">Materias activas</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">{materiasActivas ?? "—"}</p>
          <p className="mt-0.5 text-xs text-gray-400">{totalMaterias ?? 0} total</p>
        </div>
        <div className="rounded-xl border bg-white p-5">
          <p className="text-sm font-medium text-gray-500">Alumnos</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">{totalAlumnos}</p>
        </div>
        <div className="rounded-xl border bg-white p-5">
          <p className="text-sm font-medium text-gray-500">Actividades en borrador</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">{actividadesPendientes ?? "—"}</p>
          <p className="mt-0.5 text-xs text-gray-400">{totalActividades ?? 0} total</p>
        </div>
        <div className="rounded-xl border bg-white p-5">
          <p className="text-sm font-medium text-gray-500">Entregas por revisar</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">{entregasPorRevisar}</p>
        </div>
      </div>

      <div className="mt-8 rounded-xl border bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-900">Comienza rápido</h2>
        <p className="mt-1 text-sm text-gray-500">Carga tu primera materia o crea una actividad.</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/carga-rapida"
            className="inline-flex items-center rounded-lg bg-[#0b1120] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#1a2235]">
            Cargar materia
          </Link>
          <Link href="/actividades"
            className="inline-flex items-center rounded-lg border bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50">
            Crear actividad
          </Link>
          <Link href="/materias"
            className="inline-flex items-center rounded-lg border bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50">
            Ver materias
          </Link>
        </div>
      </div>
    </div>
  );
}
