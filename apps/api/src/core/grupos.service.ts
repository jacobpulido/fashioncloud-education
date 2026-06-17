import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class GruposService {
  constructor(private prisma: PrismaService) {}

  async findAll(institucionId: string) {
    const grupos = await this.prisma.grupos.findMany({
      where: { institucion_id: institucionId },
      orderBy: { nombre: 'asc' },
    });
    // Count alumnos per grupo
    const result = await Promise.all(grupos.map(async (g) => {
      const count = await this.prisma.grupo_alumnos.count({ where: { grupo_id: g.id } });
      return { ...g, alumno_count: count };
    }));
    return result;
  }

  async create(data: { nombre: string; nivel?: string; institucion_id: string }) {
    return this.prisma.grupos.create({ data });
  }

  async addAlumno(grupoId: string, alumnoId: string) {
    return this.prisma.grupo_alumnos.create({ data: { grupo_id: grupoId, alumno_id: alumnoId } });
  }

  async removeAlumno(grupoId: string, alumnoId: string) {
    return this.prisma.grupo_alumnos.delete({
      where: { grupo_id_alumno_id: { grupo_id: grupoId, alumno_id: alumnoId } },
    });
  }
}
