import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../prisma/prisma.service';

type JwtPayload = { sub: string; email: string; rol: string };

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'fc-education-dev-secret',
    });
  }

  async validate(payload: JwtPayload) {
    const usuario = await this.prisma.usuarios.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true, nombre: true, estado: true, institucion_id: true },
    });
    if (!usuario || usuario.estado !== 'activo') {
      throw new UnauthorizedException();
    }
    return { id: usuario.id, email: usuario.email, nombre: usuario.nombre, institucion_id: usuario.institucion_id };
  }
}
