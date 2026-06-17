import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { PrismaModule } from './core/prisma/prisma.module';
import { AuthModule } from './core/auth/auth.module';
import { UsuariosModule } from './core/usuarios/usuarios.module';
import { GruposModule } from './core/grupos/grupos.module';
import { MateriasModule } from './core/materias/materias.module';
import { InscripcionesModule } from './core/inscripciones/inscripciones.module';
import { ActividadesModule } from './modules/actividades/actividades.module';
import { EntregasModule } from './modules/entregas/entregas.module';
import { EvaluacionModule } from './modules/evaluacion/evaluacion.module';
import { JwtAuthGuard } from './shared/jwt-auth.guard';
import { RolesGuard } from './shared/roles.guard';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
    PrismaModule,
    AuthModule,
    UsuariosModule,
    GruposModule,
    MateriasModule,
    InscripcionesModule,
    ActividadesModule,
    EntregasModule,
    EvaluacionModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
