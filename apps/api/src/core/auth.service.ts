import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {
    const usuario = await this.prisma.usuarios.findFirst({
      where: { email, deleted_at: null },
    });

    if (!usuario || !(await bcrypt.compare(password, usuario.password_hash))) {
      throw new UnauthorizedException('Credenciales invalidas');
    }

    if (usuario.estado !== 'activo') {
      throw new UnauthorizedException('Usuario suspendido');
    }

    // Get role separately
    const role = await this.prisma.usuario_roles.findFirst({
      where: { usuario_id: usuario.id },
    });
    const rolData = role ? await this.prisma.roles.findUnique({ where: { id: role.rol_id } }) : null;
    const institucion = await this.prisma.instituciones.findUnique({ where: { id: usuario.institucion_id } });

    const payload = {
      sub: usuario.id,
      email: usuario.email,
      rol: rolData?.clave || 'alumno',
    };

    return {
      accessToken: this.jwtService.sign(payload),
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: payload.rol,
        institucion: institucion?.nombre || '',
      },
    };
  }

  async registrar(dto: { email: string; password: string; nombre: string; institucion_id: string; rol: string }) {
    const password_hash = await bcrypt.hash(dto.password, 12);
    const usuario = await this.prisma.usuarios.create({
      data: {
        email: dto.email,
        password_hash,
        nombre: dto.nombre,
        institucion_id: dto.institucion_id,
      },
    });

    const rol = await this.prisma.roles.findUnique({ where: { clave: dto.rol } });
    if (rol) {
      await this.prisma.usuario_roles.create({
        data: { usuario_id: usuario.id, rol_id: rol.id },
      });
    }

    return { id: usuario.id, email: usuario.email, nombre: usuario.nombre };
  }
}
