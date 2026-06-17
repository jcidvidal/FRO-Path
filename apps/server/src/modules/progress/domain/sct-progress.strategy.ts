import { Asignatura } from '../../mesh/domain/entities/course.entity';
import { EstadoAsignatura } from '../../mesh/domain/value-objects/course-status.vo';
import { EstrategiaCalculoProgreso } from './calculation-strategy.port';
import { EstadisticasProgreso } from './progress-stats.entity';

export class EstrategiaProgresoSct implements EstrategiaCalculoProgreso {
  calcular(asignaturas: Asignatura[]): EstadisticasProgreso {
    const sctTotales = asignaturas.reduce(
      (suma, asignatura) => suma + asignatura.sct,
      0,
    );
    const sctAprobados = asignaturas
      .filter((asignatura) => asignatura.estado === EstadoAsignatura.Aprobada)
      .reduce((suma, asignatura) => suma + asignatura.sct, 0);

    return new EstadisticasProgreso({
      sctAprobados,
      sctTotales,
      porcentaje:
        sctTotales === 0 ? 0 : Math.round((sctAprobados / sctTotales) * 100),
    });
  }
}
