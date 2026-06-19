"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type ActividadData = {
  materia_id: string;
  titulo: string;
  descripcion: string;
  tipo: "tarea" | "proyecto" | "investigacion" | "presentacion";
  fecha_limite: string | null;
  valor: number;
  instrucciones: string;
};

export async function listarActividades(materiaId?: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  let query = supabase
    .from("actividades_carga")
    .select("id, titulo, tipo, estado, fecha_limite, valor, materia_id, created_at")
    .eq("docente_id", user.id)
    .order("created_at", { ascending: false });

  if (materiaId) query = query.eq("materia_id", materiaId);

  const { data } = await query;
  return data ?? [];
}

export async function crearActividad(data: ActividadData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "No autenticado" };

  const { error } = await supabase.from("actividades_carga").insert({
    materia_id: data.materia_id,
    docente_id: user.id,
    titulo: data.titulo,
    descripcion: data.descripcion,
    tipo: data.tipo,
    fecha_limite: data.fecha_limite || null,
    valor: data.valor,
    instrucciones: data.instrucciones,
    estado: "borrador",
  });

  if (error) return { ok: false, error: error.message };
  revalidatePath("/docente/actividades");
  return { ok: true };
}

export async function publicarActividad(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("actividades_carga")
    .update({ estado: "publicada", updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/docente/actividades");
  return { ok: true };
}

export async function cerrarActividad(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("actividades_carga")
    .update({ estado: "cerrada", updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/docente/actividades");
  return { ok: true };
}

export async function eliminarActividad(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("actividades_carga").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/docente/actividades");
  return { ok: true };
}

export async function getActividad(id: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("actividades_carga")
    .select("*, materias_carga!inner(nombre)")
    .eq("id", id)
    .single();
  return data;
}
