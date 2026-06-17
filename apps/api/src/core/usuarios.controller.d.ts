import { UsuariosService } from './usuarios.service';
export declare class UsuariosController {
    private usuariosService;
    constructor(usuariosService: UsuariosService);
    findAll(req: any): Promise<{
        id: string;
        email: string;
        nombre: string;
        estado: string;
        created_at: Date;
    }[]>;
    findOne(id: string): Promise<{
        roles: string[];
        id: string;
        institucion_id: string;
        email: string;
        password_hash: string;
        nombre: string;
        apellidos: string;
        avatar_url: string | null;
        telefono: string | null;
        mfa_habilitado: boolean;
        mfa_secret: string | null;
        estado: string;
        ultimo_acceso: Date | null;
        created_at: Date;
        updated_at: Date;
        deleted_at: Date | null;
    }>;
    update(id: string, body: {
        nombre?: string;
        email?: string;
        estado?: string;
    }): Promise<{
        id: string;
        institucion_id: string;
        email: string;
        password_hash: string;
        nombre: string;
        apellidos: string;
        avatar_url: string | null;
        telefono: string | null;
        mfa_habilitado: boolean;
        mfa_secret: string | null;
        estado: string;
        ultimo_acceso: Date | null;
        created_at: Date;
        updated_at: Date;
        deleted_at: Date | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        institucion_id: string;
        email: string;
        password_hash: string;
        nombre: string;
        apellidos: string;
        avatar_url: string | null;
        telefono: string | null;
        mfa_habilitado: boolean;
        mfa_secret: string | null;
        estado: string;
        ultimo_acceso: Date | null;
        created_at: Date;
        updated_at: Date;
        deleted_at: Date | null;
    }>;
}
//# sourceMappingURL=usuarios.controller.d.ts.map