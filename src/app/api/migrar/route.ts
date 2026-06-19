// Endpoint temporal para aplicar la migración de la tabla materias
// Solo accesible con un token de seguridad único
// Uso: GET /api/migrar?token=<TOKEN>

import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const MIGRATION_TOKEN = process.env.MIGRATION_TOKEN || "fc-educ-2026-06";
const SQL = `
-- ── Tabla: materias ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.materias (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  docente_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre text NOT NULL,
  descripcion text DEFAULT '',
  color text DEFAULT '#6366f1',
  plan_estudios jsonb NOT NULL DEFAULT '[]'::jsonb,
  estado text NOT NULL DEFAULT 'borrador'
    CHECK (estado IN ('borrador', 'activa', 'archivada')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS ix_materias_docente
  ON public.materias(docente_id);

CREATE OR REPLACE FUNCTION public.tg_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS touch_materias ON public.materias;
CREATE TRIGGER touch_materias
  BEFORE UPDATE ON public.materias
  FOR EACH ROW EXECUTE FUNCTION public.tg_updated_at();

ALTER TABLE public.materias ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS materias_docente_select ON public.materias;
CREATE POLICY materias_docente_select ON public.materias
  FOR SELECT USING (docente_id = auth.uid());

DROP POLICY IF EXISTS materias_docente_insert ON public.materias;
CREATE POLICY materias_docente_insert ON public.materias
  FOR INSERT WITH CHECK (docente_id = auth.uid());

DROP POLICY IF EXISTS materias_docente_update ON public.materias;
CREATE POLICY materias_docente_update ON public.materias
  FOR UPDATE USING (docente_id = auth.uid());

DROP POLICY IF EXISTS materias_docente_delete ON public.materias;
CREATE POLICY materias_docente_delete ON public.materias
  FOR DELETE USING (docente_id = auth.uid());

GRANT ALL ON public.materias TO authenticated;
GRANT ALL ON public.materias TO service_role;
`;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (token !== MIGRATION_TOKEN) {
    return NextResponse.json({ error: "Token inválido" }, { status: 401 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    return NextResponse.json(
      {
        error:
          "SUPABASE_SERVICE_ROLE_KEY no configurada. Agrega esta variable en Vercel desde: Project Settings > Environment Variables",
      },
      { status: 500 }
    );
  }

  try {
    const admin = createClient(url, key, {
      auth: { persistSession: false },
    });

    // Ejecutar cada statement por separado
    const statements = SQL
      .split(";")
      .map((s) => s.trim())
      .filter((s) => s.length > 5 && !s.startsWith("--"));

    const results: { sql: string; ok: boolean; error?: string }[] = [];

    for (const stmt of statements) {
      try {
        const { error } = await admin.rpc("exec_sql", { sql: stmt });
        if (error) {
          // Fallback: raw SQL query
          const res = await fetch(`${url}/rest/v1/rpc/`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              apikey: key,
              Authorization: `Bearer ${key}`,
            },
            body: JSON.stringify({}),
          });
          results.push({
            sql: stmt.substring(0, 80),
            ok: false,
            error: error.message,
          });
        } else {
          results.push({ sql: stmt.substring(0, 80), ok: true });
        }
      } catch (e: any) {
        results.push({
          sql: stmt.substring(0, 80),
          ok: false,
          error: e.message,
        });
      }
    }

    const allOk = results.every((r) => r.ok);

    return NextResponse.json({
      success: allOk,
      results,
      note: "Endpoint temporal — eliminar después de migrar",
    });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
