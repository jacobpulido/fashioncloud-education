import { PrismaService } from '../core/prisma/prisma.service';
export declare class EntregasService {
    private prisma;
    constructor(prisma: PrismaService);
    findPendientes(institucionId: string): Promise<{
        actividad: {
            titulo: string;
        } | null;
        alumno: {
            nombre: string;
        } | null;
        id: string;
        institucion_id: string;
        estado: string;
        created_at: Date;
        updated_at: Date;
        version: number;
        alumno_id: string;
        actividad_id: string;
        nota_alumno: string | null;
        entregada_en: Date | null;
    }[]>;
    enviar(actividadId: string, alumnoId: string, institucionId: string): Promise<{
        id: string;
        institucion_id: string;
        estado: string;
        created_at: Date;
        updated_at: Date;
        version: number;
        alumno_id: string;
        actividad_id: string;
        nota_alumno: string | null;
        entregada_en: Date | null;
    }>;
    evaluar(id: string, decision: string, puntaje?: number, comentario?: string, docenteId?: string): Promise<{
        success: boolean;
    }>;
}
//# sourceMappingURL=entregas.service.d.ts.map