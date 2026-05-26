import { Injectable } from '@nestjs/common';
import {
  EntradaAnalisisIa,
  PuertoAnalisisIa,
  ResultadoAnalisisIa,
} from '../../domain/ports/ai-analysis.port';

@Injectable()
export class FachadaAnalisisIaEstatico implements PuertoAnalisisIa {
  analizar(entrada: EntradaAnalisisIa): Promise<ResultadoAnalisisIa> {
    return Promise.resolve({
      resumen: `Analisis placeholder para la carrera ${entrada.idCarrera}.`,
      advertencias: [],
      recomendaciones: [
        'Reemplazar FachadaAnalisisIaEstatico por un adaptador de OpenAI antes de produccion.',
      ],
    });
  }
}
