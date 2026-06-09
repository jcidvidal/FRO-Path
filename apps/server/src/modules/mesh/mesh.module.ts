import { Module } from '@nestjs/common';
import { ManejadorEventoAsignaturaAprobada } from './application/handlers/course-approved.handler';
import { ServicioDesbloqueoCascada } from './application/services/unlock-cascading.service';
import { AnalizarCargaMallaUseCase } from './application/use-cases/analyze-mesh-load.use-case';
import { CambiarEstadoAsignaturaUseCase } from './application/use-cases/change-course-status.use-case';
import { ObtenerMallaUseCase } from './application/use-cases/get-mesh.use-case';
import { ANALISIS_IA } from './domain/ports/ai-analysis.port';
import { REPOSITORIO_MALLA } from './domain/ports/mesh-repository.port';
import { PuedeAprobarAsignaturaSpecification } from './domain/specs/can-approve-course.specification';
import { FachadaAnalisisIaEstatico } from './infrastructure/ai/static-ai-analysis.facade';
import { RepositorioMallaPostgres } from './infrastructure/persistence/postgres/postgres-mesh.repository';
import { MeshController } from './presentation/mesh.controller';

@Module({
  controllers: [MeshController],
  providers: [
    ObtenerMallaUseCase,
    CambiarEstadoAsignaturaUseCase,
    AnalizarCargaMallaUseCase,
    ServicioDesbloqueoCascada,
    PuedeAprobarAsignaturaSpecification,
    ManejadorEventoAsignaturaAprobada,
    {
      provide: REPOSITORIO_MALLA,
      useClass: RepositorioMallaPostgres,
    },
    {
      provide: ANALISIS_IA,
      useClass: FachadaAnalisisIaEstatico,
    },
  ],
  exports: [REPOSITORIO_MALLA],
})
export class MeshModule {}
