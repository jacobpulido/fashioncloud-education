import { Controller, Get, Post, Body, Req, Param, Delete } from '@nestjs/common';
import { GruposService } from './grupos.service';

@Controller({ path: 'grupos', version: '1' })
export class GruposController {
  constructor(private gruposService: GruposService) {}

  @Get()
  findAll(@Req() req: any) {
    return this.gruposService.findAll(req.user.institucion_id);
  }

  @Post()
  create(@Body() body: { nombre: string; nivel?: string }, @Req() req: any) {
    return this.gruposService.create({ ...body, institucion_id: req.user.institucion_id });
  }

  @Post(':id/alumnos')
  addAlumno(@Param('id') id: string, @Body() body: { alumno_id: string }) {
    return this.gruposService.addAlumno(id, body.alumno_id);
  }

  @Delete(':id/alumnos/:alumnoId')
  removeAlumno(@Param('id') id: string, @Param('alumnoId') alumnoId: string) {
    return this.gruposService.removeAlumno(id, alumnoId);
  }
}
