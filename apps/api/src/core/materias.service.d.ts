import { PrismaService } from './prisma/prisma.service';
export declare class MateriasService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(institucionId: string): Promise<{
        id: string;
        institucion_id: string;
        nombre: string;
        created_at: Date;
        updated_at: Date;
        grupo_id: string;
        periodo_id: string;
        docente_id: string;
        color: string | null;
        ponderaciones_ok: boolean;
    }[]>;
    findOne(id: string): Promise<{
        ponderaciones: {
            materia_id: string;
            tipo: string;
            peso: import("@prisma/client/runtime/library").Decimal;
        }[];
        alumnos: ({
            id: string;
            nombre: string;
        } | null)[];
        id?: string | undefined;
        institucion_id?: string | undefined;
        nombre?: string | undefined;
        created_at?: Date | undefined;
        updated_at?: Date | undefined;
        grupo_id?: string | undefined;
        periodo_id?: string | undefined;
        docente_id?: string | undefined;
        color?: string | null | undefined;
        ponderaciones_ok?: boolean | undefined;
    }>;
    create(data: {
        nombre: string;
        periodo_id: string;
        grupo_id: string;
        docente_id: string;
        institucion_id: string;
    }): Promise<{
        id: string;
        institucion_id: string;
        nombre: string;
        created_at: Date;
        updated_at: Date;
        grupo_id: string;
        periodo_id: string;
        docente_id: string;
        color: string | null;
        ponderaciones_ok: boolean;
    }>;
    setPonderacion(materiaId: string, tipo: string, peso: number): Promise<{
        materia_id: string;
        tipo: string;
        peso: import("@prisma/client/runtime/library").Decimal;
    }>;
}
//# sourceMappingURL=materias.service.d.ts.map