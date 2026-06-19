# FashionCloud Education — Arquitectura

*Última actualización: 19 Jun 2026*

## Stack
- **Frontend:** Next.js 16.2.9 (App Router + Turbopack)
- **Auth:** Supabase Auth (`auth.users` + `user_metadata`)
- **Database:** PostgreSQL 17 (Supabase)
- **AI:** DeepSeek API (generación de planes de estudio)
- **Storage:** Supabase Storage (archivos de entregas)
- **Hosting:** Vercel (production)

## Roles (actual → objetivo)

| Rol | Descripción | Tabla |
|-----|-------------|-------|
| `super_admin` | Dueño de la plataforma | `auth.users.metadata` |
| `admin_plantel` | Administra su institución | `miembros_institucion` |
| `coordinador` | Supervisa académico | `miembros_institucion` |
| `docente` | Crea materias y actividades | `miembros_institucion` |
| `alumno` | Se inscribe y entrega | `miembros_institucion` |

## Modelo de datos

### Tablas del sistema

#### `instituciones`
| Columna | Tipo | Descripción |
|---------|------|-------------|
| id | uuid PK | |
| nombre | text | Nombre del plantel |
| slug | citext UNIQUE | Identificador URL |
| logo_url | text | Logo |
| config | jsonb | Configuración del plantel |
| activa | boolean | |
| created_at | timestamptz | |
| updated_at | timestamptz | |

#### `miembros_institucion`
| Columna | Tipo | Descripción |
|---------|------|-------------|
| id | uuid PK | |
| institucion_id | uuid FK → instituciones | |
| usuario_id | uuid FK → auth.users | |
| rol | text | admin_plantel, coordinador, docente, alumno |
| created_at | timestamptz | |
| UNIQUE | (institucion_id, usuario_id) | |

#### Tablas de negocio (todas con `institucion_id`)
- `materias_carga`
- `actividades_carga`
- `inscripciones_carga`
- `entregas_carga`

## Rutas

### App general
| Ruta | Acceso | Propósito |
|------|--------|-----------|
| `/` | Todos | Redirección por rol |
| `/login` | Público | |
| `/registro` | Público | Con selección de institución |

### Admin Plantel
| Ruta | Propósito |
|------|-----------|
| `/admin/dashboard` | Stats del plantel |
| `/admin/miembros` | Gestionar miembros y roles |
| `/admin/institucion` | Configurar plantel |

### Docente
| Ruta | Propósito |
|------|-----------|
| `/dashboard` | Stats del docente |
| `/materias` | Lista materias |
| `/materias/[id]` | Detalle + plan + inscripciones |
| `/actividades` | CRUD actividades |
| `/actividades/[id]` | Ver entregas + calificar |
| `/carga-rapida` | Crear materia con IA |

### Alumno
| Ruta | Propósito |
|------|-----------|
| `/alumno/pendientes` | Dashboard alumno |
| `/alumno/materias` | Lista + plan visible |
| `/alumno/entregar/[id]` | Entregar + archivos |

## Seguridad
- RLS por `institucion_id` en todas las tablas
- Políticas por rol en `miembros_institucion`
- Middleware valida membresía activa

## PWAs (pendiente)
- Un solo dominio con detección de rol
- manifest.json dinámico por rol
- Service worker con cache de assets

## Historial de cambios

### 19 Jun 2026 — 08:00 MVP Inicial
- Carga Rápida con IA (DeepSeek) ✅
- Materias + Actividades + Entregas ✅
- Roles: docente y alumno ✅
- RLS por usuario ✅
- Storage para archivos ✅
- Dashboard con stats reales ✅
- Ver entregas + calificar ✅
- Estado de materia (borrador/activa/archivada) ✅
- Plan de estudios visible para alumno ✅

### 19 Jun 2026 — 08:30 Fase 1: Multi-tenant ✅
- ✅ Tablas: `instituciones`, `miembros_institucion`
- ✅ `institucion_id` en materias/actividades/inscripciones/entregas
- ✅ Institución por defecto + migración de usuario existente
- ✅ Registro con selección o creación de institución
- ✅ Roles: admin_plantel, coordinador, docente, alumno
- ✅ RLS multi-tenant
- ✅ Panel admin: `/admin/dashboard` + `/admin/miembros`
- ✅ Documentado en ARCHITECTURE.md

### Pendiente (próximo)
- [ ] PWA: manifest + service worker
- [ ] Invitación por email (Resend/SendGrid)
- [ ] Subir archivos .docx/.pdf en carga rápida (extracción texto)
- [ ] Dashboard alumno con gráficas
