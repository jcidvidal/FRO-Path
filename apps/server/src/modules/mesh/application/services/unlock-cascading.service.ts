import { Injectable } from '@nestjs/common';
import { Asignatura } from '../../domain/entities/course.entity';
import { PuedeAprobarAsignaturaSpecification } from '../../domain/specs/can-approve-course.specification';
import { EstadoAsignatura } from '../../domain/value-objects/course-status.vo';

@Injectable()
export class ServicioDesbloqueoCascada {
  constructor(
    private readonly puedeAprobarAsignatura: PuedeAprobarAsignaturaSpecification,
  ) {}

  obtenerIdsAsignaturasDesbloqueadas(
    asignaturaAprobada: Asignatura,
    todasLasAsignaturas: Asignatura[],
  ): string[] {
    const asignaturasConEstadoActualizado = todasLasAsignaturas.map(
      (asignatura) =>
        asignatura.id === asignaturaAprobada.id
          ? asignaturaAprobada
          : asignatura,
    );

    return asignaturasConEstadoActualizado
      .filter((asignatura) => asignatura.estado === EstadoAsignatura.Bloqueada)
      .filter((asignatura) =>
        this.puedeAprobarAsignatura.seCumplePor(
          asignatura,
          asignaturasConEstadoActualizado,
        ),
      )
      .map((asignatura) => asignatura.id);
  }
}
