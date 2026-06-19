import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const actividadId = searchParams.get("actividad_id");
  if (!actividadId) return NextResponse.json({ error: "actividad_id required" }, { status: 400 });

  const supabase = await createClient();
  const { data } = await supabase
    .from("entregas_carga")
    .select("id, alumno_id, contenido, estado, nota, retroalimentacion, created_at, updated_at")
    .eq("actividad_id", actividadId);
  return NextResponse.json(data ?? []);
}
