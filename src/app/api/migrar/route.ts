// Endpoint temporal: aplica la migración de materias
// Uso: GET /api/migrar?token=fc-educ-2026-06

import { NextResponse } from "next/server";

const TOKEN = process.env.MIGRATION_TOKEN || "fc-educ-2026-06";

// SQL para crear la función exec_sql (necesaria para migraciones vía REST)
const CREATE_EXEC_SQL = `
CREATE OR REPLACE FUNCTION public.exec_sql(sql text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $func$ BEGIN EXECUTE sql; END; $func$;
`;

const MIGRATION_SQL = [
  `CREATE TABLE IF NOT EXISTS public.materias (
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
  )`,
  `CREATE INDEX IF NOT EXISTS ix_materias_docente ON public.materias(docente_id)`,
  `CREATE OR REPLACE FUNCTION public.tg_updated_at()
    RETURNS trigger LANGUAGE plpgsql AS $$
    BEGIN NEW.updated_at = now(); RETURN NEW; END; $$`,
  `DROP TRIGGER IF EXISTS touch_materias ON public.materias`,
  `CREATE TRIGGER touch_materias BEFORE UPDATE ON public.materias
    FOR EACH ROW EXECUTE FUNCTION public.tg_updated_at()`,
  `ALTER TABLE public.materias ENABLE ROW LEVEL SECURITY`,
  `DROP POLICY IF EXISTS materias_docente_select ON public.materias`,
  `CREATE POLICY materias_docente_select ON public.materias
    FOR SELECT USING (docente_id = auth.uid())`,
  `DROP POLICY IF EXISTS materias_docente_insert ON public.materias`,
  `CREATE POLICY materias_docente_insert ON public.materias
    FOR INSERT WITH CHECK (docente_id = auth.uid())`,
  `DROP POLICY IF EXISTS materias_docente_update ON public.materias`,
  `CREATE POLICY materias_docente_update ON public.materias
    FOR UPDATE USING (docente_id = auth.uid())`,
  `DROP POLICY IF EXISTS materias_docente_delete ON public.materias`,
  `CREATE POLICY materias_docente_delete ON public.materias
    FOR DELETE USING (docente_id = auth.uid())`,
  `GRANT ALL ON public.materias TO authenticated`,
  `GRANT ALL ON public.materias TO service_role`,
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (token !== TOKEN) {
    return NextResponse.json({ error: "Token inválido" }, { status: 401 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    return NextResponse.json(
      { error: "SUPABASE_SERVICE_ROLE_KEY no configurada" },
      { status: 500 }
    );
  }

  const headers = {
    "Content-Type": "application/json",
    apikey: key,
    Authorization: `Bearer ${key}`,
  };

  const results: any[] = [];

  async function runSql(sql: string, label: string): Promise<boolean> {
    try {
      const res = await fetch(`${url}/rest/v1/rpc/exec_sql`, {
        method: "POST",
        headers,
        body: JSON.stringify({ sql }),
      });
      const ok = res.ok;
      const text = ok ? "OK" : await res.text().then((t) => t.substring(0, 200));
      results.push({ step: label, ok, message: text });
      return ok;
    } catch (e: any) {
      results.push({ step: label, ok: false, message: e.message });
      return false;
    }
  }

  // 1. Try to create exec_sql (might fail if DDL isn't allowed via REST)
  await runSql(CREATE_EXEC_SQL, "create_exec_sql");

  // 2. Run migration statements
  for (const stmt of MIGRATION_SQL) {
    await runSql(stmt, stmt.substring(0, 70));
  }

  // 3. Verify
  let tableExists = false;
  try {
    const check = await fetch(`${url}/rest/v1/materias?select=id&limit=1`, { headers });
    tableExists = check.ok;
  } catch {}
  results.push({ step: "verification", table_exists: tableExists });

  return NextResponse.json({
    success: tableExists,
    results,
    note: "Si exec_sql falla: abre el SQL Editor en https://supabase.com/dashboard/project/wpkywjwrcxnmjjmmbwuv/sql/new y pega el contenido de src/lib/actions/carga-rapida.sql",
  });
}
