-- CreateTable
CREATE TABLE "instituciones" (
    "id" UUID NOT NULL,
    "nombre" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "logo_url" TEXT,
    "config" JSONB NOT NULL DEFAULT '{}',
    "activa" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "instituciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuarios" (
    "id" UUID NOT NULL,
    "institucion_id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellidos" TEXT NOT NULL DEFAULT '',
    "avatar_url" TEXT,
    "telefono" TEXT,
    "mfa_habilitado" BOOLEAN NOT NULL DEFAULT false,
    "mfa_secret" TEXT,
    "estado" TEXT NOT NULL DEFAULT 'activo',
    "ultimo_acceso" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" UUID NOT NULL,
    "clave" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permisos" (
    "id" UUID NOT NULL,
    "clave" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "permisos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rol_permisos" (
    "rol_id" UUID NOT NULL,
    "permiso_id" UUID NOT NULL,

    CONSTRAINT "rol_permisos_pkey" PRIMARY KEY ("rol_id","permiso_id")
);

-- CreateTable
CREATE TABLE "usuario_roles" (
    "usuario_id" UUID NOT NULL,
    "rol_id" UUID NOT NULL,

    CONSTRAINT "usuario_roles_pkey" PRIMARY KEY ("usuario_id","rol_id")
);

-- CreateTable
CREATE TABLE "sesiones" (
    "id" UUID NOT NULL,
    "usuario_id" UUID NOT NULL,
    "refresh_hash" TEXT NOT NULL,
    "user_agent" TEXT,
    "ip" TEXT,
    "expira_en" TIMESTAMPTZ NOT NULL,
    "revocada_en" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sesiones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "periodos" (
    "id" UUID NOT NULL,
    "institucion_id" UUID NOT NULL,
    "nombre" TEXT NOT NULL,
    "fecha_inicio" DATE NOT NULL,
    "fecha_fin" DATE NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'activo',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "periodos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "grupos" (
    "id" UUID NOT NULL,
    "institucion_id" UUID NOT NULL,
    "nombre" TEXT NOT NULL,
    "nivel" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "grupos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "grupo_alumnos" (
    "grupo_id" UUID NOT NULL,
    "alumno_id" UUID NOT NULL,

    CONSTRAINT "grupo_alumnos_pkey" PRIMARY KEY ("grupo_id","alumno_id")
);

-- CreateTable
CREATE TABLE "materias" (
    "id" UUID NOT NULL,
    "institucion_id" UUID NOT NULL,
    "nombre" TEXT NOT NULL,
    "periodo_id" UUID NOT NULL,
    "grupo_id" UUID NOT NULL,
    "docente_id" UUID NOT NULL,
    "color" TEXT,
    "ponderaciones_ok" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "materias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ponderaciones_materia" (
    "materia_id" UUID NOT NULL,
    "tipo" TEXT NOT NULL,
    "peso" DECIMAL(5,2) NOT NULL,

    CONSTRAINT "ponderaciones_materia_pkey" PRIMARY KEY ("materia_id","tipo")
);

-- CreateTable
CREATE TABLE "inscripciones" (
    "id" UUID NOT NULL,
    "materia_id" UUID NOT NULL,
    "alumno_id" UUID NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'activa',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inscripciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "historial_academico" (
    "id" UUID NOT NULL,
    "institucion_id" UUID NOT NULL,
    "alumno_id" UUID NOT NULL,
    "materia_id" UUID NOT NULL,
    "periodo_id" UUID NOT NULL,
    "calificacion_final" DECIMAL(5,2) NOT NULL,
    "desglose" JSONB NOT NULL DEFAULT '{}',
    "cerrado_por" UUID,
    "cerrado_en" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "historial_academico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auditoria" (
    "id" SERIAL NOT NULL,
    "institucion_id" UUID,
    "usuario_id" UUID,
    "accion" TEXT NOT NULL,
    "entidad" TEXT,
    "entidad_id" UUID,
    "resultado" TEXT NOT NULL DEFAULT 'ok',
    "ip" TEXT,
    "user_agent" TEXT,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "auditoria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "actividades" (
    "id" UUID NOT NULL,
    "institucion_id" UUID NOT NULL,
    "materia_id" UUID NOT NULL,
    "tipo" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL DEFAULT '',
    "fecha_limite" TIMESTAMPTZ,
    "valor" DECIMAL(5,2) NOT NULL DEFAULT 100,
    "estado" TEXT NOT NULL DEFAULT 'borrador',
    "publicada_en" TIMESTAMPTZ,
    "creada_por" UUID NOT NULL,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "actividades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "actividad_adjuntos" (
    "id" UUID NOT NULL,
    "actividad_id" UUID NOT NULL,
    "nombre" TEXT NOT NULL,
    "storage_key" TEXT NOT NULL,
    "mime" TEXT,
    "tamano_bytes" INTEGER,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "actividad_adjuntos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "entregas" (
    "id" UUID NOT NULL,
    "institucion_id" UUID NOT NULL,
    "actividad_id" UUID NOT NULL,
    "alumno_id" UUID NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "estado" TEXT NOT NULL DEFAULT 'borrador',
    "nota_alumno" TEXT,
    "entregada_en" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "entregas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "entrega_archivos" (
    "id" UUID NOT NULL,
    "entrega_id" UUID NOT NULL,
    "tipo" TEXT NOT NULL,
    "storage_key" TEXT,
    "url_externa" TEXT,
    "nombre" TEXT NOT NULL,
    "mime" TEXT,
    "tamano_bytes" INTEGER,
    "thumbnail_key" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "entrega_archivos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "retroalimentacion" (
    "id" UUID NOT NULL,
    "entrega_id" UUID NOT NULL,
    "docente_id" UUID NOT NULL,
    "decision" TEXT NOT NULL,
    "comentario" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "retroalimentacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "calificaciones" (
    "id" UUID NOT NULL,
    "entrega_id" UUID NOT NULL,
    "actividad_id" UUID NOT NULL,
    "alumno_id" UUID NOT NULL,
    "puntaje" DECIMAL(5,2) NOT NULL,
    "rubrica" JSONB,
    "calificada_por" UUID NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "calificaciones_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "instituciones_slug_key" ON "instituciones"("slug");

-- CreateIndex
CREATE INDEX "usuarios_institucion_id_idx" ON "usuarios"("institucion_id");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_institucion_id_email_key" ON "usuarios"("institucion_id", "email");

-- CreateIndex
CREATE UNIQUE INDEX "roles_clave_key" ON "roles"("clave");

-- CreateIndex
CREATE UNIQUE INDEX "permisos_clave_key" ON "permisos"("clave");

-- CreateIndex
CREATE INDEX "periodos_institucion_id_idx" ON "periodos"("institucion_id");

-- CreateIndex
CREATE INDEX "grupos_institucion_id_idx" ON "grupos"("institucion_id");

-- CreateIndex
CREATE UNIQUE INDEX "grupos_institucion_id_nombre_key" ON "grupos"("institucion_id", "nombre");

-- CreateIndex
CREATE INDEX "materias_institucion_id_idx" ON "materias"("institucion_id");

-- CreateIndex
CREATE INDEX "materias_docente_id_idx" ON "materias"("docente_id");

-- CreateIndex
CREATE INDEX "materias_periodo_id_idx" ON "materias"("periodo_id");

-- CreateIndex
CREATE INDEX "inscripciones_materia_id_idx" ON "inscripciones"("materia_id");

-- CreateIndex
CREATE INDEX "inscripciones_alumno_id_idx" ON "inscripciones"("alumno_id");

-- CreateIndex
CREATE UNIQUE INDEX "inscripciones_materia_id_alumno_id_key" ON "inscripciones"("materia_id", "alumno_id");

-- CreateIndex
CREATE INDEX "historial_academico_alumno_id_idx" ON "historial_academico"("alumno_id");

-- CreateIndex
CREATE UNIQUE INDEX "historial_academico_alumno_id_materia_id_periodo_id_key" ON "historial_academico"("alumno_id", "materia_id", "periodo_id");

-- CreateIndex
CREATE INDEX "auditoria_institucion_id_created_at_idx" ON "auditoria"("institucion_id", "created_at");

-- CreateIndex
CREATE INDEX "auditoria_accion_created_at_idx" ON "auditoria"("accion", "created_at");

-- CreateIndex
CREATE INDEX "actividades_materia_id_estado_idx" ON "actividades"("materia_id", "estado");

-- CreateIndex
CREATE INDEX "entregas_actividad_id_estado_idx" ON "entregas"("actividad_id", "estado");

-- CreateIndex
CREATE INDEX "entregas_alumno_id_idx" ON "entregas"("alumno_id");

-- CreateIndex
CREATE UNIQUE INDEX "entregas_actividad_id_alumno_id_key" ON "entregas"("actividad_id", "alumno_id");

-- CreateIndex
CREATE INDEX "entrega_archivos_entrega_id_idx" ON "entrega_archivos"("entrega_id");

-- CreateIndex
CREATE INDEX "retroalimentacion_entrega_id_created_at_idx" ON "retroalimentacion"("entrega_id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "calificaciones_entrega_id_key" ON "calificaciones"("entrega_id");

-- CreateIndex
CREATE INDEX "calificaciones_alumno_id_actividad_id_idx" ON "calificaciones"("alumno_id", "actividad_id");
