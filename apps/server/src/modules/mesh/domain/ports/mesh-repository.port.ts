import { Asignatura } from '../entities/course.entity';

export const REPOSITORIO_MALLA = Symbol('REPOSITORIO_MALLA');

export interface PuertoRepositorioMalla {
  buscarPorCarrera(idCarrera: string, idUsuario: number): Promise<Asignatura[]>;
  guardarEstadoAsignatura(
    idCarrera: string,
    asignatura: Asignatura,
    idUsuario: number,
  ): Promise<Asignatura>;
  limpiarProgreso(idCarrera: string, idUsuario: number): Promise<void>;
}
