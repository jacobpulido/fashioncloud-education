"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function inscribirAlumno(materiaId: string, alumnoId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("inscripciones_carga").insert({
    materia_id: materiaId,
    alumno_id: alumnoId,
  });
  if (error) return { ok: false, error: error.message };
  revalidatePath("/docente/materias/" + materiaId);
  return { ok: true };
}

export async function desinscribirAlumno(materiaId: string, alumnoId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("inscripciones_carga")
    .delete()
    .eq("materia_id", materiaId)
    .eq("alumno_id", alumnoId);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/docente/materias/" + materiaId);
  return { ok: true };
}

export async function getInscritos(materiaId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("inscripciones_carga")
    .select("alumno_id")
    .eq("materia_id", materiaId);
  return data ?? [];
}

export async function getAlumnosDisponibles() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("auth.users")
    .select("id, email")
    .neq("id", user.id);
  return data ?? [];
}

export async function getEntregasPorActividad(actividadId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("entregas_carga")
    .select("id, alumno_id, estado, nota, created_at, updated_at")
    .eq("actividad_id", actividadId);
  return data ?? [];
}

export async function calificarEntrega(
  entregaId: string,
  nota: number,
  retroalimentacion: string
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("entregas_carga")
    .update({
      nota,
      retroalimentacion,
      estado: "calificada",
      updated_at: new Date().toISOString(),
    })
    .eq("id", entregaId);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/docente/actividades");
  return { ok: true };
}
