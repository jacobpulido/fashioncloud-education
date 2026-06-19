-- Tabla independiente para Carga Rápida
-- (no conflict with existing old-schema materias table)

CREATE TABLE IF NOT EXISTS public.materias_carga (
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

CREATE INDEX IF NOT EXISTS ix_materias_carga_docente ON public.materias_carga(docente_id);

CREATE OR REPLACE FUNCTION public.tg_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS touch_materias_carga ON public.materias_carga;
CREATE TRIGGER touch_materias_carga
  BEFORE UPDATE ON public.materias_carga
  FOR EACH ROW EXECUTE FUNCTION public.tg_updated_at();

ALTER TABLE public.materias_carga ENABLE ROW LEVEL SECURITY;

CREATE POLICY materias_carga_select ON public.materias_carga
  FOR SELECT USING (docente_id = auth.uid());
CREATE POLICY materias_carga_insert ON public.materias_carga
  FOR INSERT WITH CHECK (docente_id = auth.uid());
CREATE POLICY materias_carga_update ON public.materias_carga
  FOR UPDATE USING (docente_id = auth.uid());
CREATE POLICY materias_carga_delete ON public.materias_carga
  FOR DELETE USING (docente_id = auth.uid());

GRANT ALL ON public.materias_carga TO authenticated;
GRANT ALL ON public.materias_carga TO service_role;
