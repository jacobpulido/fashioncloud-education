# FashionCloud Education — Especificación Técnica

Documento completo disponible en Notion:
👉 https://www.notion.so/FashionCloud-Education-3826d2e6115881ae9d3eebda6deead07

## Resumen del stack
- **Frontend:** React 18 + TypeScript + Vite (3 apps: coordinador, docente, alumno PWA)
- **Backend:** NestJS + Prisma + PostgreSQL 16
- **Infra:** Vercel + Supabase + Redis
- **Storage:** S3-compatible (Supabase Storage)
- **Arquitectura:** Monolito modular (núcleo central + módulos conectables)
- **Multi-tenant:** RLS por institucion_id
- **Auth:** JWT corto + refresh rotatorio + MFA TOTP
- **Monorepo:** pnpm + Turborepo
