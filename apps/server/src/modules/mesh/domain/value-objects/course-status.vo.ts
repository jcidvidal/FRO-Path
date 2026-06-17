export enum EstadoAsignatura {
  Aprobada = 'aprobada',
  Reprobada = 'reprobada',
  EnCurso = 'en_curso',
  Bloqueada = 'bloqueada',
  Disponible = 'disponible',
}

export const ESTADOS_ASIGNATURA_ACTIVOS = [
  EstadoAsignatura.Aprobada,
  EstadoAsignatura.EnCurso,
] as const;
