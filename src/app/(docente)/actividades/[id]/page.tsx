"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getActividad, publicarActividad, cerrarActividad } from "@/lib/actions/actividades";
import { calificarEntrega } from "@/lib/actions/inscripciones";
import { Loader2, Send, Archive, ChevronLeft, Star } from "lucide-react";

export default function ActividadDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [actividad, setActividad] = useState<any>(null);
  const [entregas, setEntregas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [calificando, setCalificando] = useState<string | null>(null);
  const [nota, setNota] = useState("");
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    async function load() {
      const act = await getActividad(id);
      setActividad(act);
      const res = await fetch(`/api/actividades-entregas?actividad_id=${id}`);
      const ents = await res.json();
      setEntregas(ents);
      setLoading(false);
    }
    load();
  }, [id]);

  async function handlePublicar() {
    await publicarActividad(id);
    setActividad({ ...actividad, estado: "publicada" });
  }
  async function handleCerrar() {
    await cerrarActividad(id);
    setActividad({ ...actividad, estado: "cerrada" });
  }
  async function handleCalificar(entregaId: string) {
    if (!nota || isNaN(Number(nota))) return;
    const res = await calificarEntrega(entregaId, Number(nota), feedback);
    if (res.ok) {
      setEntregas(entregas.map(e => e.id === entregaId ? { ...e, estado: "calificada", nota: Number(nota), retroalimentacion: feedback } : e));
      setCalificando(null); setNota(""); setFeedback("");
    } else alert("Error: " + res.error);
  }

  if (loading) return <div className="flex items-center justify-center py-12"><Loader2 className="animate-spin" size={24} /></div>;
  if (!actividad) return <p className="py-12 text-center text-gray-500">Actividad no encontrada</p>;

  const tipoIcon: Record<string, string> = { tarea: "📝", proyecto: "📂", investigacion: "🔍", presentacion: "🎤" };

  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/actividades" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 mb-4">
        <ChevronLeft size={16} /> Volver a actividades
      </Link>

      <div className="rounded-xl border bg-white p-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">{tipoIcon[actividad.tipo] || "📝"}</span>
              <h1 className="text-2xl font-bold text-gray-900">{actividad.titulo}</h1>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
              <span className="text-gray-500">{actividad.materias_carga?.nombre}</span>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                actividad.estado === "publicada" ? "bg-green-100 text-green-700" :
                actividad.estado === "cerrada" ? "bg-gray-100 text-gray-600" :
                "bg-yellow-100 text-yellow-700"}`}>
                {actividad.estado}
              </span>
              <span className="text-gray-400">{actividad.valor} pts</span>
              {actividad.fecha_limite && <span className="text-gray-400">Vence: {new Date(actividad.fecha_limite).toLocaleDateString("es-MX")}</span>}
            </div>
          </div>
          <div className="flex gap-2">
            {actividad.estado === "borrador" && (
              <button onClick={handlePublicar} className="inline-flex items-center gap-1 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700">
                <Send size={16} /> Publicar
              </button>
            )}
            {actividad.estado === "publicada" && (
              <button onClick={handleCerrar} className="inline-flex items-center gap-1 rounded-lg border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                <Archive size={16} /> Cerrar
              </button>
            )}
          </div>
        </div>
        {actividad.descripcion && <p className="mt-4 text-sm text-gray-600">{actividad.descripcion}</p>}
        {actividad.instrucciones && (
          <div className="mt-4 rounded-lg bg-gray-50 p-4">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Instrucciones</p>
            <p className="mt-1 text-sm text-gray-700 whitespace-pre-wrap">{actividad.instrucciones}</p>
          </div>
        )}
      </div>

      <div className="mt-6 rounded-xl border bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-900">Entregas ({entregas.length})</h2>
        {entregas.length === 0 ? (
          <p className="mt-4 text-sm text-gray-500">Aún no hay entregas.</p>
        ) : (
          <div className="mt-4 space-y-4">
            {entregas.map(e => (
              <div key={e.id} className="rounded-lg border border-gray-200 p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        e.estado === "calificada" ? "bg-green-100 text-green-700" :
                        e.estado === "entregada" ? "bg-blue-100 text-blue-700" :
                        "bg-yellow-100 text-yellow-700"}`}>
                        {e.estado === "calificada" ? `✅ ${e.nota}/100` : e.estado}
                      </span>
                      <span className="text-xs text-gray-400">Alumno: {e.alumno_id.substring(0, 8)}...</span>
                    </div>
                    {e.contenido && (
                      <div className="mt-2 rounded bg-gray-50 p-3 text-sm text-gray-700 whitespace-pre-wrap">{e.contenido}</div>
                    )}
                    {e.retroalimentacion && (
                      <div className="mt-2 rounded bg-green-50 p-3 text-sm text-green-700">
                        <span className="font-medium">Tu feedback:</span> {e.retroalimentacion}
                      </div>
                    )}
                  </div>
                  {e.estado !== "calificada" && (
                    <button onClick={() => setCalificando(calificando === e.id ? null : e.id)}
                      className="shrink-0 rounded-lg border px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 ml-3">
                      Calificar
                    </button>
                  )}
                </div>
                {calificando === e.id && (
                  <div className="mt-3 border-t border-gray-100 pt-3 space-y-3">
                    <div className="flex items-center gap-3">
                      <label className="text-sm font-medium text-gray-700">Nota (0-100)</label>
                      <input type="number" min={0} max={100} value={nota} onChange={ev => setNota(ev.target.value)}
                        className="w-20 rounded-lg border border-gray-300 px-2 py-1 text-sm text-center" />
                    </div>
                    <div>
                      <textarea value={feedback} onChange={ev => setFeedback(ev.target.value)}
                        rows={3} placeholder="Retroalimentación para el alumno..."
                        className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
                    </div>
                    <div className="flex justify-end">
                      <button onClick={() => handleCalificar(e.id)} disabled={!nota}
                        className="inline-flex items-center gap-1 rounded-lg bg-[#0b1120] px-4 py-2 text-sm font-medium text-white hover:bg-[#1a2235] disabled:opacity-50">
                        <Star size={16} /> Guardar calificación
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
