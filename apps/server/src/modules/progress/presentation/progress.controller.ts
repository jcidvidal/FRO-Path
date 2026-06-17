import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/presentation/jwt-auth.guard';
import type { RequestConUsuario } from '../../auth/presentation/jwt-auth.guard';
import { CalcularProgresoEstudianteUseCase } from '../application/calculate-student-progress.use-case';

@UseGuards(JwtAuthGuard)
@Controller('progress')
export class ProgressController {
  constructor(
    private readonly calcularProgresoEstudianteUseCase: CalcularProgresoEstudianteUseCase,
  ) {}

  @Get(':idCarrera')
  obtenerProgreso(
    @Param('idCarrera') idCarrera: string,
    @Req() solicitud: RequestConUsuario,
  ) {
    return this.calcularProgresoEstudianteUseCase.ejecutar(idCarrera, solicitud.user!.id);
  }
}
