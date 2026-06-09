import { Controller, Get, Param } from '@nestjs/common';
import { CalcularProgresoEstudianteUseCase } from '../application/calculate-student-progress.use-case';

@Controller('progress')
export class ProgressController {
  constructor(
    private readonly calcularProgresoEstudianteUseCase: CalcularProgresoEstudianteUseCase,
  ) {}

  @Get(':idCarrera')
  obtenerProgreso(@Param('idCarrera') idCarrera: string) {
    return this.calcularProgresoEstudianteUseCase.ejecutar(idCarrera);
  }
}
