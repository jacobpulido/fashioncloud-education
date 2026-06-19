"use client";

import { useState, useRef, useActionState } from "react";
import { procesarConIA, guardarMateria, type CargaRapidaState } from "@/lib/actions/carga-rapida";
import type { CursoGenerado } from "@/lib/deepseek";
import {
  FileText,
  ClipboardPaste,
  Upload,
  Loader2,
  Check,
  ChevronLeft,
  Plus,
  Trash2} from "lucide-react";

type Modo = "elegir" | "plantilla" | "pegar" | "archivo";

export default function CargaRapidaPage() {
  const [modo, setModo] = useState<Modo>("elegir");
  const [texto, setTexto] = useState("");
  const [archivoNombre, setArchivoNombre] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const [state, formAction, isPending] = useActionState(procesarConIA, {
    status: "idle",
  } as CargaRapidaState);

  // Editor del plan de estudios
  const [editando, setEditando] = useState<CursoGenerado | null>(null);

  // Cuando llega preview, cargamos el editor
  if (state.status === "preview" && !editando) {
    // Esto se ejecuta 1 vez; usamos un efecto implícito
    setTimeout(() => setEditando(state.curso), 0);
  }

  function resetear() {
    setModo("elegir");
    setTexto("");
    setArchivoNombre("");
    setEditando(null);
    // Forzar que el form action resetea state de server action
    window.location.reload();
  }

  async function handleGuardar() {
    if (!editando) return;
    const res = await guardarMateria({
      nombre: editando.nombre,
      descripcion: editando.descripcion,
      color: "#6366f1",
      plan_estudios: editando.plan_estudios,
    });

    if (res.ok) {
      alert("✅ Materia guardada correctamente");
      resetear();
    } else {
      alert(`❌ Error: ${res.error}`);
    }
  }

  // ------- RENDER -------

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-900">Carga rápida</h1>
      <p className="mt-1 text-sm text-gray-500">
        Crea una materia a partir del programa académico o una plantilla
      </p>

      {/* Navegación de pasos */}
      {modo !== "elegir" && (
        <button
          onClick={resetear}
          className="mt-4 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900"
        >
          <ChevronLeft size={16} />
          Volver
        </button>
      )}

      <div className="mt-6">
        {modo === "elegir" && <PantallaElegir onElegir={setModo} />}
        {modo === "plantilla" && <PantallaPlantilla />}
        {modo === "pegar" && (
          <PantallaPegar
            texto={texto}
            setTexto={setTexto}
            archivoNombre={archivoNombre}
            setArchivoNombre={setArchivoNombre}
            fileRef={fileRef}
            state={state}
            formAction={formAction}
            isPending={isPending}
          />
        )}
        {modo === "archivo" && (
          <PantallaArchivo
            texto={texto}
            setTexto={setTexto}
            archivoNombre={archivoNombre}
            setArchivoNombre={setArchivoNombre}
            fileRef={fileRef}
            state={state}
            formAction={formAction}
            isPending={isPending}
          />
        )}
      </div>

      {/* Vista previa / editor */}
      {editando && (
        <EditorPlan
          curso={editando}
          onChange={setEditando}
          onGuardar={handleGuardar}
        />
      )}

      {state.status === "error" && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {state.message}
        </div>
      )}
    </div>
  );
}

// ── Pantalla elegir modo ─────────────────────────────────────────────

