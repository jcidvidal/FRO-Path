import { Inject, Injectable } from '@nestjs/common';
import { REPOSITORIO_MALLA } from '../../domain/ports/mesh-repository.port';
import type { PuertoRepositorioMalla } from '../../domain/ports/mesh-repository.port';

@Injectable()
export class LimpiarProgresoUseCase {
  constructor(
    @Inject(REPOSITORIO_MALLA)
    private readonly repositorioMalla: PuertoRepositorioMalla,
  ) {}

  async ejecutar(idCarrera: string, idUsuario: number): Promise<void> {
    await this.repositorioMalla.limpiarProgreso(idCarrera, idUsuario);
  }
}
