-- ============================================================================
-- FashionCloud Education — Esquema de base de datos (PostgreSQL 16+)
-- Núcleo central (core) + Módulos MVP (academico)
-- ============================================================================

-- Extensiones
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "citext";

-- Esquemas
CREATE SCHEMA IF NOT EXISTS core;
CREATE SCHEMA IF NOT EXISTS academico;

-- Helpers de contexto de sesión (RLS)
CREATE OR REPLACE FUNCTION core.current_institucion() RETURNS uuid
LANGUAGE sql STABLE AS $$
 SELECT NULLIF(current_setting('app.current_institucion', true), '')::uuid
$$;

CREATE OR REPLACE FUNCTION core.current_usuario() RETURNS uuid
LANGUAGE sql STABLE AS $$
 SELECT NULLIF(current_setting('app.current_usuario', true), '')::uuid
$$;

CREATE OR REPLACE FUNCTION core.set_contexto(p_institucion uuid, p_usuario uuid DEFAULT NULL)
RETURNS void LANGUAGE sql AS $$
 SELECT set_config('app.current_institucion', p_institucion::text, false),
        set_config('app.current_usuario', COALESCE(p_usuario::text, ''), false);
$$;

-- Trigger genérico para updated_at
CREATE OR REPLACE FUNCTION core.tg_touch_updated_at() RETURNS trigger
LANGUAGE plpgsql AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END $$;

-- ===========================================================================
-- NÚCLEO CENTRAL (core)
-- ===========================================================================

-- Instituciones (tenants)
CREATE TABLE core.instituciones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  slug citext NOT NULL UNIQUE,
  logo_url text,
  config jsonb NOT NULL DEFAULT '{}'::jsonb,
  activa boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Usuarios — identidad única
CREATE TABLE core.usuarios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  institucion_id uuid NOT NULL REFERENCES core.instituciones(id) ON DELETE RESTRICT,
  email citext NOT NULL,
  password_hash text NOT NULL,
  nombre text NOT NULL,
  apellidos text NOT NULL DEFAULT '',
  avatar_url text,
  telefono text,
  mfa_habilitado boolean NOT NULL DEFAULT false,
  mfa_secret text,
  estado text NOT NULL DEFAULT 'activo' CHECK (estado IN ('activo','suspendido','invitado')),
  ultimo_acceso timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz,
  UNIQUE (institucion_id, email)
);
CREATE INDEX ix_usuarios_inst ON core.usuarios(institucion_id) WHERE deleted_at IS NULL;
CREATE TRIGGER touch_usuarios BEFORE UPDATE ON core.usuarios
  FOR EACH ROW EXECUTE FUNCTION core.tg_touch_updated_at();

-- Roles y permisos (RBAC)
CREATE TABLE core.roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clave text NOT NULL UNIQUE CHECK (clave IN ('admin','docente','alumno')),
  nombre text NOT NULL,
  descripcion text
);

CREATE TABLE core.permisos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clave text NOT NULL UNIQUE,
  nombre text NOT NULL
);

CREATE TABLE core.rol_permisos (
  rol_id uuid NOT NULL REFERENCES core.roles(id) ON DELETE CASCADE,
  permiso_id uuid NOT NULL REFERENCES core.permisos(id) ON DELETE CASCADE,
  PRIMARY KEY (rol_id, permiso_id)
);

CREATE TABLE core.usuario_roles (
  usuario_id uuid NOT NULL REFERENCES core.usuarios(id) ON DELETE CASCADE,
  rol_id uuid NOT NULL REFERENCES core.roles(id) ON DELETE RESTRICT,
  PRIMARY KEY (usuario_id, rol_id)
);

-- Sesiones (refresh tokens revocables)
CREATE TABLE core.sesiones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id uuid NOT NULL REFERENCES core.usuarios(id) ON DELETE CASCADE,
  refresh_hash text NOT NULL,
  user_agent text,
  ip inet,
  expira_en timestamptz NOT NULL,
  revocada_en timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Periodos académicos
CREATE TABLE core.periodos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  institucion_id uuid NOT NULL REFERENCES core.instituciones(id) ON DELETE CASCADE,
  nombre text NOT NULL,
  fecha_inicio date NOT NULL,
  fecha_fin date NOT NULL,
  estado text NOT NULL DEFAULT 'activo' CHECK (estado IN ('planeado','activo','cerrado')),
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (fecha_fin >= fecha_inicio)
);

-- Grupos
CREATE TABLE core.grupos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  institucion_id uuid NOT NULL REFERENCES core.instituciones(id) ON DELETE CASCADE,
  nombre text NOT NULL,
  nivel text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (institucion_id, nombre)
);

CREATE TABLE core.grupo_alumnos (
  grupo_id uuid NOT NULL REFERENCES core.grupos(id) ON DELETE CASCADE,
  alumno_id uuid NOT NULL REFERENCES core.usuarios(id) ON DELETE CASCADE,
  PRIMARY KEY (grupo_id, alumno_id)
);

