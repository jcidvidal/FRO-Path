import { EstadoAsignatura } from '../../domain/value-objects/course-status.vo';

export class CambiarEstadoAsignaturaDto {
  idAsignatura!: string;
  estado!: EstadoAsignatura;
}
