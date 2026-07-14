import { Asignatura } from '../entities/course.entity';

export const REPOSITORIO_MALLA = Symbol('REPOSITORIO_MALLA');

export interface MallaCategorizada {
  asignaturas: Asignatura[];      // malla regular (categoria = 'malla')
  modulosIngles: Asignatura[];    // inglés coordinación (categoria = 'ingles')
  practicas: Asignatura[];        // prácticas (categoria = 'practica')
}

export interface PuertoRepositorioMalla {
  buscarPorCarrera(idCarrera: string, idUsuario: number): Promise<MallaCategorizada>;
  guardarEstadoAsignatura(
    idCarrera: string,
    asignatura: Asignatura,
    idUsuario: number,
  ): Promise<Asignatura>;
  limpiarProgreso(idCarrera: string, idUsuario: number): Promise<void>;
}
