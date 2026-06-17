import { Controller, Get, Param, Patch, Delete, Body, Req } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';

@Controller({ path: 'usuarios', version: '1' })
export class UsuariosController {
  constructor(private usuariosService: UsuariosService) {}

  @Get()
  findAll(@Req() req: any) {
    return this.usuariosService.findAll(req.user.institucion_id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usuariosService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: { nombre?: string; email?: string; estado?: string }) {
    return this.usuariosService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usuariosService.remove(id);
  }
}
