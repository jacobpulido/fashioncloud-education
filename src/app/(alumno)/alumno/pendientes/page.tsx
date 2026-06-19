import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function AlumnoPendientes() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const nombre = user.user_metadata?.nombre || "Alumno";

  // Get inscripciones
  const { data: inscripciones } = await supabase
    .from("inscripciones_carga")
    .select("materia_id")
    .eq("alumno_id", user.id);

  const materiaIds = (inscripciones || []).map(i => i.materia_id);

  // Get materias
  const { data: materias } = materiaIds.length > 0 ? await supabase
    .from("materias_carga")
    .select("id, nombre, color, docente_id")
    .in("id", materiaIds) : { data: [] };

  // Get actividades publicadas para las materias inscritas
  const { data: actividades } = materiaIds.length > 0 ? await supabase
    .from("actividades_carga")
    .select("id, titulo, tipo, fecha_limite, valor, materia_id, created_at")
    .in("materia_id", materiaIds)
    .eq("estado", "publicada")
    .order("fecha_limite", { ascending: true }) : { data: [] };

  // Get entregas del alumno
  const { data: entregas } = await supabase
    .from("entregas_carga")
    .select("actividad_id, estado, nota")
    .eq("alumno_id", user.id);

  const entregasMap = new Map((entregas || []).map(e => [e.actividad_id, e]));

  const tipoIcon: Record<string, string> = { tarea: "📝", proyecto: "📂", investigacion: "🔍", presentacion: "🎤" };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Mis pendientes</h1>
      <p className="mt-1 text-sm text-gray-500">Hola {nombre}, tienes {actividades?.length || 0} actividad{(actividades?.length || 0) !== 1 && "es"} pendiente{(actividades?.length || 0) !== 1 && "s"}</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border bg-white p-5">
          <p className="text-sm font-medium text-gray-500">Materias inscritas</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">{materias?.length || 0}</p>
        </div>
        <div className="rounded-xl border bg-white p-5">
          <p className="text-sm font-medium text-gray-500">Actividades pendientes</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">{actividades?.length || 0}</p>
        </div>
        <div className="rounded-xl border bg-white p-5">
          <p className="text-sm font-medium text-gray-500">Calificadas</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">{Array.from(entregasMap.values()).filter(e => e.estado === "calificada").length}</p>
        </div>
      </div>

      {materias && materias.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900">Mis materias</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {materias.map(m => (
              <Link key={m.id} href={`/materias/${m.id}`}
                className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm text-gray-700 hover:bg-gray-50">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: m.color || "#6366f1" }} />
                {m.nombre}
              </Link>
            ))}
          </div>
        </div>
      )}

      {actividades && actividades.length > 0 && (
        <div className="mt-6 space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">Actividades pendientes</h2>
          {actividades.map(a => {
            const entrega = entregasMap.get(a.id);
            const materia = materias?.find(m => m.id === a.materia_id);
            const vencida = a.fecha_limite && new Date(a.fecha_limite) < new Date();
            return (
              <Link key={a.id} href={`/actividades/${a.id}`}
                className={`block rounded-xl border p-4 transition hover:shadow-sm ${vencida ? "border-red-200 bg-red-50" : "bg-white"}`}>
                <div className="flex items-start gap-3">
                  <span className="text-lg mt-0.5">{tipoIcon[a.tipo] || "📝"}</span>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-gray-900">{a.titulo}</h3>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
                      <span className="text-gray-500">{materia?.nombre || "—"}</span>
                      <span className="text-gray-400">{a.valor} pts</span>
                      {a.fecha_limite && (
                        <span className={`${vencida ? "text-red-600 font-medium" : "text-gray-400"}`}>
                          {vencida ? "Vencida" : `Vence: ${new Date(a.fecha_limite).toLocaleDateString("es-MX")}`}
                        </span>
                      )}
                      {entrega && (
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          entrega.estado === "calificada" ? "bg-green-100 text-green-700" :
                          entrega.estado === "entregada" ? "bg-blue-100 text-blue-700" :
                          "bg-yellow-100 text-yellow-700"
                        }`}>
                          {entrega.estado === "calificada" ? `✅ ${entrega.nota} pts` :
                           entrega.estado === "entregada" ? "Entregada" : "Borrador"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {(!actividades || actividades.length === 0) && (!materias || materias.length === 0) && (
        <div className="mt-12 text-center">
          <div className="mx-auto h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center">
            <span className="text-2xl">📚</span>
          </div>
          <h3 className="mt-4 text-sm font-semibold text-gray-900">No estás inscrito en ninguna materia</h3>
          <p className="mt-1 text-sm text-gray-500">Espera a que un docente te inscriba.</p>
        </div>
      )}
    </div>
  );
}
