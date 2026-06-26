// Clasificación determinista de la carga académica semestral.
//
// El criterio que manda es el NÚMERO DE RAMOS en curso. La suma de créditos
// SCT actúa solo como guardia de seguridad: puede elevar la carga a "excesivo"
// pero nunca rebaja la categoría que define el número de ramos.

export type NivelCarga = 'ligero' | 'equilibrado' | 'excesivo';

// A partir de este número de ramos (inclusive) la carga deja de ser ligera.
export const MIN_RAMOS_EQUILIBRADO = 4;

// Tope de ramos que aún se considera equilibrado. Superarlo es excesivo.
export const MAX_RAMOS_EQUILIBRADO = 5;

// Suma de créditos SCT que, al superarse, marca la carga como excesiva.
export const MAX_SCT_RECOMENDADO = 30;

export interface EntradaClasificacion {
  cantidadEnCurso: number;
  sctEnCurso: number;
}

export interface ResultadoClasificacion {
  nivel: NivelCarga;
  // Cantidad orientativa de asignaturas adicionales que aún podría tomar sin
  // pasarse del tope equilibrado. Es 0 cuando la carga ya es excesiva.
  ramosAdicionalesSugeridos: number;
}

export function clasificarCargaAcademica(
  entrada: EntradaClasificacion,
): ResultadoClasificacion {
  const { cantidadEnCurso, sctEnCurso } = entrada;

  const esExcesivo =
    cantidadEnCurso > MAX_RAMOS_EQUILIBRADO || sctEnCurso > MAX_SCT_RECOMENDADO;

  if (esExcesivo) {
    return { nivel: 'excesivo', ramosAdicionalesSugeridos: 0 };
  }

  const nivel: NivelCarga =
    cantidadEnCurso >= MIN_RAMOS_EQUILIBRADO ? 'equilibrado' : 'ligero';

  const ramosAdicionalesSugeridos = Math.max(
    0,
    MAX_RAMOS_EQUILIBRADO - cantidadEnCurso,
  );

  return { nivel, ramosAdicionalesSugeridos };
}
