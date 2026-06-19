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
          <div className="mx-auto h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center"><span className="text-2xl">📚</span></div>
          <h3 className="mt-4 text-sm font-semibold text-gray-900">Aún sin materias</h3>
          <p className="mt-1 text-sm text-gray-500">Espera a que un docente te inscriba.</p>
        </div>
      </div>
    );
  }

  const { data: materias } = await supabase
    .from("materias_carga")
    .select("id, nombre, descripcion, color, docente_id, estado, plan_estudios")
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

      <div className="mt-6 space-y-6">
        {(materias || []).map(m => {
          const totalAct = actCount.get(m.id) || 0;
          const entregadas = (actividades || []).filter(a => a.materia_id === m.id && entregasPorAct.has(a.id)).length;
          const plan = (m.plan_estudios as any[]) || [];
          return (
            <div key={m.id} className="rounded-xl border bg-white">
              <div className="p-5 border-b border-gray-100">
                <div className="flex items-start gap-3">
                  <div className="h-3 w-3 mt-1.5 shrink-0 rounded-full" style={{ backgroundColor: m.color || "#6366f1" }} />
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-gray-900 truncate text-lg">{m.nombre}</h3>
                    {m.descripcion && <p className="mt-0.5 text-xs text-gray-500">{m.descripcion}</p>}
                    <div className="mt-2 flex items-center gap-3 text-xs text-gray-400">
                      <span>{totalAct} actividad{totalAct !== 1 && "es"}</span>
                      {totalAct > 0 && <span>{entregadas}/{totalAct} entregadas</span>}
                      <span>{plan.length} unidad{plan.length !== 1 && "es"}</span>
                    </div>
                  </div>
                  <Link href="/alumno/pendientes"
                    className="shrink-0 rounded-lg border px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50">
                    Ver actividades
                  </Link>
                </div>
              </div>
              {plan.length > 0 && (
                <div className="p-5">
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">Plan de estudios</p>
                  <div className="space-y-3">
                    {plan.map((u: any, i: number) => (
                      <div key={i} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0b1120] text-xs font-medium text-white">{i + 1}</span>
                          {i < plan.length - 1 && <div className="mt-1 w-px flex-1 bg-gray-200" />}
                        </div>
                        <div className="pb-3">
                          <p className="text-sm font-medium text-gray-900">{u.titulo}</p>
                          {u.semanas && <p className="text-xs text-gray-400">{u.semanas} semanas</p>}
                          <ul className="mt-1 space-y-0.5">
                            {(u.temas || []).map((t: string, j: number) => (
                              <li key={j} className="flex items-start gap-1.5 text-xs text-gray-600">
                                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gray-300" />
                                {t}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
