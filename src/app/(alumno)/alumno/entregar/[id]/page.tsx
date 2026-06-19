"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Loader2, Send } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function AlumnoEntregarPage() {
  const { id } = useParams<{ id: string }>();
  const [actividad, setActividad] = useState<any>(null);
  const [entrega, setEntrega] = useState<any>(null);
  const [contenido, setContenido] = useState("");
  const [loading, setLoading] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: act } = await supabase.from("actividades_carga").select("*, materias_carga!inner(nombre)").eq("id", id).single();
      setActividad(act);
      const { data: ent } = await supabase.from("entregas_carga").select("*").eq("actividad_id", id).eq("alumno_id", user.id).single();
      if (ent) { setEntrega(ent); setContenido(ent.contenido || ""); }
      setLoading(false);
    }
    load();
  }, [id]);

  async function handleEntregar() {
    setEnviando(true); setMensaje("");
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    if (entrega) {
      const { error } = await supabase.from("entregas_carga").update({ contenido, estado: "entregada", updated_at: new Date().toISOString() }).eq("id", entrega.id);
      if (error) setMensaje("Error: " + error.message); else { setMensaje("✅ Entrega actualizada"); setEntrega({...entrega, estado: "entregada"}); }
    } else {
      const { data, error } = await supabase.from("entregas_carga").insert({ actividad_id: id, alumno_id: user.id, contenido, estado: "entregada" }).select().single();
      if (error) setMensaje("Error: " + error.message); else { setMensaje("✅ Entregada"); setEntrega(data); }
    }
    setEnviando(false);
  }

  if (loading) return <div className="flex items-center justify-center py-12"><Loader2 className="animate-spin" size={24} /></div>;
  if (!actividad) return <p className="py-12 text-center text-gray-500">Actividad no encontrada</p>;

  const vencida = actividad.fecha_limite && new Date(actividad.fecha_limite) < new Date();

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900">{actividad.titulo}</h1>
      <p className="mt-1 text-sm text-gray-500">{actividad.materias_carga?.nombre}</p>
      <div className="mt-6 space-y-6">
        <div className="rounded-xl border bg-white p-6">
          <div className="flex flex-wrap gap-3 text-sm">
            <span className="rounded-full bg-[#0b1120]/10 px-3 py-1 font-medium text-[#0b1120]">{actividad.tipo}</span>
            <span className="rounded-full bg-gray-100 px-3 py-1 text-gray-600">{actividad.valor} pts</span>
            {actividad.fecha_limite && (
              <span className={`rounded-full px-3 py-1 ${vencida ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"}`}>
                {vencida ? "Vencida" : `Vence: ${new Date(actividad.fecha_limite).toLocaleDateString("es-MX")}`}
              </span>
            )}
            {entrega?.estado === "calificada" && <span className="rounded-full bg-green-100 px-3 py-1 font-medium text-green-700">✅ {entrega.nota}/100</span>}
          </div>
          {actividad.descripcion && <p className="mt-4 text-sm text-gray-600">{actividad.descripcion}</p>}
          {actividad.instrucciones && (
            <div className="mt-4 rounded-lg bg-gray-50 p-4">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Instrucciones</p>
              <p className="mt-1 text-sm text-gray-700 whitespace-pre-wrap">{actividad.instrucciones}</p>
            </div>
          )}
        </div>
        {entrega?.estado === "calificada" && entrega.retroalimentacion && (
          <div className="rounded-xl border border-green-200 bg-green-50 p-6">
            <h3 className="text-sm font-semibold text-green-800">Retroalimentación</h3>
            <p className="mt-1 text-sm text-green-700 whitespace-pre-wrap">{entrega.retroalimentacion}</p>
          </div>
        )}
        {!vencida && (
          <div className="rounded-xl border bg-white p-6">
            <h3 className="text-sm font-semibold text-gray-900">Tu entrega</h3>
            {entrega?.estado === "calificada" ? (
              <div className="mt-3 rounded-lg bg-gray-50 p-4"><p className="text-sm text-gray-700 whitespace-pre-wrap">{entrega.contenido}</p></div>
            ) : (
              <>
                <textarea value={contenido} onChange={e => setContenido(e.target.value)}
                  rows={8}
                  className="mt-3 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#0b1120] focus:outline-none"
                  placeholder="Escribe aquí tu respuesta..." />
                <div className="mt-4 flex justify-end">
                  <button onClick={handleEntregar} disabled={enviando || !contenido.trim()}
                    className="inline-flex items-center gap-2 rounded-lg bg-[#0b1120] px-6 py-2 text-sm font-medium text-white hover:bg-[#1a2235] disabled:opacity-50">
                    {enviando ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                    {entrega ? "Actualizar" : "Entregar"}
                  </button>
                </div>
              </>
            )}
          </div>
        )}
        {mensaje && <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-700">{mensaje}</div>}
      </div>
    </div>
  );
}
