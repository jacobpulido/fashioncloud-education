import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MateriaDetailClient, MateriaStatusButton, MateriaEnrollment } from "./client";

export default async function MateriaDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: materia } = await supabase
    .from("materias_carga")
    .select("*")
    .eq("id", id)
    .eq("docente_id", user?.id)
    .single();

  if (!materia) notFound();

  const { data: inscripciones } = await supabase
    .from("inscripciones_carga")
    .select("alumno_id")
    .eq("materia_id", id);

  const inscritos = (inscripciones || []).map(i => i.alumno_id);
  const totalSemanas = (materia.plan_estudios as any[] || []).reduce((sum: number, u: any) => sum + (u.semanas || 0), 0);

  return (
    <div>
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <Link href="/materias" className="hover:text-gray-900">Materias</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">{materia.nombre}</span>
      </div>

      <div className="rounded-xl border bg-white p-6">
        <div className="flex items-start gap-3">
          <div className="h-4 w-4 mt-1 rounded-full shrink-0" style={{ backgroundColor: materia.color || "#6366f1" }} />
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{materia.nombre}</h1>
            {materia.descripcion && <p className="mt-1 text-sm text-gray-500">{materia.descripcion}</p>}
            <div className="mt-3 flex flex-wrap gap-2">
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                materia.estado === "activa" ? "bg-green-100 text-green-700" :
                materia.estado === "archivada" ? "bg-gray-100 text-gray-600" :
                "bg-yellow-100 text-yellow-700"
              }`}>
                {materia.estado === "activa" ? "Activa" : materia.estado === "archivada" ? "Archivada" : "Borrador"}
              </span>
              <span className="text-xs text-gray-400">{totalSemanas} semanas de contenido</span>
              <span className="text-xs text-gray-400">{inscritos.length} alumno{inscritos.length !== 1 && "s"}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href={`/actividades`}
              className="inline-flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50">
              Actividades
            </Link>
          </div>
        </div>
      </div>

      {/* Plan de estudios */}
      <div className="mt-6 rounded-xl border bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-900">Plan de estudios</h2>
        {(materia.plan_estudios as any[] || []).length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">Sin unidades definidas.</p>
        ) : (
          <div className="mt-4 space-y-4">
            {(materia.plan_estudios as any[]).map((unidad: any, i: number) => (
              <div key={i} className="rounded-lg border border-gray-200 p-4">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0b1120] text-xs font-medium text-white">
                    {i + 1}
                  </span>
                  <h3 className="font-semibold text-gray-900">{unidad.titulo}</h3>
                  {unidad.semanas && <span className="text-xs text-gray-400">({unidad.semanas} sem)</span>}
                </div>
                <ul className="mt-2 space-y-1 pl-8">
                  {(unidad.temas || []).map((tema: string, j: number) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-300" />
                      {tema}
                    </li>
                  ))}
                </ul>
                {unidad.actividades_sugeridas?.length > 0 && (
                  <div className="mt-2 border-t border-gray-100 pt-2 pl-8">
                    <p className="text-xs font-medium text-gray-400">Actividades sugeridas:</p>
                    <ul className="mt-1 list-inside list-disc text-xs text-gray-400">
                      {unidad.actividades_sugeridas.map((act: string, j: number) => <li key={j}>{act}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Estado + Alumnos */}
      <MateriaEnrollment materiaId={id} materiaNombre={materia.nombre} />
      <MateriaStatusButton materiaId={id} estadoActual={materia.estado} />
      <MateriaDetailClient materiaId={id} inscritos={inscritos} />
    </div>
  );
}
