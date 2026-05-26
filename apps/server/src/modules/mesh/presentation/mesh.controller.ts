import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { AnalizarCargaMallaUseCase } from '../application/use-cases/analyze-mesh-load.use-case';
import { CambiarEstadoAsignaturaUseCase } from '../application/use-cases/change-course-status.use-case';
import { ObtenerMallaUseCase } from '../application/use-cases/get-mesh.use-case';
import { AnalizarCargaMallaDto } from './dto/analyze-mesh-load.dto';
import { CambiarEstadoAsignaturaDto } from './dto/change-course-status.dto';

@Controller('mesh')
export class MeshController {
  constructor(
    private readonly obtenerMallaUseCase: ObtenerMallaUseCase,
    private readonly cambiarEstadoAsignaturaUseCase: CambiarEstadoAsignaturaUseCase,
    private readonly analizarCargaMallaUseCase: AnalizarCargaMallaUseCase,
  ) {}

  @Get(':idCarrera')
  obtenerMalla(@Param('idCarrera') idCarrera: string) {
    return this.obtenerMallaUseCase.ejecutar(idCarrera);
  }

  @Patch(':idCarrera/estado')
  cambiarEstadoAsignatura(
    @Param('idCarrera') idCarrera: string,
    @Body() cuerpo: CambiarEstadoAsignaturaDto,
  ) {
    return this.cambiarEstadoAsignaturaUseCase.ejecutar(
      idCarrera,
      cuerpo.idAsignatura,
      cuerpo.estado,
    );
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
