import { Carrera } from '../enums/carrera.enum';
import { Estado } from '../enums/estados.enums';
import { Asignatura } from './asignatura.entity';

export class Malla {
  constructor(
    public id: number,
    public sctTotales: number,
    public carrera: Carrera,
    public asignaturas: Asignatura[] = [],
  ) {}

  calcularSctTotales(): number {
    return this.asignaturas.reduce(
      (total, asig) => total + asig.presentarSct(),
      0,
    );
  }

  cambiarMalla(carrera: Carrera): void {
    if (carrera !== this.carrera) {
      this.carrera = carrera;
    }
  }

  calcularComplejidad(): number {
    if (this.sctTotales === 0) return 0;

    const horasSemanalesTotales = (this.sctTotales * 28) / 18;
    return Math.round(horasSemanalesTotales);
  }

  calcularAsignaturasFaltantes(): Asignatura[] {
    return this.asignaturas.filter(
      (asignatura) => asignatura.estado !== Estado.APROBADO,
    );
  }
}
