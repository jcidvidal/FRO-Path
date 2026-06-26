import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../application/auth.service';
import { RolUsuario } from '../domain/roles';
import { ActualizarUsuarioDto } from './dto/update-user.dto';
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

  @Post('usuarios')
  @UseGuards(JwtAuthGuard)
  @HttpCode(201)
  async crearUsuario(
    @Body() cuerpo: RegisterDto,
    @Req() solicitud: RequestConUsuario,
  ) {
    if (solicitud.user?.rol !== RolUsuario.Admin) {
      throw new ForbiddenException('Solo un administrador puede crear usuarios.');
    }
    return this.authService.crearUsuario(cuerpo, solicitud.user);
  }

  @Patch('usuarios/:id')
  @UseGuards(JwtAuthGuard)
  async actualizarUsuario(
    @Param('id') id: string,
    @Body() cuerpo: ActualizarUsuarioDto,
    @Req() solicitud: RequestConUsuario,
  ) {
    if (solicitud.user?.rol !== RolUsuario.Admin) {
      throw new ForbiddenException('Solo un administrador puede editar usuarios.');
    }
    return this.authService.actualizarUsuario(Number(id), cuerpo);
  }

  @Get('estudiantes')
  @UseGuards(JwtAuthGuard)
  buscarEstudiantes(
    @Query('busqueda') busqueda: string | undefined,
    @Req() solicitud: RequestConUsuario,
  ) {
    return this.authService.buscarEstudiantes({
      busqueda,
      usuarioSolicitante: solicitud.user,
    });
  }

  @Get('usuarios')
  @UseGuards(JwtAuthGuard)
  listarUsuarios(
    @Query('busqueda') busqueda: string | undefined,
    @Query('rol') rol: string | undefined,
    @Req() solicitud: RequestConUsuario,
  ) {
    return this.authService.listarUsuarios({
      busqueda,
      rol: rol as RolUsuario | undefined,
      usuarioSolicitante: solicitud.user,
    });
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

  @Delete('usuarios/:id')
  @UseGuards(JwtAuthGuard)
  eliminarUsuario(
    @Param('id') idUsuario: string,
    @Req() solicitud: RequestConUsuario,
  ) {
    return this.authService.eliminarEstudiante({
      idUsuario: Number(idUsuario),
      usuarioSolicitante: solicitud.user,
    });
  }
}
