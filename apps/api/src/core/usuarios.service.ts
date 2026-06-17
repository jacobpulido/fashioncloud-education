import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class UsuariosService {
  constructor(private prisma: PrismaService) {}

  async findAll(institucionId: string) {
    return this.prisma.usuarios.findMany({
      where: { institucion_id: institucionId, deleted_at: null },
      select: { id: true, nombre: true, email: true, estado: true, created_at: true },
      orderBy: { created_at: 'desc' },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.usuarios.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    const roles = await this.prisma.usuario_roles.findMany({
      where: { usuario_id: id },
    });
    const roleIds = roles.map(r => r.rol_id);
    const roleData = await this.prisma.roles.findMany({
      where: { id: { in: roleIds } },
    });
    return { ...user, roles: roleData.map(r => r.clave) };
  }

  async update(id: string, data: { nombre?: string; email?: string; estado?: string }) {
    return this.prisma.usuarios.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.usuarios.update({ where: { id }, data: { deleted_at: new Date() } });
  }
}
