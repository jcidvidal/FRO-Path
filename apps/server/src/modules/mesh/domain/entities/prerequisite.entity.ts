export interface PropiedadesPrerequisito {
  idAsignatura: string;
  idAsignaturaRequerida: string;
}

export class Prerequisito {
  constructor(private readonly propiedades: PropiedadesPrerequisito) {}

  get idAsignatura(): string {
    return this.propiedades.idAsignatura;
  }

  get idAsignaturaRequerida(): string {
    return this.propiedades.idAsignaturaRequerida;
  }
}
