import { Controller, Get, Post, Body, Param, Req } from '@nestjs/common';
import { ActividadesService } from './actividades.service';

@Controller({ path: 'actividades', version: '1' })
export class ActividadesController {
  constructor(private actividadesService: ActividadesService) {}

  @Get('materia/:materiaId')
  findPorMateria(@Param('materiaId') materiaId: string) { return this.actividadesService.findPorMateria(materiaId); }

  @Post()
  create(@Body() body: { materia_id: string; tipo: string; titulo: string; descripcion?: string }, @Req() req: any) {
    return this.actividadesService.create({ ...body, creada_por: req.user.id, institucion_id: req.user.institucion_id });
  }

  @Post(':id/publicar')
  publicar(@Param('id') id: string) { return this.actividadesService.publicar(id); }
}
