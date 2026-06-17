import { AuthService } from './auth.service';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(dto: {
        email: string;
        password: string;
    }): Promise<{
        accessToken: string;
        usuario: {
            id: string;
            nombre: string;
            email: string;
            rol: string;
            institucion: string;
        };
    }>;
    register(dto: {
        email: string;
        password: string;
        nombre: string;
        institucion_id: string;
        rol?: string;
    }): Promise<{
        id: string;
        email: string;
        nombre: string;
    }>;
}
//# sourceMappingURL=auth.controller.d.ts.map