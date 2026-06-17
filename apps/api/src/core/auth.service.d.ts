import { JwtService } from '@nestjs/jwt';
import { PrismaService } from './prisma/prisma.service';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    login(email: string, password: string): Promise<{
        accessToken: string;
        usuario: {
            id: string;
            nombre: string;
            email: string;
            rol: string;
            institucion: string;
        };
    }>;
    registrar(dto: {
        email: string;
        password: string;
        nombre: string;
        institucion_id: string;
        rol: string;
    }): Promise<{
        id: string;
        email: string;
        nombre: string;
    }>;
}
//# sourceMappingURL=auth.service.d.ts.map