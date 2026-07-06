import { Controller, Delete, ForbiddenException, Get, HttpCode, Param, Patch, Post, Req, UseGuards, Body } from '@nestjs/common';
import { RolUsuario } from '../../auth/domain/roles';
import { JwtAuthGuard } from '../../auth/presentation/jwt-auth.guard';
import type { RequestConUsuario } from '../../auth/presentation/jwt-auth.guard';
import { AnalizarCargaMallaUseCase } from '../application/use-cases/analyze-mesh-load.use-case';
import { CambiarEstadoAsignaturaUseCase } from '../application/use-cases/change-course-status.use-case';
import { LimpiarProgresoUseCase } from '../application/use-cases/clear-progress.use-case';
import { ObtenerMallaUseCase } from '../application/use-cases/get-mesh.use-case';
import { CambiarEstadoAsignaturaDto } from './dto/change-course-status.dto';

@UseGuards(JwtAuthGuard)
@Controller('mesh')
export class MeshController {
  constructor(
    private readonly obtenerMallaUseCase: ObtenerMallaUseCase,
    private readonly cambiarEstadoAsignaturaUseCase: CambiarEstadoAsignaturaUseCase,
    private readonly limpiarProgresoUseCase: LimpiarProgresoUseCase,
    private readonly analizarCargaMallaUseCase: AnalizarCargaMallaUseCase,
  ) { }

  @Get(':idCarrera')
  obtenerMalla(
    @Param('idCarrera') idCarrera: string,
    @Req() solicitud: RequestConUsuario,
  ) {
    return this.obtenerMallaUseCase.ejecutar(idCarrera, solicitud.user!.id);
  }

  @Get(':idCarrera/estudiante/:idEstudiante')
  obtenerMallaEstudiante(
    @Param('idCarrera') idCarrera: string,
    @Param('idEstudiante') idEstudiante: string,
    @Req() solicitud: RequestConUsuario,
  ) {
    const rol = solicitud.user?.rol;
    if (rol !== RolUsuario.Director && rol !== RolUsuario.Admin) {
      throw new ForbiddenException(
        'Solo un director o administrador puede ver la malla de un estudiante.',
      );
    }

    return this.obtenerMallaUseCase.ejecutar(idCarrera, Number(idEstudiante));
  }

  @Patch(':idCarrera/estado')
  cambiarEstadoAsignatura(
    @Param('idCarrera') idCarrera: string,
    @Body() cuerpo: CambiarEstadoAsignaturaDto,
    @Req() solicitud: RequestConUsuario,
  ) {
    return this.cambiarEstadoAsignaturaUseCase.ejecutar(
      idCarrera,
      cuerpo.idAsignatura,
      cuerpo.estado,
      solicitud.user!.id,
    );
  }

  @Delete(':idCarrera/progreso')
  @HttpCode(200)
  async limpiarProgreso(
    @Param('idCarrera') idCarrera: string,
    @Req() solicitud: RequestConUsuario,
  ) {
    await this.limpiarProgresoUseCase.ejecutar(idCarrera, solicitud.user!.id);
    return { mensaje: 'Progreso eliminado correctamente.' };
  }

  @Post(':idCarrera/analisis-ia')
  analizarCargaMalla(
    @Param('idCarrera') idCarrera: string,
    @Req() solicitud: RequestConUsuario,
  ) {
    return this.analizarCargaMallaUseCase.ejecutar(idCarrera, solicitud.user!.id);
  }
}
