import { Controller, Get, Param } from '@nestjs/common';
import { EvaluacionService } from './evaluacion.service';

@Controller({ path: 'evaluacion', version: '1' })
export class EvaluacionController {
  constructor(private evaluacionService: EvaluacionService) {}

  @Get('concentrado/:materiaId')
  getConcentrado(@Param('materiaId') materiaId: string) {
    return this.evaluacionService.getConcentrado(materiaId);
  }
}
