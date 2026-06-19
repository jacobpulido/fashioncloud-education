"use client";

import { useState, useEffect } from "react";
import { listarActividades, crearActividad, publicarActividad, cerrarActividad, eliminarActividad, type ActividadData } from "@/lib/actions/actividades";
import { Plus, Loader2, Send, Archive, Trash2, Clock, CheckCircle2, XCircle, FileText } from "lucide-react";

type ActividadRow = {
  id: string;
  titulo: string;
  tipo: string;
  estado: string;
  fecha_limite: string | null;
  valor: number;
  materia_id: string;
  created_at: string;
};

export default function ActividadesPage() {
  const [actividades, setActividades] = useState<ActividadRow[]>([]);
  const [materias, setMaterias] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<ActividadData>({
    materia_id: "",
    titulo: "",
    descripcion: "",
    tipo: "tarea",
    fecha_limite: null,
    valor: 100,
    instrucciones: "",
  });

  useEffect(() => {
    async function load() {
      const [acts, mats] = await Promise.all([
        listarActividades(),
        fetch("/api/materias-list").then(r => r.json()).catch(() => []),
      ]);
      setActividades(acts);
      setMaterias(mats);
      setLoading(false);
    }
    load();
  }, []);

  async function handleCrear() {
    if (!form.materia_id || !form.titulo.trim()) return;
    const res = await crearActividad(form);
    if (res.ok) {
      setShowForm(false);
      setForm({ materia_id: "", titulo: "", descripcion: "", tipo: "tarea", fecha_limite: null, valor: 100, instrucciones: "" });
      setActividades(await listarActividades());
    } else alert("Error: " + res.error);
  }

  async function handlePublicar(id: string) {
    await publicarActividad(id);
    setActividades(await listarActividades());
  }

  async function handleCerrar(id: string) {
    await cerrarActividad(id);
    setActividades(await listarActividades());
  }

  async function handleEliminar(id: string) {
    if (!confirm("¿Eliminar esta actividad?")) return;
    await eliminarActividad(id);
    setActividades(await listarActividades());
  }

  const tipoIcon: Record<string, string> = { tarea: "📝", proyecto: "📂", investigacion: "🔍", presentacion: "🎤" };
  const estadoBadge: Record<string, string> = { borrador: "bg-yellow-100 text-yellow-700", publicada: "bg-green-100 text-green-700", cerrada: "bg-gray-100 text-gray-600" };
  const estadoLabel: Record<string, string> = { borrador: "Borrador", publicada: "Publicada", cerrada: "Cerrada" };

  if (loading) return <div className="flex items-center justify-center py-12"><Loader2 className="animate-spin" size={24} /></div>;

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Actividades</h1>
          <p className="mt-1 text-sm text-gray-500">{actividades.length} actividad{actividades.length !== 1 && "es"}</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 rounded-lg bg-[#0b1120] px-4 py-2 text-sm font-medium text-white hover:bg-[#1a2235]">
          <Plus size={16} /> Nueva actividad
        </button>
      </div>

      {showForm && (
        <div className="mt-6 rounded-xl border bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Nueva actividad</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Materia *</label>
              <select value={form.materia_id} onChange={e => setForm({...form, materia_id: e.target.value})}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#0b1120] focus:outline-none">
                <option value="">Seleccionar materia...</option>
                {materias.map((m: any) => <option key={m.id} value={m.id}>{m.nombre}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Título *</label>
              <input type="text" value={form.titulo} onChange={e => setForm({...form, titulo: e.target.value})}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#0b1120] focus:outline-none"
                placeholder="Ej: Bocetaje de colección primavera" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Tipo</label>
                <select value={form.tipo} onChange={e => setForm({...form, tipo: e.target.value as any})}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm">
                  <option value="tarea">Tarea</option>
                  <option value="proyecto">Proyecto</option>
                  <option value="investigacion">Investigación</option>
                  <option value="presentacion">Presentación</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Valor (pts)</label>
                <input type="number" min={1} max={100} value={form.valor} onChange={e => setForm({...form, valor: parseInt(e.target.value) || 100})}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Fecha límite</label>
              <input type="datetime-local" value={form.fecha_limite || ""} onChange={e => setForm({...form, fecha_limite: e.target.value || null})}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Descripción</label>
              <textarea value={form.descripcion} onChange={e => setForm({...form, descripcion: e.target.value})} rows={2}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" placeholder="Breve descripción" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Instrucciones</label>
              <textarea value={form.instrucciones} onChange={e => setForm({...form, instrucciones: e.target.value})} rows={4}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-mono" placeholder="Instrucciones detalladas para los alumnos..." />
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowForm(false)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Cancelar</button>
              <button onClick={handleCrear} disabled={!form.materia_id || !form.titulo.trim()}
                className="rounded-lg bg-[#0b1120] px-6 py-2 text-sm font-medium text-white hover:bg-[#1a2235] disabled:opacity-50">
                <Plus size={16} className="inline mr-1" /> Crear actividad
              </button>
            </div>
          </div>
        </div>
      )}

      {actividades.length === 0 && !showForm ? (
        <div className="mt-12 text-center">
          <div className="mx-auto h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center">
            <FileText size={28} className="text-gray-400" />
          </div>
          <h3 className="mt-4 text-sm font-semibold text-gray-900">No hay actividades</h3>
          <p className="mt-1 text-sm text-gray-500">Crea tu primera actividad para una materia.</p>
          <button onClick={() => setShowForm(true)}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#0b1120] px-4 py-2 text-sm font-medium text-white hover:bg-[#1a2235]">
            <Plus size={16} /> Nueva actividad
          </button>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {actividades.map(a => (
            <div key={a.id} className="rounded-xl border bg-white p-4 transition hover:shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <span className="text-lg mt-0.5">{tipoIcon[a.tipo] || "📝"}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">{a.titulo}</h3>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 font-medium ${estadoBadge[a.estado] || ""}`}>
                        {estadoLabel[a.estado] || a.estado}
                      </span>
                      <span className="text-gray-400">
                        {materias.find(m => m.id === a.materia_id)?.nombre || "—"}
                      </span>
                      {a.fecha_limite && (
                        <span className="flex items-center gap-1 text-gray-400">
                          <Clock size={12} /> {new Date(a.fecha_limite).toLocaleDateString("es-MX")}
                        </span>
                      )}
                      <span className="text-gray-400">{a.valor} pts</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {a.estado === "borrador" && (
                    <button onClick={() => handlePublicar(a.id)} title="Publicar"
                      className="rounded-md p-1.5 text-gray-400 hover:bg-green-50 hover:text-green-600 transition">
                      <Send size={16} />
                    </button>
                  )}
                  {a.estado === "publicada" && (
                    <button onClick={() => handleCerrar(a.id)} title="Cerrar"
                      className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition">
                      <Archive size={16} />
                    </button>
                  )}
                  <button onClick={() => handleEliminar(a.id)} title="Eliminar"
                    className="rounded-md p-1.5 text-gray-300 hover:bg-red-50 hover:text-red-500 transition">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
