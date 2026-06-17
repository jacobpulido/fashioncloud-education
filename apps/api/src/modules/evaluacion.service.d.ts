import { PrismaService } from '../core/prisma/prisma.service';
export declare class EvaluacionService {
    private prisma;
    constructor(prisma: PrismaService);
    getConcentrado(materiaId: string): Promise<{
        alumno: string;
        nota: number | null;
        avance: number;
    }[]>;
}
//# sourceMappingURL=evaluacion.service.d.ts.map