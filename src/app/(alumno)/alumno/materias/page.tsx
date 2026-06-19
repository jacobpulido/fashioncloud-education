import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function AlumnoMaterias() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: inscripciones } = await supabase
    .from("inscripciones_carga")
    .select("materia_id")
    .eq("alumno_id", user.id);

  const materiaIds = (inscripciones || []).map(i => i.materia_id);

  if (materiaIds.length === 0) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mis materias</h1>
        <p className="mt-1 text-sm text-gray-500">No estás inscrito en ninguna materia</p>
        <div className="mt-12 text-center">
          <div className="mx-auto h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center">
            <span className="text-2xl">📚</span>
          </div>
          <h3 className="mt-4 text-sm font-semibold text-gray-900">Aún sin materias</h3>
          <p className="mt-1 text-sm text-gray-500">Espera a que un docente te inscriba.</p>
        </div>
      </div>
    );
  }

  const { data: materias } = await supabase
    .from("materias_carga")
    .select("id, nombre, descripcion, color, docente_id, estado")
    .in("id", materiaIds);

  const { data: actividades } = await supabase
    .from("actividades_carga")
    .select("materia_id, id")
    .in("materia_id", materiaIds)
    .eq("estado", "publicada");

  const actCount = new Map();
  (actividades || []).forEach(a => actCount.set(a.materia_id, (actCount.get(a.materia_id) || 0) + 1));

  const { data: entregas } = await supabase
    .from("entregas_carga")
    .select("actividad_id, nota, estado")
    .eq("alumno_id", user.id);

  const entregasPorAct = new Map((entregas || []).map(e => [e.actividad_id, e]));

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mis materias</h1>
          <p className="mt-1 text-sm text-gray-500">{materias?.length || 0} materia{(materias?.length || 0) !== 1 && "s"}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(materias || []).map(m => {
          const totalAct = actCount.get(m.id) || 0;
          const entregadas = (actividades || []).filter(a => a.materia_id === m.id && entregasPorAct.has(a.id)).length;
          return (
            <Link key={m.id} href={`/pendientes`}
              className="group rounded-xl border bg-white p-5 transition hover:shadow-md">
              <div className="flex items-start gap-3">
                <div className="h-3 w-3 mt-1.5 shrink-0 rounded-full" style={{ backgroundColor: m.color || "#6366f1" }} />
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-gray-900 truncate">{m.nombre}</h3>
                  {m.descripcion && <p className="mt-1 text-xs text-gray-500 line-clamp-1">{m.descripcion}</p>}
                  <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
                    <span>{totalAct} actividad{totalAct !== 1 && "es"}</span>
                    {totalAct > 0 && <span>· {entregadas}/{totalAct} entregadas</span>}
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
