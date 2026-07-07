import { Logger, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';
import { ManejadorEventoAsignaturaAprobada } from './application/handlers/course-approved.handler';
import { ServicioDesbloqueoCascada } from './application/services/unlock-cascading.service';
import { AnalizarCargaMallaUseCase } from './application/use-cases/analyze-mesh-load.use-case';
import { CambiarEstadoAsignaturaUseCase } from './application/use-cases/change-course-status.use-case';
import { LimpiarProgresoUseCase } from './application/use-cases/clear-progress.use-case';
import { ObtenerMallaUseCase } from './application/use-cases/get-mesh.use-case';
import { ANALISIS_IA } from './domain/ports/ai-analysis.port';
import { REPOSITORIO_MALLA } from './domain/ports/mesh-repository.port';
import { PuedeAprobarAsignaturaSpecification } from './domain/specs/can-approve-course.specification';
import { FachadaAnalisisIaGemini } from './infrastructure/ai/gemini-ai-analysis.facade';
import { FachadaAnalisisIaEstatico } from './infrastructure/ai/static-ai-analysis.facade';
import { RepositorioMallaPostgres } from './infrastructure/persistence/postgres/postgres-mesh.repository';
import { MeshController } from './presentation/mesh.controller';

@Module({
  imports: [AuthModule],
  controllers: [MeshController],
  providers: [
    ObtenerMallaUseCase,
    CambiarEstadoAsignaturaUseCase,
    LimpiarProgresoUseCase,
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
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const apiKey = config.get<string>('GEMINI_API_KEY');
        const logger = new Logger('AnalisisIA');

        if (!apiKey || apiKey === 'tu-clave-de-api-de-gemini') {
          logger.warn(
            'GEMINI_API_KEY no configurada: se usará el análisis estático (placeholder).',
          );
          return new FachadaAnalisisIaEstatico();
        }

        const modelo = config.get<string>('GEMINI_MODEL') ?? 'gemini-2.5-flash';
        logger.log(`Análisis de IA habilitado con Gemini (modelo: ${modelo}).`);
        return new FachadaAnalisisIaGemini(apiKey, modelo);
      },
    },
  ],
  exports: [REPOSITORIO_MALLA],
})
export class MeshModule {}
