import { Asignatura } from '../../mesh/domain/entities/course.entity';
import { EstadisticasProgreso } from './progress-stats.entity';

export const ESTRATEGIA_CALCULO_PROGRESO = Symbol(
  'ESTRATEGIA_CALCULO_PROGRESO',
);

export interface EstrategiaCalculoProgreso {
  calcular(asignaturas: Asignatura[]): EstadisticasProgreso;
}