-- Materias
CREATE TABLE core.materias (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  institucion_id uuid NOT NULL REFERENCES core.instituciones(id) ON DELETE CASCADE,
  nombre text NOT NULL,
  periodo_id uuid NOT NULL REFERENCES core.periodos(id) ON DELETE RESTRICT,
  grupo_id uuid NOT NULL REFERENCES core.grupos(id) ON DELETE RESTRICT,
  docente_id uuid NOT NULL REFERENCES core.usuarios(id) ON DELETE RESTRICT,
  color text,
  ponderaciones_ok boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TYPE academico.tipo_actividad AS ENUM
  ('tarea','proyecto','evidencia_practica','investigacion','presentacion');

CREATE TABLE core.ponderaciones_materia (
  materia_id uuid NOT NULL REFERENCES core.materias(id) ON DELETE CASCADE,
  tipo academico.tipo_actividad NOT NULL,
  peso numeric(5,2) NOT NULL CHECK (peso >= 0 AND peso <= 100),
  PRIMARY KEY (materia_id, tipo)
);

CREATE OR REPLACE FUNCTION core.tg_valida_ponderaciones() RETURNS trigger
LANGUAGE plpgsql AS $$
DECLARE v_mat uuid; v_total numeric;
BEGIN
  v_mat := COALESCE(NEW.materia_id, OLD.materia_id);
  SELECT COALESCE(SUM(peso),0) INTO v_total
  FROM core.ponderaciones_materia WHERE materia_id = v_mat;
  UPDATE core.materias SET ponderaciones_ok = (v_total = 100) WHERE id = v_mat;
  RETURN NULL;
END $$;
CREATE TRIGGER ponderaciones_suma AFTER INSERT OR UPDATE OR DELETE ON core.ponderaciones_materia
  FOR EACH ROW EXECUTE FUNCTION core.tg_valida_ponderaciones();

-- Inscripciones
CREATE TABLE core.inscripciones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  materia_id uuid NOT NULL REFERENCES core.materias(id) ON DELETE CASCADE,
  alumno_id uuid NOT NULL REFERENCES core.usuarios(id) ON DELETE CASCADE,
  estado text NOT NULL DEFAULT 'activa' CHECK (estado IN ('activa','baja')),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (materia_id, alumno_id)
);

-- Historial académico (snapshot al cerrar periodo)
CREATE TABLE core.historial_academico (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  institucion_id uuid NOT NULL REFERENCES core.instituciones(id) ON DELETE CASCADE,
  alumno_id uuid NOT NULL REFERENCES core.usuarios(id) ON DELETE RESTRICT,
  materia_id uuid NOT NULL REFERENCES core.materias(id) ON DELETE RESTRICT,
  periodo_id uuid NOT NULL REFERENCES core.periodos(id) ON DELETE RESTRICT,
  calificacion_final numeric(5,2) NOT NULL,
  desglose jsonb NOT NULL DEFAULT '{}'::jsonb,
  cerrado_por uuid REFERENCES core.usuarios(id),
  cerrado_en timestamptz NOT NULL DEFAULT now(),
  UNIQUE (alumno_id, materia_id, periodo_id)
);

-- Auditoría (append-only)
CREATE TABLE core.auditoria (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  institucion_id uuid,
  usuario_id uuid,
  accion text NOT NULL,
  entidad text,
  entidad_id uuid,
  resultado text NOT NULL DEFAULT 'ok' CHECK (resultado IN ('ok','denegado','error')),
  ip inet,
  user_agent text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
REVOKE UPDATE, DELETE ON core.auditoria FROM PUBLIC;

-- ===========================================================================
-- MÓDULOS MVP (academico)
-- ===========================================================================

-- Actividades
CREATE TABLE academico.actividades (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  institucion_id uuid NOT NULL REFERENCES core.instituciones(id) ON DELETE CASCADE,
  materia_id uuid NOT NULL REFERENCES core.materias(id) ON DELETE CASCADE,
  tipo academico.tipo_actividad NOT NULL,
  titulo text NOT NULL,
  descripcion text NOT NULL DEFAULT '',
  fecha_limite timestamptz,
  valor numeric(5,2) NOT NULL DEFAULT 100 CHECK (valor > 0 AND valor <= 100),
  estado text NOT NULL DEFAULT 'borrador' CHECK (estado IN ('borrador','publicada','cerrada')),
  publicada_en timestamptz,
  creada_por uuid NOT NULL REFERENCES core.usuarios(id),
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE academico.actividad_adjuntos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actividad_id uuid NOT NULL REFERENCES academico.actividades(id) ON DELETE CASCADE,
  nombre text NOT NULL,
  storage_key text NOT NULL,
  mime text,
  tamano_bytes bigint,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Entregas
CREATE TABLE academico.entregas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  institucion_id uuid NOT NULL REFERENCES core.instituciones(id) ON DELETE CASCADE,
  actividad_id uuid NOT NULL REFERENCES academico.actividades(id) ON DELETE CASCADE,
  alumno_id uuid NOT NULL REFERENCES core.usuarios(id) ON DELETE CASCADE,
  version int NOT NULL DEFAULT 1,
  estado text NOT NULL DEFAULT 'borrador' CHECK (estado IN ('borrador','entregada','aprobada','correccion')),
  nota_alumno text,
  entregada_en timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (actividad_id, alumno_id)
);

CREATE TABLE academico.entrega_archivos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entrega_id uuid NOT NULL REFERENCES academico.entregas(id) ON DELETE CASCADE,
  tipo text NOT NULL CHECK (tipo IN ('pdf','imagen','video','zip','enlace')),
  storage_key text,
  url_externa text,
  nombre text NOT NULL,
  mime text,
  tamano_bytes bigint,
  thumbnail_key text,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (storage_key IS NOT NULL OR url_externa IS NOT NULL)
);

