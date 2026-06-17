import { EvaluacionService } from './evaluacion.service';
export declare class EvaluacionController {
    private evaluacionService;
    constructor(evaluacionService: EvaluacionService);
    getConcentrado(materiaId: string): Promise<{
        alumno: string;
        nota: number | null;
        avance: number;
    }[]>;
}
//# sourceMappingURL=evaluacion.controller.d.ts.map