import { Asignatura } from '../entities/course.entity';
import { EstadoAsignatura } from '../value-objects/course-status.vo';

export class PuedeAprobarAsignaturaSpecification {
  seCumplePor(
    asignatura: Asignatura,
    todasLasAsignaturas: Asignatura[],
  ): boolean {
    const asignaturasPorId = new Map(
      todasLasAsignaturas.map((elemento) => [elemento.id, elemento]),
    );

    return asignatura.idsPrerequisitos.every((idPrerequisito) => {
      const prerequisito = asignaturasPorId.get(idPrerequisito);
      return prerequisito?.estado === EstadoAsignatura.Aprobada;
    });
  }
}
