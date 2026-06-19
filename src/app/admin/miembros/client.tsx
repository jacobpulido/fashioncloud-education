"use client";

import { useState } from "react";
import { actualizarRol } from "@/lib/actions/institucion";
import { Loader2, Shield, UserCheck } from "lucide-react";

const roles = ["admin_plantel", "coordinador", "docente", "alumno"];
const roleLabels: Record<string, string> = {
  admin_plantel: "Admin Plantel",
  coordinador: "Coordinador",
  docente: "Docente",
  alumno: "Alumno",
};

export function AdminMiembrosClient({ miembros, institucionId }: { miembros: any[]; institucionId: string }) {
  const [lista, setLista] = useState(miembros);

  async function handleRol(miembroId: string, nuevoRol: string) {
    await actualizarRol(miembroId, nuevoRol);
    setLista(lista.map(m => m.id === miembroId ? { ...m, rol: nuevoRol } : m));
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Miembros</h1>
      <p className="mt-1 text-sm text-gray-500">{lista.length} miembro{lista.length !== 1 && "s"}</p>

      <div className="mt-6 space-y-3">
        {lista.map(m => (
          <div key={m.id} className="rounded-xl border bg-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                <Shield size={18} className="text-gray-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{m.usuario_id}</p>
                <p className="text-xs text-gray-400">ID: {m.usuario_id.substring(0, 12)}...</p>
              </div>
            </div>
            <select value={m.rol} onChange={e => handleRol(m.id, e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-[#0b1120] focus:outline-none">
              {roles.map(r => <option key={r} value={r}>{roleLabels[r]}</option>)}
            </select>
          </div>
        ))}
        {lista.length === 0 && (
          <div className="text-center py-12">
            <UserCheck size={32} className="mx-auto text-gray-300" />
            <p className="mt-2 text-sm text-gray-500">Sin miembros todavía</p>
          </div>
        )}
      </div>
    </div>
  );
}
