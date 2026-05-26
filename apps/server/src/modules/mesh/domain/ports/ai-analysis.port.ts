export const ANALISIS_IA = Symbol('ANALISIS_IA');

export interface EntradaAnalisisIa {
  idCarrera: string;
  idsAsignaturasSeleccionadas: string[];
  idsAsignaturasAprobadas: string[];
}

export interface ResultadoAnalisisIa {
  resumen: string;
  advertencias: string[];
  recomendaciones: string[];
}

export interface PuertoAnalisisIa {
  analizar(entrada: EntradaAnalisisIa): Promise<ResultadoAnalisisIa>;
}
