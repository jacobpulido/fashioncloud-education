import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json([]);

  const { data } = await supabase
    .from("materias_carga")
    .select("id, nombre")
    .eq("docente_id", user.id)
    .order("nombre");

  return NextResponse.json(data ?? []);
}
