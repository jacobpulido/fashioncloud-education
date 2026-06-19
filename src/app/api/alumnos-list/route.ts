import { listarAlumnos } from "@/lib/actions/usuarios";
import { NextResponse } from "next/server";

export async function GET() {
  const alumnos = await listarAlumnos();
  return NextResponse.json(alumnos);
}
