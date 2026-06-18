import { createClient } from "@/lib/supabase/server";

export default async function DocenteDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const nombre = user?.user_metadata?.nombre || "Docente";

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">
        Bienvenido, {nombre}
      </h1>
      <p className="mt-1 text-sm text-gray-500">
        Panel del docente — FashionCloud Education
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border bg-white p-5">
          <p className="text-sm font-medium text-gray-500">Materias activas</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">—</p>
        </div>

        <div className="rounded-xl border bg-white p-5">
          <p className="text-sm font-medium text-gray-500">Alumnos</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">—</p>
        </div>

        <div className="rounded-xl border bg-white p-5">
          <p className="text-sm font-medium text-gray-500">Actividades pendientes</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">—</p>
        </div>
      </div>

      <div className="mt-8 rounded-xl border bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Comienza rápido
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Carga tu primera materia usando el programa académico o una plantilla.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <a
            href="/docente/carga-rapida"
            className="inline-flex items-center rounded-lg bg-[#0b1120] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#1a2235]"
          >
            Cargar materia
          </a>
          <a
            href="/docente/materias"
            className="inline-flex items-center rounded-lg border bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Ver materias
          </a>
        </div>
      </div>
    </div>
  );
}
