import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class MateriasService {
  constructor(private prisma: PrismaService) {}

  async findAll(institucionId: string) {
    return this.prisma.materias.findMany({
      where: { institucion_id: institucionId },
      orderBy: { created_at: 'desc' },
    });
  }

  async findOne(id: string) {
    const materia = await this.prisma.materias.findUnique({ where: { id } });
    const ponderaciones = await this.prisma.ponderaciones_materia.findMany({ where: { materia_id: id } });
    const inscripciones = await this.prisma.inscripciones.findMany({ where: { materia_id: id, estado: 'activa' } });
    const alumnos = await Promise.all(
      inscripciones.map(async (i) => {
        const u = await this.prisma.usuarios.findUnique({ where: { id: i.alumno_id }, select: { id: true, nombre: true } });
        return u;
      })
    );
    return { ...materia, ponderaciones, alumnos };
  }

  async create(data: { nombre: string; periodo_id: string; grupo_id: string; docente_id: string; institucion_id: string }) {
    return this.prisma.materias.create({ data });
  }

  async setPonderacion(materiaId: string, tipo: string, peso: number) {
    return this.prisma.ponderaciones_materia.upsert({
      where: { materia_id_tipo: { materia_id: materiaId, tipo } },
      create: { materia_id: materiaId, tipo, peso },
      update: { peso },
    });
  }
}
