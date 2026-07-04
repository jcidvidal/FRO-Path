import type { NivelCarga } from '../services/clasificar-carga-academica';

export const ANALISIS_IA = Symbol('ANALISIS_IA');

export interface EntradaAnalisisIa {
  idCarrera: string;
  sctEnCurso: number;
  cantidadEnCurso: number;
  sctAprobado: number;
  sctTotal: number;
  // Clasificación determinista calculada en el dominio. La IA solo la redacta,
  // no decide la categoría.
  nivelCarga: NivelCarga;
  ramosAdicionalesSugeridos: number;
}

export interface ResultadoAnalisisIa {
  comentario: string;
}

export interface PuertoAnalisisIa {
  analizar(entrada: EntradaAnalisisIa): Promise<ResultadoAnalisisIa>;
}
