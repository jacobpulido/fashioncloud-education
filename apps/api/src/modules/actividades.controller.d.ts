import { ActividadesService } from './actividades.service';
export declare class ActividadesController {
    private actividadesService;
    constructor(actividadesService: ActividadesService);
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
    create(body: {
        materia_id: string;
        tipo: string;
        titulo: string;
        descripcion?: string;
    }, req: any): Promise<{
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
//# sourceMappingURL=actividades.controller.d.ts.map