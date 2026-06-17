import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { REPOSITORIO_MALLA } from '../../domain/ports/mesh-repository.port';
import type { PuertoRepositorioMalla } from '../../domain/ports/mesh-repository.port';

@Injectable()
export class ObtenerMallaUseCase {
  constructor(
    @Inject(REPOSITORIO_MALLA)
    private readonly repositorioMalla: PuertoRepositorioMalla,
  ) {}

  async ejecutar(idCarrera: string, idUsuario: number) {
    const asignaturas = await this.repositorioMalla.buscarPorCarrera(idCarrera, idUsuario);

    if (asignaturas.length === 0) {
      throw new NotFoundException(`La carrera ${idCarrera} no existe.`);
    }

    return {
      idCarrera,
      asignaturas: asignaturas.map((asignatura) => asignatura.aPrimitivos()),
    };
  }
}
