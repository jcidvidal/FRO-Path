import { Inject, Injectable } from '@nestjs/common';
import { ANALISIS_IA } from '../../domain/ports/ai-analysis.port';
import type {
  EntradaAnalisisIa,
  PuertoAnalisisIa,
} from '../../domain/ports/ai-analysis.port';

@Injectable()
export class AnalizarCargaMallaUseCase {
  constructor(
    @Inject(ANALISIS_IA)
    private readonly analisisIa: PuertoAnalisisIa,
  ) {}

  ejecutar(entrada: EntradaAnalisisIa) {
    return this.analisisIa.analizar(entrada);
  }
}
