import { GruposService } from './grupos.service';
export declare class GruposController {
    private gruposService;
    constructor(gruposService: GruposService);
    findAll(req: any): Promise<{
        alumno_count: number;
        id: string;
        institucion_id: string;
        nombre: string;
        created_at: Date;
        nivel: string | null;
    }[]>;
    create(body: {
        nombre: string;
        nivel?: string;
    }, req: any): Promise<{
        id: string;
        institucion_id: string;
        nombre: string;
        created_at: Date;
        nivel: string | null;
    }>;
    addAlumno(id: string, body: {
        alumno_id: string;
    }): Promise<{
        grupo_id: string;
        alumno_id: string;
    }>;
    removeAlumno(id: string, alumnoId: string): Promise<{
        grupo_id: string;
        alumno_id: string;
    }>;
}
//# sourceMappingURL=grupos.controller.d.ts.map