-- Retroalimentación
CREATE TABLE academico.retroalimentacion (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entrega_id uuid NOT NULL REFERENCES academico.entregas(id) ON DELETE CASCADE,
  docente_id uuid NOT NULL REFERENCES core.usuarios(id),
  decision text NOT NULL CHECK (decision IN ('aprobar','solicitar_correccion','comentar')),
  comentario text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Calificaciones
CREATE TABLE academico.calificaciones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entrega_id uuid NOT NULL UNIQUE REFERENCES academico.entregas(id) ON DELETE CASCADE,
  actividad_id uuid NOT NULL REFERENCES academico.actividades(id) ON DELETE CASCADE,
  alumno_id uuid NOT NULL REFERENCES core.usuarios(id) ON DELETE CASCADE,
  puntaje numeric(5,2) NOT NULL CHECK (puntaje >= 0 AND puntaje <= 100),
  rubrica jsonb,
  calificada_por uuid NOT NULL REFERENCES core.usuarios(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Motor de cálculo automático
CREATE OR REPLACE FUNCTION academico.calcular_calificacion(
  p_materia uuid, p_alumno uuid
) RETURNS TABLE (nota numeric, avance numeric)
LANGUAGE sql STABLE AS $$
  WITH por_tipo AS (
    SELECT a.tipo, AVG(c.puntaje) AS promedio_tipo
    FROM academico.actividades a
    JOIN academico.calificaciones c ON c.actividad_id = a.id AND c.alumno_id = p_alumno
    WHERE a.materia_id = p_materia AND a.estado = 'publicada'
    GROUP BY a.tipo
  ),
  ponderado AS (
    SELECT pm.tipo, pm.peso, pt.promedio_tipo
    FROM core.ponderaciones_materia pm
    JOIN por_tipo pt ON pt.tipo = pm.tipo
  )
  SELECT
    CASE WHEN SUM(peso) > 0
      THEN ROUND(SUM(promedio_tipo * (peso/100)) / (SUM(peso)/100), 2)
      ELSE NULL END AS nota,
    COALESCE(SUM(peso), 0) AS avance
  FROM ponderado;
$$;

-- ===========================================================================
-- ROW-LEVEL SECURITY (multi-tenant por institución)
-- ===========================================================================
DO $$ DECLARE t text; BEGIN
  FOREACH t IN ARRAY ARRAY[
    'core.usuarios','core.periodos','core.grupos','core.materias',
    'core.inscripciones','core.historial_academico',
    'academico.actividades','academico.entregas'
  ] LOOP
    EXECUTE format('ALTER TABLE %s ENABLE ROW LEVEL SECURITY;', t);
    EXECUTE format($f$ CREATE POLICY tenant_isolation ON %s
      USING (institucion_id = core.current_institucion())
      WITH CHECK (institucion_id = core.current_institucion()); $f$, t);
  END LOOP;
END $$;

-- ===========================================================================
-- CATÁLOGOS BASE
-- ===========================================================================
INSERT INTO core.roles (clave, nombre, descripcion) VALUES
  ('admin','Coordinador / Administrador','Gestión institucional y supervisión académica'),
  ('docente','Docente','Crea actividades, revisa y califica'),
  ('alumno','Alumno','Consulta, entrega evidencias y ve calificaciones')
ON CONFLICT (clave) DO NOTHING;

INSERT INTO core.permisos (clave, nombre) VALUES
  ('usuario:administrar','Administrar usuarios'),
  ('grupo:administrar','Administrar grupos'),
  ('materia:administrar','Administrar materias'),
  ('materia:ponderar','Configurar ponderaciones'),
  ('actividad:crear','Crear actividades'),
  ('actividad:publicar','Publicar actividades'),
  ('entrega:enviar','Enviar entregas'),
  ('entrega:evaluar','Evaluar entregas'),
  ('periodo:cerrar','Cerrar periodo'),
  ('dashboard:ver','Ver panel de coordinación')
ON CONFLICT (clave) DO NOTHING;

INSERT INTO core.rol_permisos (rol_id, permiso_id)
SELECT r.id, p.id FROM core.roles r, core.permisos p
WHERE (r.clave='admin')
  OR (r.clave='docente' AND p.clave IN ('actividad:crear','actividad:publicar','entrega:evaluar','materia:ponderar','periodo:cerrar'))
  OR (r.clave='alumno' AND p.clave IN ('entrega:enviar'))
ON CONFLICT DO NOTHING;
