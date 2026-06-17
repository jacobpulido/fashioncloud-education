import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from '../shared/public.decorator';

@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: { email: string; password: string }) {
    return this.authService.login(dto.email, dto.password);
  }

  @Public()
  @Post('register')
  async register(
    @Body() dto: { email: string; password: string; nombre: string; institucion_id: string; rol?: string },
  ) {
    return this.authService.registrar({ ...dto, rol: dto.rol || 'alumno' });
  }
}
