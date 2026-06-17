import { Injectable } from '@nestjs/common';
import { PrismaService } from '../core/prisma/prisma.service';

@Injectable()
export class ActividadesService {
  constructor(private prisma: PrismaService) {}

  async findPorMateria(materiaId: string) {
    return this.prisma.actividades.findMany({ where: { materia_id: materiaId }, orderBy: { created_at: 'desc' } });
  }

  async create(data: { materia_id: string; tipo: string; titulo: string; descripcion?: string; creada_por: string; institucion_id: string }) {
    return this.prisma.actividades.create({ data });
  }

  async publicar(id: string) {
    return this.prisma.actividades.update({ where: { id }, data: { estado: 'publicada', publicada_en: new Date() } });
  }
}
