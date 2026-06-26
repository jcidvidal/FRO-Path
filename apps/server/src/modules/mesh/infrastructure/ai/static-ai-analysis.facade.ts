import { Injectable } from '@nestjs/common';
import {
  EntradaAnalisisIa,
  PuertoAnalisisIa,
  ResultadoAnalisisIa,
} from '../../domain/ports/ai-analysis.port';

@Injectable()
export class FachadaAnalisisIaEstatico implements PuertoAnalisisIa {
  analizar(entrada: EntradaAnalisisIa): Promise<ResultadoAnalisisIa> {
    const detalle =
      entrada.nivelCarga === 'excesivo'
        ? 'Conviene reducir la carga este semestre.'
        : `Podrías tomar hasta ${entrada.ramosAdicionalesSugeridos} asignatura(s) más.`;

    return Promise.resolve({
      comentario: `Tienes ${entrada.cantidadEnCurso} asignatura(s) en curso (${entrada.sctEnCurso} SCT). Tu carga es ${entrada.nivelCarga}. ${detalle} Configura GEMINI_API_KEY para recibir un análisis real de tu carga académica.`,
    });
  }
}
