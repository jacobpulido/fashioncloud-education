import { Controller, Get, Post, Body, Param, Req } from '@nestjs/common';
import { EntregasService } from './entregas.service';

@Controller({ path: 'entregas', version: '1' })
export class EntregasController {
  constructor(private entregasService: EntregasService) {}

  @Get('pendientes')
  findPendientes(@Req() req: any) { return this.entregasService.findPendientes(req.user.institucion_id); }

  @Post()
  enviar(@Body() body: { actividad_id: string }, @Req() req: any) {
    return this.entregasService.enviar(body.actividad_id, req.user.id, req.user.institucion_id);
  }

  @Post(':id/evaluar')
  evaluar(@Param('id') id: string, @Body() body: { decision: string; puntaje?: number; comentario?: string }, @Req() req: any) {
    return this.entregasService.evaluar(id, body.decision, body.puntaje, body.comentario, req.user.id);
  }
}
