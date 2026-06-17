import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../application/auth.service';
import { AsignarRolDto } from './dto/assign-role.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import type { RequestConUsuario } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() cuerpo: LoginDto) {
    return this.authService.login(cuerpo);
  }

  @Post('register')
  register(@Body() cuerpo: RegisterDto) {
    return this.authService.register(cuerpo);
  }

  @Patch('usuarios/:id/rol')
  @UseGuards(JwtAuthGuard)
  asignarRol(
    @Param('id') idUsuario: string,
    @Body() cuerpo: AsignarRolDto,
    @Req() solicitud: RequestConUsuario,
  ) {
    return this.authService.asignarRolUsuario({
      idUsuario: Number(idUsuario),
      rol: cuerpo.rol,
      usuarioSolicitante: solicitud.user,
    });
  }
}
