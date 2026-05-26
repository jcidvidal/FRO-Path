export enum EstadoAsignatura {
  Aprobada = 'aprobada',
  Reprobada = 'reprobada',
  EnCurso = 'en_curso',
  Bloqueada = 'bloqueada',
  Disponible = 'disponible',
}

export interface AsignaturaDto {
  id: string;
  codigo: string;
  nombre: string;
  sct: number;
  nivel: number;
  estado: EstadoAsignatura;
  idsPrerequisitos: string[];
}

export interface MallaDto {
  idCarrera: string;
  asignaturas: AsignaturaDto[];
}

export interface CambiarEstadoAsignaturaRequestDto {
  idAsignatura: string;
  estado: EstadoAsignatura;
}

export interface EstadisticasProgresoDto {
  sctAprobados: number;
  sctTotales: number;
  porcentaje: number;
}

export interface SolicitudAnalisisIaDto {
  idCarrera: string;
  idsAsignaturasSeleccionadas: string[];
  idsAsignaturasAprobadas: string[];
}

export interface RespuestaAnalisisIaDto {
  resumen: string;
  advertencias: string[];
  recomendaciones: string[];
}
