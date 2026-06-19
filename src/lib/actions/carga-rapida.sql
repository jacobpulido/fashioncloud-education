-- ── Tabla: materias ────────────────────────────────────────────
-- Tabla simple para el MVP de Carga Rápida
-- Funciona con Supabase Auth (docente_id → auth.users)

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

-- Índices
CREATE INDEX IF NOT EXISTS ix_materias_docente
  ON public.materias(docente_id);

-- Trigger updated_at
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

-- Row Level Security
ALTER TABLE public.materias ENABLE ROW LEVEL SECURITY;

-- Política: docentes solo ven sus propias materias
CREATE POLICY materias_docente_select ON public.materias
  FOR SELECT
  USING (docente_id = auth.uid());

CREATE POLICY materias_docente_insert ON public.materias
  FOR INSERT
  WITH CHECK (docente_id = auth.uid());

CREATE POLICY materias_docente_update ON public.materias
  FOR UPDATE
  USING (docente_id = auth.uid());

CREATE POLICY materias_docente_delete ON public.materias
  FOR DELETE
  USING (docente_id = auth.uid());

-- Dar permisos
GRANT ALL ON public.materias TO authenticated;
GRANT ALL ON public.materias TO service_role;
