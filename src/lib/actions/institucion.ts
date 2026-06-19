"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getInstituciones() {
  const supabase = await createClient();
  const { data } = await supabase.from("instituciones").select("id, nombre, slug").eq("activa", true).order("nombre");
  return data ?? [];
}

export async function getMiembroContext() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("miembros_institucion")
    .select("id, rol, institucion_id, instituciones!inner(nombre, slug)")
    .eq("usuario_id", user.id);

  // Return first match (prefer admin/coordinador)
  if (!data || data.length === 0) return null;
  const roles = data as any[];
  return roles.find(r => ["admin_plantel", "coordinador"].includes(r.rol)) || roles[0];
}

export async function listMiembros(institucionId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("miembros_institucion")
    .select("id, usuario_id, rol, created_at")
    .eq("institucion_id", institucionId)
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function actualizarRol(miembroId: string, nuevoRol: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("miembros_institucion")
    .update({ rol: nuevoRol })
    .eq("id", miembroId);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/miembros");
  return { ok: true };
}

export async function getStatsAdmin(institucionId: string) {
  const supabase = await createClient();
  const [{ count: docentes }, { count: alumnos }, { count: materias }, { count: actividades }] = await Promise.all([
    supabase.from("miembros_institucion").select("id", { count: "exact", head: true }).eq("institucion_id", institucionId).eq("rol", "docente"),
    supabase.from("miembros_institucion").select("id", { count: "exact", head: true }).eq("institucion_id", institucionId).eq("rol", "alumno"),
    supabase.from("materias_carga").select("id", { count: "exact", head: true }).eq("institucion_id", institucionId),
    supabase.from("actividades_carga").select("id", { count: "exact", head: true }).eq("institucion_id", institucionId),
  ]);
  return { docentes: docentes ?? 0, alumnos: alumnos ?? 0, materias: materias ?? 0, actividades: actividades ?? 0 };
}
