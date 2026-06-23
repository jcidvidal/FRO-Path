import { EstadoAsignatura } from '../value-objects/course-status.vo';

export interface PropiedadesAsignatura {
  id: string;
  codigo: string;
  nombre: string;
  sct: number;
  nivel: number;
  estado: EstadoAsignatura;
  idsPrerequisitos: string[];
}

export class Asignatura {
  constructor(private readonly propiedades: PropiedadesAsignatura) {}

  get id(): string {
    return this.propiedades.id;
  }

  get codigo(): string {
    return this.propiedades.codigo;
  }

  get nombre(): string {
    return this.propiedades.nombre;
  }

  get sct(): number {
    return this.propiedades.sct;
  }

  get nivel(): number {
    return this.propiedades.nivel;
  }

  get estado(): EstadoAsignatura {
    return this.propiedades.estado;
  }

  get idsPrerequisitos(): string[] {
    return [...this.propiedades.idsPrerequisitos];
  }

  aprobar(): Asignatura {
    return this.conEstado(EstadoAsignatura.Aprobada);
  }

  conEstado(estado: EstadoAsignatura): Asignatura {
    return new Asignatura({ ...this.propiedades, estado });
  }

  aPrimitivos(): PropiedadesAsignatura {
    return {
      ...this.propiedades,
      idsPrerequisitos: this.idsPrerequisitos,
    };
  }
}
