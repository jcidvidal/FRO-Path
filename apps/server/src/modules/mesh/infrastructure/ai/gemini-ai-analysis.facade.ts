import { Logger } from '@nestjs/common';
import {
  EntradaAnalisisIa,
  PuertoAnalisisIa,
  ResultadoAnalisisIa,
} from '../../domain/ports/ai-analysis.port';

const URL_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

// Carga semestral de referencia (tiempo completo) en créditos SCT.
const SCT_CARGA_COMPLETA = 30;

// Descripción de cada carrera (nombre y sigla oficial) según el código de malla.
// La malla con código 'icc' corresponde a Ingeniería Civil Informática, cuya
// sigla oficial es ICI (no ICC); 'ii' corresponde a Ingeniería Informática (II).
const CARRERAS: Record<string, string> = {
  icc: 'Ingeniería Civil Informática (sigla ICI)',
  ii: 'Ingeniería Informática (sigla II)',
};

export function describirCarrera(idCarrera: string): string {
  return CARRERAS[idCarrera.toLowerCase()] ?? idCarrera;
}

// Esquema de salida estructurada (formato REST de la API de Gemini).
const ESQUEMA_RESPUESTA = {
  type: 'OBJECT',
  properties: {
    comentario: { type: 'STRING' },
  },
  required: ['comentario'],
};

interface RespuestaGemini {
  candidates?: { content?: { parts?: { text?: string }[] } }[];
}

export class FachadaAnalisisIaGemini implements PuertoAnalisisIa {
  private readonly logger = new Logger(FachadaAnalisisIaGemini.name);

  constructor(
    private readonly apiKey: string,
    private readonly modelo: string,
  ) {}

  async analizar(entrada: EntradaAnalisisIa): Promise<ResultadoAnalisisIa> {
    try {
      const respuesta = await fetch(
        `${URL_BASE}/${this.modelo}:generateContent`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': this.apiKey,
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: this.construirPrompt(entrada) }] }],
            generationConfig: {
              responseMimeType: 'application/json',
              responseSchema: ESQUEMA_RESPUESTA,
            },
          }),
        },
      );

      if (!respuesta.ok) {
        throw new Error(
          `Gemini respondió ${respuesta.status}: ${await respuesta.text()}`,
        );
      }

      const datos = (await respuesta.json()) as RespuestaGemini;
      return this.parsearRespuesta(datos);
    } catch (error) {
      this.logger.error(
        `Error al consultar Gemini: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );

      return {
        comentario:
          'No se pudo generar el análisis de tu carga académica en este momento. Intenta nuevamente más tarde.',
      };
    }
  }

  private construirPrompt(entrada: EntradaAnalisisIa): string {
    return [
      'Eres Bandurr-IA, un asistente académico que orienta a estudiantes universitarios sobre su carga académica semestral.',
      `El estudiante está viendo la malla de ${describirCarrera(entrada.idCarrera)}. Refiérete a la carrera siempre con esa sigla oficial.`,
      `El estudiante tiene ${entrada.cantidadEnCurso} asignatura(s) marcadas en curso para este semestre, que suman ${entrada.sctEnCurso} créditos SCT.`,
      `Ha aprobado ${entrada.sctAprobado} de ${entrada.sctTotal} créditos SCT de la carrera.`,
      `Una carga semestral de tiempo completo ronda los ${SCT_CARGA_COMPLETA} créditos SCT.`,
      `Su carga ya fue clasificada como ${entrada.nivelCarga.toUpperCase()}. No la recalcules ni la contradigas: explícala con tus palabras.`,
      entrada.nivelCarga === 'excesivo'
        ? 'Indícale con tacto que conviene reducir la carga este semestre.'
        : `Puede tomar hasta ${entrada.ramosAdicionalesSugeridos} asignatura(s) más sin sobrecargarse; menciónalo de forma orientativa.`,
      'Responde en español, con tono cercano y dirigido directamente al estudiante. No uses listas ni títulos: solo un comentario en prosa.',
    ].join('\n');
  }

  private parsearRespuesta(datos: RespuestaGemini): ResultadoAnalisisIa {
    const texto = datos.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!texto) {
      throw new Error('La respuesta de Gemini llegó vacía.');
    }

    const contenido = JSON.parse(texto) as Partial<ResultadoAnalisisIa>;

    return {
      comentario: contenido.comentario ?? '',
    };
  }
}
