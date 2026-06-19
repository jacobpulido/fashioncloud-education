import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function MateriasPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: materias } = await supabase
    .from("materias")
    .select("id, nombre, descripcion, color, estado, created_at")
    .eq("docente_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mis materias</h1>
          <p className="mt-1 text-sm text-gray-500">
            {materias?.length
              ? `${materias.length} materia${materias.length !== 1 ? "s" : ""}`
              : "Aún no tienes materias"}
          </p>
        </div>
        <Link
          href="/carga-rapida"
          className="inline-flex items-center gap-2 rounded-lg bg-[#0b1120] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#1a2235]"
        >
          <Plus size={16} />
          Nueva materia
        </Link>
      </div>

      {materias && materias.length > 0 ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {materias.map((m) => (
            <div
              key={m.id}
              className="group rounded-xl border bg-white p-5 transition hover:shadow-md"
            >
              <div className="flex items-start gap-3">
                <div
                  className="h-3 w-3 mt-1.5 shrink-0 rounded-full"
                  style={{ backgroundColor: m.color || "#6366f1" }}
                />
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {m.nombre}
                  </h3>
                  {m.descripcion && (
                    <p className="mt-1 text-xs text-gray-500 line-clamp-2">
                      {m.descripcion}
                    </p>
                  )}
                  <div className="mt-3 flex items-center gap-2">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                        m.estado === "activa"
                          ? "bg-green-100 text-green-700"
                          : m.estado === "archivada"
                            ? "bg-gray-100 text-gray-600"
                            : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {m.estado === "activa"
                        ? "Activa"
                        : m.estado === "archivada"
                          ? "Archivada"
                          : "Borrador"}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(m.created_at).toLocaleDateString("es-MX", {
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-12 text-center">
          <div className="mx-auto h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center">
            <Plus size={28} className="text-gray-400" />
          </div>
          <h3 className="mt-4 text-sm font-semibold text-gray-900">
            No hay materias todavía
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Carga tu primera materia usando el programa académico.
          </p>
          <Link
            href="/carga-rapida"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#0b1120] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#1a2235]"
          >
            <Plus size={16} />
            Cargar materia
          </Link>
        </div>
      )}
    </div>
  );
}
