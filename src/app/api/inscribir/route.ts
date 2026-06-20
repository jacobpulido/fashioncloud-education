import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const materiaId = searchParams.get("materia_id");
  const token = searchParams.get("token");

  if (!materiaId || !token) {
    return NextResponse.json({ error: "Faltan parámetros" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    // Redirect to register with materia in params
    return NextResponse.redirect(
      new URL(`/registro?materia=${materiaId}&token=${token}`, req.url)
    );
  }

  // Check if the materia exists and the token is valid
  const { data: materia } = await supabase
    .from("materias_carga")
    .select("id, institucion_id")
    .eq("id", materiaId)
    .single();

  if (!materia) {
    return NextResponse.json({ error: "Materia no encontrada" }, { status: 404 });
  }

  // Auto-enroll the user
  const { error } = await supabase.from("inscripciones_carga").upsert({
    materia_id: materiaId,
    alumno_id: user.id,
  }, { onConflict: "materia_id, alumno_id" });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.redirect(new URL("/alumno/pendientes", req.url));
}
