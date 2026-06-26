export class EventoAsignaturaAprobada {
  constructor(
    readonly idCarrera: string,
    readonly idAsignatura: string,
    readonly ocurrioEn = new Date(),
  ) {}
}
