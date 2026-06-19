"use client";

import { useState, useEffect } from "react";
import { inscribirAlumno, desinscribirAlumno } from "@/lib/actions/inscripciones";
import { actualizarEstadoMateria } from "@/lib/actions/carga-rapida";
import { Plus, Trash2, UserPlus, Send, Archive } from "lucide-react";

// ── Status Button ─────────────────────────────────────────────

export function MateriaStatusButton({ materiaId, estadoActual }: { materiaId: string; estadoActual: string }) {
  const [loading, setLoading] = useState(false);

  async function handleActivar() {
    setLoading(true);
    await actualizarEstadoMateria(materiaId, "activa");
    window.location.reload();
  }

  async function handleArchivar() {
    setLoading(true);
    await actualizarEstadoMateria(materiaId, "archivada");
    window.location.reload();
  }

  if (loading) return <div className="mt-6 rounded-xl border bg-white p-6 text-center text-sm text-gray-500">Actualizando...</div>;

  return (
    <div className="mt-6 rounded-xl border bg-white p-6">
      <h2 className="text-lg font-semibold text-gray-900">Estado</h2>
      <p className="mt-1 text-sm text-gray-500">
        Actual: <span className="font-medium">{estadoActual === "activa" ? "Activa" : estadoActual === "archivada" ? "Archivada" : "Borrador"}</span>
      </p>
      <div className="mt-3 flex gap-2">
        {(estadoActual === "borrador" || estadoActual === "archivada") && (
          <button onClick={handleActivar}
            className="inline-flex items-center gap-1 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700">
            <Send size={16} /> Activar materia
          </button>
        )}
        {estadoActual !== "archivada" && (
          <button onClick={handleArchivar}
            className="inline-flex items-center gap-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            <Archive size={16} /> Archivar
          </button>
        )}
      </div>
    </div>
  );
}

// ── Alumnos Inscription ──────────────────────────────────────

export function MateriaDetailClient({ materiaId, inscritos }: { materiaId: string; inscritos: string[] }) {
  const [alumnos, setAlumnos] = useState<any[]>([]);
  const [selected, setSelected] = useState("");
  const [localInscritos, setLocalInscritos] = useState(inscritos);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/alumnos-list")
      .then(r => r.json())
      .then(data => { setAlumnos(data); setLoading(false); });
  }, []);

  async function handleInscribir() {
    if (!selected) return;
    const res = await inscribirAlumno(materiaId, selected);
    if (res.ok) { setLocalInscritos([...localInscritos, selected]); setSelected(""); }
    else alert("Error: " + res.error);
  }

  async function handleDesinscribir(alumnoId: string) {
    await desinscribirAlumno(materiaId, alumnoId);
    setLocalInscritos(localInscritos.filter(id => id !== alumnoId));
  }

  const disponibles = alumnos.filter(a => !localInscritos.includes(a.id));

  return (
    <div className="mt-6 rounded-xl border bg-white p-6">
      <h2 className="text-lg font-semibold text-gray-900">Alumnos inscritos ({localInscritos.length})</h2>
      <div className="mt-4 flex gap-2">
        <select value={selected} onChange={e => setSelected(e.target.value)}
          className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#0b1120] focus:outline-none">
          <option value="">Seleccionar alumno...</option>
          {disponibles.map((a: any) => <option key={a.id} value={a.id}>{a.nombre || a.email}</option>)}
        </select>
        <button onClick={handleInscribir} disabled={!selected}
          className="inline-flex items-center gap-1 rounded-lg bg-[#0b1120] px-4 py-2 text-sm font-medium text-white hover:bg-[#1a2235] disabled:opacity-50">
          <UserPlus size={16} /> Inscribir
        </button>
      </div>
      {localInscritos.length === 0 ? (
        <p className="mt-4 text-sm text-gray-500">Aún no hay alumnos inscritos.</p>
      ) : (
        <div className="mt-4 space-y-2">
          {localInscritos.map(id => {
            const alumno = alumnos.find(a => a.id === id);
            return (
              <div key={id} className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-2">
                <span className="text-sm text-gray-700">{alumno?.nombre || alumno?.email || id.substring(0, 12) + "..."}</span>
                <button onClick={() => handleDesinscribir(id)} className="text-gray-300 hover:text-red-500 transition"><Trash2 size={14} /></button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
