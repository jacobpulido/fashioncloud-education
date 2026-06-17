import { Injectable } from '@nestjs/common';
import { PrismaService } from '../core/prisma/prisma.service';

@Injectable()
export class EntregasService {
  constructor(private prisma: PrismaService) {}

  async findPendientes(institucionId: string) {
    const entregas = await this.prisma.entregas.findMany({
      where: { institucion_id: institucionId, estado: 'entregada' },
      orderBy: { created_at: 'desc' },
    });
    return Promise.all(entregas.map(async (e) => {
      const actividad = await this.prisma.actividades.findUnique({ where: { id: e.actividad_id }, select: { titulo: true } });
      const alumno = await this.prisma.usuarios.findUnique({ where: { id: e.alumno_id }, select: { nombre: true } });
      return { ...e, actividad, alumno };
    }));
  }

  async enviar(actividadId: string, alumnoId: string, institucionId: string) {
    return this.prisma.entregas.create({
      data: { actividad_id: actividadId, alumno_id: alumnoId, institucion_id: institucionId, estado: 'entregada', entregada_en: new Date() },
    });
  }

  async evaluar(id: string, decision: string, puntaje?: number, comentario?: string, docenteId?: string) {
    const entrega = await this.prisma.entregas.findUnique({ where: { id } });
    if (!entrega) throw new Error('Entrega no encontrada');
    
    await this.prisma.entregas.update({
      where: { id },
      data: { estado: decision === 'aprobar' ? 'aprobada' : 'correccion' },
    });
    
    if (puntaje && decision === 'aprobar' && docenteId) {
      await this.prisma.calificaciones.create({
        data: { entrega_id: id, actividad_id: entrega.actividad_id, alumno_id: entrega.alumno_id, puntaje, calificada_por: docenteId },
      });
    }
    
    if (comentario && docenteId) {
      await this.prisma.retroalimentacion.create({
        data: { entrega_id: id, docente_id: docenteId, decision, comentario },
      });
    }
    
    return { success: true };
  }
}
