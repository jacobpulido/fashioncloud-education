import { PrismaService } from '../core/prisma/prisma.service';
export declare class ActividadesService {
    private prisma;
    constructor(prisma: PrismaService);
    findPorMateria(materiaId: string): Promise<{
        id: string;
        institucion_id: string;
        estado: string;
        created_at: Date;
        updated_at: Date;
        descripcion: string;
        materia_id: string;
        tipo: string;
        titulo: string;
        fecha_limite: Date | null;
        valor: import("@prisma/client/runtime/library").Decimal;
        publicada_en: Date | null;
        creada_por: string;
        metadata: import("@prisma/client/runtime/library").JsonValue;
    }[]>;
    create(data: {
        materia_id: string;
        tipo: string;
        titulo: string;
        descripcion?: string;
        creada_por: string;
        institucion_id: string;
    }): Promise<{
        id: string;
        institucion_id: string;
        estado: string;
        created_at: Date;
        updated_at: Date;
        descripcion: string;
        materia_id: string;
        tipo: string;
        titulo: string;
        fecha_limite: Date | null;
        valor: import("@prisma/client/runtime/library").Decimal;
        publicada_en: Date | null;
        creada_por: string;
        metadata: import("@prisma/client/runtime/library").JsonValue;
    }>;
    publicar(id: string): Promise<{
        id: string;
        institucion_id: string;
        estado: string;
        created_at: Date;
        updated_at: Date;
        descripcion: string;
        materia_id: string;
        tipo: string;
        titulo: string;
        fecha_limite: Date | null;
        valor: import("@prisma/client/runtime/library").Decimal;
        publicada_en: Date | null;
        creada_por: string;
        metadata: import("@prisma/client/runtime/library").JsonValue;
    }>;
}
//# sourceMappingURL=actividades.service.d.ts.map