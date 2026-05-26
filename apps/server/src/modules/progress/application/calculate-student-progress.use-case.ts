import { Inject, Injectable } from '@nestjs/common';
import { REPOSITORIO_MALLA } from '../../mesh/domain/ports/mesh-repository.port';
import type { PuertoRepositorioMalla } from '../../mesh/domain/ports/mesh-repository.port';
import { ESTRATEGIA_CALCULO_PROGRESO } from '../domain/calculation-strategy.port';
import type { EstrategiaCalculoProgreso } from '../domain/calculation-strategy.port';

@Injectable()
export class CalcularProgresoEstudianteUseCase {
  constructor(
    @Inject(REPOSITORIO_MALLA)
    private readonly repositorioMalla: PuertoRepositorioMalla,
    @Inject(ESTRATEGIA_CALCULO_PROGRESO)
    private readonly estrategiaCalculo: EstrategiaCalculoProgreso,
  ) {}

  async ejecutar(idCarrera: string) {
    const asignaturas = await this.repositorioMalla.buscarPorCarrera(idCarrera);
    return this.estrategiaCalculo.calcular(asignaturas).aPrimitivos();
  }
}
