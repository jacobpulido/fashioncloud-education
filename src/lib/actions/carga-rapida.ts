"use server";

import { createClient } from "@/lib/supabase/server";
import { generarPlanEstudios, type CursoGenerado } from "@/lib/deepseek";
import { revalidatePath } from "next/cache";

export type CargaRapidaState =
  | { status: "idle" }
  | { status: "processing" }
  | { status: "preview"; curso: CursoGenerado }
  | { status: "error"; message: string };

export async function procesarConIA(
  prev: CargaRapidaState,
  formData: FormData
): Promise<CargaRapidaState> {
  const texto = formData.get("texto") as string;

  if (!texto || texto.trim().length < 20) {
    return {
      status: "error",
      message: "El texto debe tener al menos 20 caracteres.",
    };
  }

  try {
    const curso = await generarPlanEstudios(texto);
    return { status: "preview", curso };
  } catch (e: any) {
    return { status: "error", message: e.message };
  }
}

export interface MateriaData {
  nombre: string;
  descripcion: string;
  color: string;
  plan_estudios: any[];
}

export async function guardarMateria(data: MateriaData): Promise<{ ok: boolean; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { ok: false, error: "No autenticado" };

  const { error } = await supabase.from("materias").insert({
    docente_id: user.id,
    nombre: data.nombre,
    descripcion: data.descripcion,
    color: data.color,
    plan_estudios: data.plan_estudios,
    estado: "borrador",
  });

  if (error) return { ok: false, error: error.message };

  revalidatePath("/docente/materias");
  revalidatePath("/docente/dashboard");

  return { ok: true };
}

export async function listarMaterias() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("materias")
    .select("id, nombre, descripcion, color, estado, created_at")
    .eq("docente_id", user.id)
    .order("created_at", { ascending: false });

  return data ?? [];
}