function PantallaElegir({ onElegir }: { onElegir: (m: Modo) => void }) {
  const opciones: { id: Modo; icon: React.ReactNode; titulo: string; desc: string }[] = [
    {
      id: "plantilla",
      icon: <FileText size={24} />,
      titulo: "Usar plantilla",
      desc: "Completa un formulario guiado con los datos básicos de la materia",
    },
    {
      id: "pegar",
      icon: <ClipboardPaste size={24} />,
      titulo: "Pegar programa académico",
      desc: "Pega el contenido del programa y la IA lo estructurará automáticamente",
    },
    {
      id: "archivo",
      icon: <Upload size={24} />,
      titulo: "Subir archivo",
      desc: "Sube un archivo .txt, .docx o .pdf con el programa",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {opciones.map((op) => (
        <button
          key={op.id}
          onClick={() => onElegir(op.id)}
          className="flex flex-col items-center gap-3 rounded-xl border-2 border-gray-200 bg-white p-6 text-center transition hover:border-[#0b1120] hover:shadow-md"
        >
          <div className="text-[#0b1120]">{op.icon}</div>
          <div>
            <p className="font-semibold text-gray-900">{op.titulo}</p>
            <p className="mt-1 text-xs text-gray-500">{op.desc}</p>
          </div>
        </button>
      ))}
    </div>
  );
}

// ── Pantalla Plantilla ────────────────────────────────────────────────

function PantallaPlantilla() {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [unidades, setUnidades] = useState([{ titulo: "", temas: [""] }]);
  const [guardando, setGuardando] = useState(false);

  function agregarUnidad() {
    setUnidades([...unidades, { titulo: "", temas: [""] }]);
  }

  function actualizarUnidad(idx: number, campo: "titulo", valor: string) {
    const copy = [...unidades];
    copy[idx] = { ...copy[idx], [campo]: valor };
    setUnidades(copy);
  }

  function agregarTema(idxUnidad: number) {
    const copy = [...unidades];
    copy[idxUnidad].temas.push("");
    setUnidades(copy);
  }

  function actualizarTema(idxUnidad: number, idxTema: number, valor: string) {
    const copy = [...unidades];
    copy[idxUnidad].temas[idxTema] = valor;
    setUnidades(copy);
  }

  function eliminarTema(idxUnidad: number, idxTema: number) {
    const copy = [...unidades];
    copy[idxUnidad].temas.splice(idxTema, 1);
    setUnidades(copy);
  }

  async function guardar() {
    if (!nombre.trim()) return;
    setGuardando(true);
    const res = await guardarMateria({
      nombre,
      descripcion,
      color: "#6366f1",
      plan_estudios: unidades.map((u, i) => ({
        unidad: i + 1,
        titulo: u.titulo,
        temas: u.temas.filter(Boolean),
        semanas: 2,
        actividades_sugeridas: [],
      })),
    });
    if (res.ok) {
      alert("✅ Materia guardada");
      window.location.reload();
    } else {
      alert(`❌ Error: ${res.error}`);
    }
    setGuardando(false);
  }

  return (
    <div className="space-y-6 rounded-xl border bg-white p-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Nombre de la materia *
        </label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#0b1120] focus:outline-none focus:ring-1 focus:ring-[#0b1120]"
          placeholder="Ej: Diseño de Moda I"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Descripción
        </label>
        <textarea
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          rows={3}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#0b1120] focus:outline-none focus:ring-1 focus:ring-[#0b1120]"
          placeholder="Descripción breve de la materia"
        />
      </div>

      <div>
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700">
            Unidades y temas
          </label>
          <button
            type="button"
            onClick={agregarUnidad}
            className="inline-flex items-center gap-1 text-sm text-[#0b1120] hover:text-gray-900"
          >
            <Plus size={16} />
            Agregar unidad
          </button>
        </div>

        <div className="mt-2 space-y-4">
          {unidades.map((u, i) => (
            <div key={i} className="rounded-lg border border-gray-200 p-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-gray-400">
                  U{i + 1}
                </span>
                <input
                  type="text"
                  value={u.titulo}
                  onChange={(e) => actualizarUnidad(i, "titulo", e.target.value)}
                  className="flex-1 rounded border-0 px-1 py-1 text-sm font-medium text-gray-900 focus:outline-none focus:ring-0"
                  placeholder="Título de la unidad"
                />
              </div>
              <div className="mt-2 space-y-1 pl-5">
                {u.temas.map((t, j) => (
                  <div key={j} className="flex items-center gap-1">
                    <span className="text-xs text-gray-400">•</span>
                    <input
                      type="text"
                      value={t}
                      onChange={(e) =>
                        actualizarTema(i, j, e.target.value)
                      }
                      className="flex-1 rounded border-0 px-1 py-0.5 text-sm text-gray-600 focus:outline-none focus:ring-0"
                      placeholder="Tema"
                    />
                    <button
                      type="button"
                      onClick={() => eliminarTema(i, j)}
                      className="text-gray-300 hover:text-red-500"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => agregarTema(i)}
                  className="mt-1 text-xs text-gray-400 hover:text-gray-700"
                >
                  + Agregar tema
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={guardar}
          disabled={!nombre.trim() || guardando}
          className="inline-flex items-center gap-2 rounded-lg bg-[#0b1120] px-6 py-2 text-sm font-medium text-white transition hover:bg-[#1a2235] disabled:opacity-50"
        >
          {guardando ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Check size={16} />
          )}
          Guardar materia
        </button>
      </div>
    </div>
  );
}

// ── Pantalla Pegar texto ──────────────────────────────────────────────

function PantallaPegar({
  texto,
  setTexto,
  state,
  formAction,
  isPending,
}: {
  texto: string;
  setTexto: (v: string) => void;
  archivoNombre: string;
  setArchivoNombre: (v: string) => void;
  fileRef: React.RefObject<HTMLInputElement | null>;
  state: CargaRapidaState;
  formAction: (payload: FormData) => void;
  isPending: boolean;
}) {
  return (
    <div className="space-y-4 rounded-xl border bg-white p-6">
      <form action={formAction}>
        <label className="block text-sm font-medium text-gray-700">
          Programa académico
        </label>
        <textarea
          name="texto"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          rows={10}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#0b1120] focus:outline-none focus:ring-1 focus:ring-[#0b1120]"
          placeholder={`Pega aquí el contenido del programa académico...

Ejemplo:
"DISEÑO DE MODA I — 3er Semestre
Objetivo: Introducir al estudiante en los principios básicos del diseño de moda...

Unidad 1: Fundamentos del Diseño
- Teoría del color aplicada
- Composición y silueta
- Proporción y equilibrio

Unidad 2: Técnicas de Ilustración
- Figura humana proporcional
- Movimiento y caída de telas..."`}
        />
        <button
          type="submit"
          disabled={isPending || texto.trim().length < 20}
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#0b1120] px-6 py-2 text-sm font-medium text-white transition hover:bg-[#1a2235] disabled:opacity-50"
        >
          {isPending ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Procesando…
            </>
          ) : (
            <>
              <ClipboardPaste size={16} />
              Procesar con IA
            </>
          )}
        </button>
      </form>
    </div>
  );
}

// ── Pantalla Subir archivo ────────────────────────────────────────────

function PantallaArchivo({
  texto,
  setTexto,
  archivoNombre,
  setArchivoNombre,
  fileRef,
  state,
  formAction,
  isPending,
}: {
  texto: string;
  setTexto: (v: string) => void;
  archivoNombre: string;
  setArchivoNombre: (v: string) => void;
  fileRef: React.RefObject<HTMLInputElement | null>;
  state: CargaRapidaState;
  formAction: (payload: FormData) => void;
  isPending: boolean;
}) {
  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setArchivoNombre(file.name);

    // Solo texto plano por ahora
    if (file.type === "text/plain") {
      const text = await file.text();
      setTexto(text);
    } else {
      // Para .docx, .pdf — mostrar mensaje
      setTexto(
        `[Archivo: ${file.name}]\n\nNota: La extracción automática de ${file.type || "este formato"} requiere configuración adicional. Por ahora, copia y pega el contenido manualmente usando el modo "Pegar programa académico".`
      );
    }
  }

  return (
    <div className="space-y-4 rounded-xl border bg-white p-6">
      <div className="flex flex-col items-center gap-4 rounded-lg border-2 border-dashed border-gray-300 p-8">
        <Upload size={32} className="text-gray-400" />
        <div className="text-center">
          <p className="text-sm font-medium text-gray-700">
            {archivoNombre || "Selecciona un archivo"}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            .txt, .docx o .pdf
          </p>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept=".txt,.docx,.pdf"
          onChange={handleFile}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          Elegir archivo
        </button>
      </div>

      {texto && (
        <form action={formAction}>
          <input type="hidden" name="texto" value={texto} />
          <div className="mt-2 max-h-40 overflow-y-auto rounded border bg-gray-50 p-3 text-xs text-gray-600">
            <pre className="whitespace-pre-wrap">{texto.slice(0, 1000)}</pre>
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#0b1120] px-6 py-2 text-sm font-medium text-white transition hover:bg-[#1a2235] disabled:opacity-50"
          >
            {isPending ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Procesando…
              </>
            ) : (
              <>
                <Upload size={16} />
                Procesar con IA
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}

// ── Editor del plan de estudios ──────────────────────────────────────

function EditorPlan({
  curso,
  onChange,
  onGuardar,
}: {
  curso: CursoGenerado;
  onChange: (c: CursoGenerado) => void;
  onGuardar: () => void;
}) {
  const [guardando, setGuardando] = useState(false);

  function actualizarCampo<K extends keyof CursoGenerado>(
    campo: K,
    valor: CursoGenerado[K]
  ) {
    onChange({ ...curso, [campo]: valor });
  }

  function actualizarUnidad(
    idx: number,
    campo: 'unidad' | 'titulo' | 'temas' | 'semanas' | 'actividades_sugeridas',
    valor: any
  ) {
    const plan = [...curso.plan_estudios];
    plan[idx] = { ...plan[idx], [campo]: valor };
    onChange({ ...curso, plan_estudios: plan });
  }

  function agregarUnidad() {
    const plan = [...curso.plan_estudios];
    plan.push({
      unidad: plan.length + 1,
      titulo: "",
      temas: [""],
      semanas: 2,
      actividades_sugeridas: [],
    });
    onChange({ ...curso, plan_estudios: plan });
  }

  function eliminarUnidad(idx: number) {
    const plan = curso.plan_estudios.filter((_, i) => i !== idx);
    onChange({ ...curso, plan_estudios: plan });
  }

  function agregarTema(idxUnidad: number) {
    const plan = [...curso.plan_estudios];
    plan[idxUnidad].temas.push("");
    onChange({ ...curso, plan_estudios: plan });
  }

  function actualizarTema(idxUnidad: number, idxTema: number, valor: string) {
    const plan = [...curso.plan_estudios];
    plan[idxUnidad].temas[idxTema] = valor;
    onChange({ ...curso, plan_estudios: plan });
  }

  function eliminarTema(idxUnidad: number, idxTema: number) {
    const plan = [...curso.plan_estudios];
    plan[idxUnidad].temas.splice(idxTema, 1);
    onChange({ ...curso, plan_estudios: plan });
  }

  async function handleGuardar() {
    setGuardando(true);
    await onGuardar();
    setGuardando(false);
  }

  return (
    <div className="mt-8 space-y-6 rounded-xl border bg-white p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          Revisar y editar
        </h2>
        <button
          onClick={handleGuardar}
          disabled={!curso.nombre.trim() || guardando}
          className="inline-flex items-center gap-2 rounded-lg bg-[#0b1120] px-6 py-2 text-sm font-medium text-white transition hover:bg-[#1a2235] disabled:opacity-50"
        >
          {guardando ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Check size={16} />
          )}
          Guardar materia
        </button>
      </div>

      {/* Nombre */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Nombre de la materia
        </label>
        <input
          type="text"
          value={curso.nombre}
          onChange={(e) => actualizarCampo("nombre", e.target.value)}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium focus:border-[#0b1120] focus:outline-none focus:ring-1 focus:ring-[#0b1120]"
        />
      </div>

      {/* Descripción */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Descripción
        </label>
        <textarea
          value={curso.descripcion}
          onChange={(e) => actualizarCampo("descripcion", e.target.value)}
          rows={2}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#0b1120] focus:outline-none focus:ring-1 focus:ring-[#0b1120]"
        />
      </div>

      {/* Plan de estudios */}
      <div>
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700">
            Plan de estudios ({curso.plan_estudios.length} unidades)
          </label>
          <button
            type="button"
            onClick={agregarUnidad}
            className="inline-flex items-center gap-1 text-sm text-[#0b1120] hover:text-gray-900"
          >
            <Plus size={16} />
            Agregar unidad
          </button>
        </div>

        <div className="mt-3 space-y-4">
          {curso.plan_estudios.map((unidad, i) => (
            <div
              key={i}
              className="rounded-lg border border-gray-200 p-4 transition hover:border-gray-300"
            >
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0b1120] text-xs font-medium text-white">
                  {i + 1}
                </span>
                <input
                  type="text"
                  value={unidad.titulo}
                  onChange={(e) => actualizarUnidad(i, "titulo", e.target.value)}
                  className="flex-1 rounded border-0 px-1 py-1 text-sm font-medium text-gray-900 focus:outline-none focus:ring-0"
                  placeholder="Título de la unidad"
                />
                <div className="flex items-center gap-1">
                  <span className="text-xs text-gray-400">Sem:</span>
                  <input
                    type="number"
                    min={1}
                    max={8}
                    value={unidad.semanas}
                    onChange={(e) =>
                      actualizarUnidad(i, "semanas", parseInt(e.target.value) || 1)
                    }
                    className="w-12 rounded border border-gray-200 px-1 py-0.5 text-center text-xs focus:border-[#0b1120] focus:outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => eliminarUnidad(i)}
                  className="text-gray-300 hover:text-red-500"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              {/* Temas */}
              <div className="mt-3 space-y-1 pl-8">
                {unidad.temas.map((tema, j) => (
                  <div key={j} className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">•</span>
                    <input
                      type="text"
                      value={tema}
                      onChange={(e) => actualizarTema(i, j, e.target.value)}
                      className="flex-1 rounded border-0 px-1 py-0.5 text-sm text-gray-600 focus:outline-none focus:ring-0"
                      placeholder="Tema"
                    />
                    <button
                      type="button"
                      onClick={() => eliminarTema(i, j)}
                      className="text-gray-300 hover:text-red-500"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => agregarTema(i)}
                  className="mt-1 text-xs text-gray-400 hover:text-gray-700"
                >
                  + Agregar tema
                </button>
              </div>

              {/* Actividades sugeridas */}
              {unidad.actividades_sugeridas.length > 0 && (
                <div className="mt-3 border-t border-gray-100 pt-2 pl-8">
                  <p className="text-xs font-medium text-gray-500">
                    Actividades sugeridas:
                  </p>
                  <ul className="mt-1 list-inside list-disc text-xs text-gray-500">
                    {unidad.actividades_sugeridas.map((act, j) => (
                      <li key={j}>{act}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
