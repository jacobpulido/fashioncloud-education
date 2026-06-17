import { Controller, Get, Post, Body, Param, Req } from '@nestjs/common';
import { MateriasService } from './materias.service';

@Controller({ path: 'materias', version: '1' })
export class MateriasController {
  constructor(private materiasService: MateriasService) {}

  @Get()
  findAll(@Req() req: any) { return this.materiasService.findAll(req.user.institucion_id); }

  @Get(':id')
  findOne(@Param('id') id: string) { return this.materiasService.findOne(id); }

  @Post()
  create(@Body() body: { nombre: string; periodo_id: string; grupo_id: string; docente_id: string }, @Req() req: any) {
    return this.materiasService.create({ ...body, institucion_id: req.user.institucion_id });
  }

  @Post(':id/ponderaciones')
  setPonderacion(@Param('id') id: string, @Body() body: { tipo: string; peso: number }) {
    return this.materiasService.setPonderacion(id, body.tipo, body.peso);
  }
}
