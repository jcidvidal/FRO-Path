import type { PuertoRepositorioMalla } from '../../domain/ports/mesh-repository.port';
import { LimpiarProgresoUseCase } from './clear-progress.use-case';

const repositorioFake: jest.Mocked<PuertoRepositorioMalla> = {
  buscarPorCarrera: jest.fn(),
  guardarEstadoAsignatura: jest.fn(),
  limpiarProgreso: jest.fn(),
};

describe('LimpiarProgresoUseCase', () => {
  let casoDeUso: LimpiarProgresoUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    casoDeUso = new LimpiarProgresoUseCase(repositorioFake);
  });

  it('delega limpiarProgreso al repositorio con los parametros correctos', async () => {
    repositorioFake.limpiarProgreso.mockResolvedValue(undefined);

    await casoDeUso.ejecutar('icc', 42);

    expect(repositorioFake.limpiarProgreso).toHaveBeenCalledWith('icc', 42);
    expect(repositorioFake.limpiarProgreso).toHaveBeenCalledTimes(1);
  });
});
