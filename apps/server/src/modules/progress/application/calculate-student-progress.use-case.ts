import { Inject, Injectable, NotFoundException } from '@nestjs/common';
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

  async ejecutar(idCarrera: string, idUsuario: number) {
    const { asignaturas, modulosIngles, practicas } = await this.repositorioMalla.buscarPorCarrera(idCarrera, idUsuario);

    const todasLasAsignaturas = [...asignaturas, ...modulosIngles, ...practicas];

    if (todasLasAsignaturas.length === 0) {
      throw new NotFoundException(`La carrera ${idCarrera} no existe.`);
    }

    return this.estrategiaCalculo.calcular(todasLasAsignaturas).aPrimitivos();
  }
}
