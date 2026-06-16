import type { PuertoAnalisisIa } from '../../domain/ports/ai-analysis.port';
import { AnalizarCargaMallaUseCase } from './analyze-mesh-load.use-case';

describe('AnalizarCargaMallaUseCase', () => {
  it('delega la entrada al puerto de analisis de IA', async () => {
    const analisisIa: jest.Mocked<PuertoAnalisisIa> = {
      analizar: jest.fn().mockResolvedValue({
        resumen: 'ok',
        advertencias: [],
        recomendaciones: [],
      }),
    };
    const casoDeUso = new AnalizarCargaMallaUseCase(analisisIa);

    const entrada = {
      idCarrera: 'icc',
      idsAsignaturasSeleccionadas: ['A'],
      idsAsignaturasAprobadas: ['B'],
    };
    const resultado = await casoDeUso.ejecutar(entrada);

    expect(resultado.resumen).toBe('ok');
    expect(analisisIa.analizar).toHaveBeenCalledWith(entrada);
  });
});
