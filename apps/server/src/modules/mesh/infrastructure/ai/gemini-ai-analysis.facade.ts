import { Logger } from '@nestjs/common';
import {
  EntradaAnalisisIa,
  PuertoAnalisisIa,
  ResultadoAnalisisIa,
} from '../../domain/ports/ai-analysis.port';

const URL_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

// Esquema de salida estructurada (formato REST de la API de Gemini).
const ESQUEMA_RESPUESTA = {
  type: 'OBJECT',
  properties: {
    resumen: { type: 'STRING' },
    advertencias: { type: 'ARRAY', items: { type: 'STRING' } },
    recomendaciones: { type: 'ARRAY', items: { type: 'STRING' } },
  },
  required: ['resumen', 'advertencias', 'recomendaciones'],
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
        resumen:
          'No se pudo generar el análisis con la IA en este momento. Intenta nuevamente más tarde.',
        advertencias: [],
        recomendaciones: [],
      };
    }
  }

  private construirPrompt(entrada: EntradaAnalisisIa): string {
    return [
      'Eres un asistente académico que orienta a estudiantes universitarios sobre su carga curricular.',
      `Carrera: ${entrada.idCarrera}.`,
      `Asignaturas ya aprobadas (códigos): ${this.listar(entrada.idsAsignaturasAprobadas)}.`,
      `Asignaturas que el estudiante quiere cursar el próximo semestre (códigos): ${this.listar(
        entrada.idsAsignaturasSeleccionadas,
      )}.`,
      'Analiza si la selección es adecuada considerando la cantidad de ramos y la progresión esperada.',
      'Responde en español, con tono cercano y profesional, dirigido directamente al estudiante.',
      'Entrega un resumen breve, una lista de advertencias (vacía si no hay) y una lista de recomendaciones concretas.',
    ].join('\n');
  }

  private listar(ids: string[]): string {
    return ids.length > 0 ? ids.join(', ') : 'ninguna';
  }

  private parsearRespuesta(datos: RespuestaGemini): ResultadoAnalisisIa {
    const texto = datos.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!texto) {
      throw new Error('La respuesta de Gemini llegó vacía.');
    }

    const contenido = JSON.parse(texto) as Partial<ResultadoAnalisisIa>;

    return {
      resumen: contenido.resumen ?? '',
      advertencias: contenido.advertencias ?? [],
      recomendaciones: contenido.recomendaciones ?? [],
    };
  }
}
