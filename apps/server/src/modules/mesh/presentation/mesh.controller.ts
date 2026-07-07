import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/presentation/jwt-auth.guard';
import type { RequestConUsuario } from '../../auth/presentation/jwt-auth.guard';
import { AnalizarCargaMallaUseCase } from '../application/use-cases/analyze-mesh-load.use-case';
import { CambiarEstadoAsignaturaUseCase } from '../application/use-cases/change-course-status.use-case';
import { LimpiarProgresoUseCase } from '../application/use-cases/clear-progress.use-case';
import { ObtenerMallaUseCase } from '../application/use-cases/get-mesh.use-case';
import { AnalizarCargaMallaDto } from './dto/analyze-mesh-load.dto';
import { CambiarEstadoAsignaturaDto } from './dto/change-course-status.dto';

@UseGuards(JwtAuthGuard)
@Controller('mesh')
export class MeshController {
  constructor(
    private readonly obtenerMallaUseCase: ObtenerMallaUseCase,
    private readonly cambiarEstadoAsignaturaUseCase: CambiarEstadoAsignaturaUseCase,
    private readonly limpiarProgresoUseCase: LimpiarProgresoUseCase,
    private readonly analizarCargaMallaUseCase: AnalizarCargaMallaUseCase,
  ) {}

  @Get(':idCarrera')
  obtenerMalla(
    @Param('idCarrera') idCarrera: string,
    @Req() solicitud: RequestConUsuario,
  ) {
    return this.obtenerMallaUseCase.ejecutar(idCarrera, solicitud.user!.id);
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
    @Body() cuerpo: AnalizarCargaMallaDto,
  ) {
    return this.analizarCargaMallaUseCase.ejecutar({
      idCarrera,
      idsAsignaturasSeleccionadas: cuerpo.idsAsignaturasSeleccionadas,
      idsAsignaturasAprobadas: cuerpo.idsAsignaturasAprobadas,
    });
  }
}
