import { EntregasService } from './entregas.service';
export declare class EntregasController {
    private entregasService;
    constructor(entregasService: EntregasService);
    findPendientes(req: any): Promise<{
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
    enviar(body: {
        actividad_id: string;
    }, req: any): Promise<{
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
    evaluar(id: string, body: {
        decision: string;
        puntaje?: number;
        comentario?: string;
    }, req: any): Promise<{
        success: boolean;
    }>;
}
//# sourceMappingURL=entregas.controller.d.ts.map