"use client";

import { useState, useEffect } from "react";
import { inscribirAlumno, desinscribirAlumno } from "@/lib/actions/inscripciones";
import { actualizarEstadoMateria } from "@/lib/actions/carga-rapida";
import { QRCodeSVG } from "qrcode.react";
import { Plus, Trash2, UserPlus, Send, Archive, QrCode, Link, Copy, Check, Mail } from "lucide-react";

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

// ── QR / Link / Email ──────────────────────────────────────

export function MateriaEnrollment({ materiaId, materiaNombre }: { materiaId: string; materiaNombre: string }) {
  const [showQR, setShowQR] = useState(false);
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://fashioncloud-education.vercel.app";
  const token = btoa(materiaId + ":" + materiaNombre).replace(/=/g, "");
  const enrollUrl = `${baseUrl}/api/inscribir?materia_id=${materiaId}&token=${token}`;

  async function copyLink() {
    await navigator.clipboard.writeText(enrollUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleEmailInvite() {
    const subject = encodeURIComponent(`Invitación a ${materiaNombre}`);
    const body = encodeURIComponent(
      `Te invito a inscribirte en "${materiaNombre}".\n\nAbre este enlace:\n${enrollUrl}\n\nSi no tienes cuenta, regístrate y automáticamente quedarás inscrito.`
    );
    window.open(`mailto:${email}?subject=${subject}&body=${body}`, "_blank");
    setEmailSent(true);
    setTimeout(() => setEmailSent(false), 3000);
  }

  return (
    <div className="mt-6 rounded-xl border bg-white p-6">
      <h2 className="text-lg font-semibold text-gray-900">Invitar alumnos</h2>
      <p className="mt-1 text-sm text-gray-500">Comparte el acceso a esta materia</p>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {/* QR */}
        <button onClick={() => setShowQR(!showQR)}
          className="flex flex-col items-center gap-2 rounded-lg border-2 border-gray-200 p-4 transition hover:border-[#0b1120] hover:bg-gray-50">
          <QrCode size={24} className="text-[#0b1120]" />
          <span className="text-sm font-medium text-gray-700">Código QR</span>
          <span className="text-xs text-gray-400">Escanea para inscribirse</span>
        </button>

        {/* Link */}
        <button onClick={copyLink}
          className="flex flex-col items-center gap-2 rounded-lg border-2 border-gray-200 p-4 transition hover:border-[#0b1120] hover:bg-gray-50">
          {copied ? <Check size={24} className="text-green-600" /> : <Link size={24} className="text-[#0b1120]" />}
          <span className="text-sm font-medium text-gray-700">{copied ? "¡Copiado!" : "Link de acceso"}</span>
          <span className="text-xs text-gray-400">Copiar enlace para compartir</span>
        </button>

        {/* Email */}
        <div className="flex flex-col items-center gap-2 rounded-lg border-2 border-gray-200 p-4">
          <Mail size={24} className="text-[#0b1120]" />
          <span className="text-sm font-medium text-gray-700">Invitación por email</span>
          <div className="flex w-full gap-1">
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="alumno@email.com"
              className="min-w-0 flex-1 rounded border border-gray-300 px-2 py-1 text-xs" />
            <button onClick={handleEmailInvite} disabled={!email.includes("@")}
              className="shrink-0 rounded bg-[#0b1120] px-2 py-1 text-xs text-white disabled:opacity-50">
              {emailSent ? "✓" : "Enviar"}
            </button>
          </div>
        </div>
      </div>

      {showQR && (
        <div className="mt-4 flex flex-col items-center gap-2 rounded-lg bg-gray-50 p-6">
          <QRCodeSVG value={enrollUrl} size={180} level="M" />
          <p className="text-xs text-gray-400">Escanea con la cámara del teléfono</p>
        </div>
      )}
    </div>
  );
}

// ── Alumnos Inscription ──────────────────────────────────────

export function MateriaDetailClient({ materiaId, inscritos }: { materiaId: string; inscritos: string[] }) {
  const [alumnos, setAlumnos] = useState<any[]>([]);
  const [selected, setSelected] = useState("");
  const [localInscritos, setLocalInscritos] = useState(inscritos);

  useEffect(() => {
    fetch("/api/alumnos-list")
      .then(r => r.json())
      .then(data => setAlumnos(data));
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
