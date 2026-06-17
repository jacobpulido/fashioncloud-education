import { PrismaService } from './prisma/prisma.service';
export declare class GruposService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(institucionId: string): Promise<{
        alumno_count: number;
        id: string;
        institucion_id: string;
        nombre: string;
        created_at: Date;
        nivel: string | null;
    }[]>;
    create(data: {
        nombre: string;
        nivel?: string;
        institucion_id: string;
    }): Promise<{
        id: string;
        institucion_id: string;
        nombre: string;
        created_at: Date;
        nivel: string | null;
    }>;
    addAlumno(grupoId: string, alumnoId: string): Promise<{
        grupo_id: string;
        alumno_id: string;
    }>;
    removeAlumno(grupoId: string, alumnoId: string): Promise<{
        grupo_id: string;
        alumno_id: string;
    }>;
}
//# sourceMappingURL=grupos.service.d.ts.map