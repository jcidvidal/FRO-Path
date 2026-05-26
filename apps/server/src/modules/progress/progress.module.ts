import { Module } from '@nestjs/common';
import { MeshModule } from '../mesh/mesh.module';
import { CalcularProgresoEstudianteUseCase } from './application/calculate-student-progress.use-case';
import { ESTRATEGIA_CALCULO_PROGRESO } from './domain/calculation-strategy.port';
import { EstrategiaProgresoSct } from './domain/sct-progress.strategy';
import { ProgressController } from './presentation/progress.controller';

@Module({
  imports: [MeshModule],
  controllers: [ProgressController],
  providers: [
    CalcularProgresoEstudianteUseCase,
    {
      provide: ESTRATEGIA_CALCULO_PROGRESO,
      useClass: EstrategiaProgresoSct,
    },
  ],
})
export class ProgressModule {}
