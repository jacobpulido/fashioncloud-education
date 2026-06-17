import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // 1. Roles
  const rolAdmin = await prisma.roles.create({ data: { clave: 'admin', nombre: 'Admin', descripcion: 'Administrador del sistema' } });
  const rolCoord = await prisma.roles.create({ data: { clave: 'coordinador', nombre: 'Coordinador', descripcion: 'Coordinador académico' } });
  const rolDocente = await prisma.roles.create({ data: { clave: 'docente', nombre: 'Docente', descripcion: 'Profesor / Docente' } });
  const rolAlumno = await prisma.roles.create({ data: { clave: 'alumno', nombre: 'Alumno', descripcion: 'Estudiante' } });
  console.log('  ✅ Roles');

  // 2. Institución
  const inst = await prisma.instituciones.create({
    data: { nombre: 'Centro de Diseño de Modas', slug: 'cdm', activa: true },
  });
  console.log('  ✅ Institución');

  // 3. Periodo
  const periodo = await prisma.periodos.create({
    data: {
      institucion_id: inst.id,
      nombre: 'Otoño 2026',
      fecha_inicio: new Date('2026-08-01'),
      fecha_fin: new Date('2026-12-20'),
      estado: 'activo',
    },
  });
  console.log('  ✅ Periodo');

  // 4. Usuarios
  const hash = (pw: string) => bcrypt.hashSync(pw, 10);
  const pwd = 'demo***'; // same for all demo users

  const uCoord = await prisma.usuarios.create({
    data: { email: 'coordinador@edu.test', nombre: 'Laura', apellidos: 'Mendoza', password_hash: hash(pwd), institucion_id: inst.id, estado: 'activo' },
  });
  await prisma.usuario_roles.create({ data: { usuario_id: uCoord.id, rol_id: rolCoord.id } });

  const uDocente = await prisma.usuarios.create({
    data: { email: 'docente@edu.test', nombre: 'Mariana', apellidos: 'Lara', password_hash: hash(pwd), institucion_id: inst.id, estado: 'activo' },
  });
  await prisma.usuario_roles.create({ data: { usuario_id: uDocente.id, rol_id: rolDocente.id } });

  const uAlumno = await prisma.usuarios.create({
    data: { email: 'alumno@edu.test', nombre: 'Sofía', apellidos: 'Lara', password_hash: hash(pwd), institucion_id: inst.id, estado: 'activo' },
  });
  await prisma.usuario_roles.create({ data: { usuario_id: uAlumno.id, rol_id: rolAlumno.id } });
  console.log('  ✅ Usuarios');

  // 5. Grupo (standalone — no materia_id/docente_id)
  const grupo = await prisma.grupos.create({
    data: { institucion_id: inst.id, nombre: 'Grupo A' },
  });
  console.log('  ✅ Grupo');

  // 6. Materias (tienen grupo_id)
  const mat1 = await prisma.materias.create({
    data: {
      institucion_id: inst.id, nombre: 'Diseño de Colección',
      periodo_id: periodo.id, grupo_id: grupo.id, docente_id: uDocente.id,
    },
  });
  const mat2 = await prisma.materias.create({
    data: {
      institucion_id: inst.id, nombre: 'Patronaje',
      periodo_id: periodo.id, grupo_id: grupo.id, docente_id: uDocente.id,
    },
  });
  console.log('  ✅ Materias');

  // 7. Grupo-Alumno
  await prisma.grupo_alumnos.create({ data: { grupo_id: grupo.id, alumno_id: uAlumno.id } });

  // 8. Inscripción (no tiene periodo_id/grupo_id en el schema)
  await prisma.inscripciones.create({
    data: { alumno_id: uAlumno.id, materia_id: mat1.id, estado: 'activa' },
  });
  await prisma.inscripciones.create({
    data: { alumno_id: uAlumno.id, materia_id: mat2.id, estado: 'activa' },
  });
  console.log('  ✅ Grupo-Alumnos + Inscripciones');

  // 9. Actividades
  await prisma.actividades.create({
    data: {
      institucion_id: inst.id, materia_id: mat1.id, tipo: 'proyecto',
      titulo: 'Moodboard Colección Cápsula P/V',
      descripcion: 'Crear un moodboard digital con referencias de tendencias para la colección Primavera/Verano.',
      fecha_limite: new Date('2026-06-20'), valor: 30,
      estado: 'publicada', creada_por: uDocente.id,
    },
  });
  await prisma.actividades.create({
    data: {
      institucion_id: inst.id, materia_id: mat1.id, tipo: 'investigacion',
      titulo: 'Investigación de mercado',
      descripcion: 'Análisis de tendencias actuales en moda sostenible.',
      fecha_limite: new Date('2026-06-10'), valor: 20,
      estado: 'publicada', creada_por: uDocente.id,
    },
  });
  console.log('  ✅ Actividades');

  console.log('\n🎉 Seed completado!');
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
