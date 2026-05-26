import { Inject, Injectable } from '@nestjs/common';
import { REPOSITORIO_MALLA } from '../../domain/ports/mesh-repository.port';
import type { PuertoRepositorioMalla } from '../../domain/ports/mesh-repository.port';

@Injectable()
export class ObtenerMallaUseCase {
  constructor(
    @Inject(REPOSITORIO_MALLA)
    private readonly repositorioMalla: PuertoRepositorioMalla,
  ) {}

  async ejecutar(idCarrera: string) {
    const asignaturas = await this.repositorioMalla.buscarPorCarrera(idCarrera);

    return {
      idCarrera,
      asignaturas: asignaturas.map((asignatura) => asignatura.aPrimitivos()),
    };
  }
}
