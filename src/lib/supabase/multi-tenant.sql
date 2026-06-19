-- Multi-tenant migration — 19 Jun 2026
-- Agrega soporte de instituciones y roles jerárquicos

-- 1. Instituciones
CREATE TABLE IF NOT EXISTS public.instituciones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  slug text NOT NULL UNIQUE,
  logo_url text,
  config jsonb NOT NULL DEFAULT '{}'::jsonb,
  activa boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.instituciones ENABLE ROW LEVEL SECURITY;

-- 2. Miembros (roles multi-tenant)
CREATE TABLE IF NOT EXISTS public.miembros_institucion (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  institucion_id uuid NOT NULL REFERENCES public.instituciones(id) ON DELETE CASCADE,
  usuario_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rol text NOT NULL CHECK (rol IN ('admin_plantel','coordinador','docente','alumno')),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (institucion_id, usuario_id)
);
CREATE INDEX ix_miembros_usuario ON public.miembros_institucion(usuario_id);
CREATE INDEX ix_miembros_institucion ON public.miembros_institucion(institucion_id);
ALTER TABLE public.miembros_institucion ENABLE ROW LEVEL SECURITY;

-- 3. institucion_id en tablas existentes
ALTER TABLE public.materias_carga ADD COLUMN IF NOT EXISTS institucion_id uuid REFERENCES public.instituciones(id);
ALTER TABLE public.actividades_carga ADD COLUMN IF NOT EXISTS institucion_id uuid REFERENCES public.instituciones(id);
ALTER TABLE public.inscripciones_carga ADD COLUMN IF NOT EXISTS institucion_id uuid REFERENCES public.instituciones(id);
ALTER TABLE public.entregas_carga ADD COLUMN IF NOT EXISTS institucion_id uuid REFERENCES public.instituciones(id);

-- 4. RLS policies
CREATE POLICY instituciones_select ON public.instituciones FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY miembros_select_self ON public.miembros_institucion FOR SELECT USING (usuario_id = auth.uid());
CREATE POLICY miembros_select_admin ON public.miembros_institucion FOR SELECT USING (EXISTS (SELECT 1 FROM public.miembros_institucion WHERE usuario_id = auth.uid() AND rol IN ('admin_plantel','coordinador') AND institucion_id = miembros_institucion.institucion_id));
CREATE POLICY miembros_insert_admin ON public.miembros_institucion FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.miembros_institucion WHERE usuario_id = auth.uid() AND rol = 'admin_plantel' AND institucion_id = miembros_institucion.institucion_id));

GRANT ALL ON public.instituciones TO authenticated;
GRANT ALL ON public.miembros_institucion TO authenticated;
