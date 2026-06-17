import { Injectable } from '@nestjs/common';
import { PrismaService } from '../core/prisma/prisma.service';

@Injectable()
export class EvaluacionService {
  constructor(private prisma: PrismaService) {}

  async getConcentrado(materiaId: string) {
    const inscripciones = await this.prisma.inscripciones.findMany({
      where: { materia_id: materiaId, estado: 'activa' },
    });
    
    const alumnos = await Promise.all(
      inscripciones.map(async (i) => {
        const u = await this.prisma.usuarios.findUnique({ where: { id: i.alumno_id }, select: { id: true, nombre: true } });
        return u!;
      })
    );

    const actividades = await this.prisma.actividades.findMany({
      where: { materia_id: materiaId, estado: 'publicada' },
      select: { id: true, titulo: true, tipo: true },
    });

    const calificaciones = await this.prisma.calificaciones.findMany({
      where: { actividad_id: { in: actividades.map(a => a.id) } },
    });

    const ponderaciones = await this.prisma.ponderaciones_materia.findMany({ where: { materia_id: materiaId } });
    const pondMap: Record<string, number> = {};
    ponderaciones.forEach(p => { pondMap[p.tipo] = Number(p.peso); });

    return alumnos.map((alumno) => {
      const califAlumno = calificaciones.filter(c => c.alumno_id === alumno.id);
      
      const porTipo: Record<string, number[]> = {};
      for (const c of califAlumno) {
        const act = actividades.find(a => a.id === c.actividad_id);
        if (act) {
          (porTipo[act.tipo] = porTipo[act.tipo] || []).push(Number(c.puntaje));
        }
      }

      let suma = 0, pesoUsado = 0;
      for (const [tipo, notas] of Object.entries(porTipo)) {
        const peso = pondMap[tipo] || 0;
        if (peso > 0) {
          suma += (notas.reduce((a, b) => a + b, 0) / notas.length) * (peso / 100);
          pesoUsado += peso;
        }
      }

      return {
        alumno: alumno.nombre,
        nota: pesoUsado > 0 ? Math.round(suma / (pesoUsado / 100) * 100) / 100 : null,
        avance: pesoUsado,
      };
    });
  }
}
