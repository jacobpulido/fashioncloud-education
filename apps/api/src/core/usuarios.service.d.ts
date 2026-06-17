import { PrismaService } from './prisma/prisma.service';
export declare class UsuariosService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(institucionId: string): Promise<{
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
    update(id: string, data: {
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
//# sourceMappingURL=usuarios.service.d.ts.map