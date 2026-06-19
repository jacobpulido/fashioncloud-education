"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function RegistroPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [rol, setRol] = useState<"docente" | "alumno">("docente");
  const [instituciones, setInstituciones] = useState<any[]>([]);
  const [institucionId, setInstitucionId] = useState("");
  const [crearInstitucion, setCrearInstitucion] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    supabase.from("instituciones").select("id, nombre").eq("activa", true).order("nombre").then(({ data }) => {
      setInstituciones(data ?? []);
    });
  }, []);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data: { user }, error: signUpError } = await supabase.auth.signUp({
      email, password,
      options: { data: { nombre, rol } },
    });

    if (signUpError || !user) {
      setError(signUpError?.message || "Error al crear cuenta");
      setLoading(false);
      return;
    }

    // Crear o asignar institución
    let instId = institucionId;
    if (crearInstitucion.trim()) {
      const slug = crearInstitucion.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      const { data: newInst, error: instError } = await supabase
        .from("instituciones").insert({ nombre: crearInstitucion.trim(), slug }).select("id").single();
      if (instError) { setError(instError.message); setLoading(false); return; }
      instId = newInst.id;
    }

    if (instId) {
      await supabase.from("miembros_institucion").insert({
        institucion_id: instId,
        usuario_id: user.id,
        rol: rol,
      });
    }

    router.push("/login?registro=exitoso");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0b1120] px-4 py-8">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-white">Crear cuenta</h1>
          <p className="mt-1 text-sm text-white/60">FashionCloud Education</p>
        </div>
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/80">Nombre completo</label>
            <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} required
              className="mt-1 block w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-white/40 focus:border-white/20 focus:outline-none" placeholder="Tu nombre" />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/80">Correo electrónico</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
              className="mt-1 block w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-white/40 focus:border-white/20 focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/80">Contraseña</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6}
              className="mt-1 block w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-white/40 focus:border-white/20 focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/80">Eres</label>
            <div className="mt-1 flex gap-2">
              <button type="button" onClick={() => setRol("docente")}
                className={`flex-1 rounded-lg border px-3 py-2 text-sm transition ${rol === "docente" ? "border-white/30 bg-white/15 text-white" : "border-white/10 text-white/60 hover:text-white/80"}`}>Docente</button>
              <button type="button" onClick={() => setRol("alumno")}
                className={`flex-1 rounded-lg border px-3 py-2 text-sm transition ${rol === "alumno" ? "border-white/30 bg-white/15 text-white" : "border-white/10 text-white/60 hover:text-white/80"}`}>Alumno</button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-white/80">Institución</label>
            <select value={institucionId} onChange={e => { setInstitucionId(e.target.value); if (e.target.value) setCrearInstitucion(""); }}
              className="mt-1 block w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white focus:border-white/20 focus:outline-none">
              <option value="">Seleccionar institución...</option>
              {instituciones.map(i => <option key={i.id} value={i.id}>{i.nombre}</option>)}
              <option value="__new__">+ Crear nueva institución</option>
            </select>
            {institucionId === "__new__" && (
              <input type="text" value={crearInstitucion} onChange={e => setCrearInstitucion(e.target.value)} placeholder="Nombre de la institución"
                className="mt-2 block w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-white/40 focus:border-white/20 focus:outline-none" />
            )}
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full rounded-lg bg-white px-4 py-2 text-sm font-semibold text-[#0b1120] transition hover:bg-white/90 disabled:opacity-50">
            {loading ? "Creando cuenta…" : "Crear cuenta"}
          </button>
          <p className="text-center text-xs text-white/40">
            ¿Ya tienes cuenta? <a href="/login" className="text-white/70 hover:text-white">Inicia sesión</a>
          </p>
        </form>
      </div>
    </div>
  );
}
