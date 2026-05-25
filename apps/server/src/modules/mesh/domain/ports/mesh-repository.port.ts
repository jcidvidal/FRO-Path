import { Asignatura } from '../entities/course.entity';

export const REPOSITORIO_MALLA = Symbol('REPOSITORIO_MALLA');

export interface PuertoRepositorioMalla {
  buscarPorCarrera(idCarrera: string): Promise<Asignatura[]>;
  guardarEstadoAsignatura(
    idCarrera: string,
    asignatura: Asignatura,
  ): Promise<Asignatura>;
}
