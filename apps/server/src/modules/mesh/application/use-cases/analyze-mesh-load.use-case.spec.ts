import { NotFoundException } from '@nestjs/common';
import { Asignatura } from '../../domain/entities/course.entity';
import type { PuertoAnalisisIa } from '../../domain/ports/ai-analysis.port';
import type { PuertoRepositorioMalla } from '../../domain/ports/mesh-repository.port';
import { EstadoAsignatura } from '../../domain/value-objects/course-status.vo';
import { AnalizarCargaMallaUseCase } from './analyze-mesh-load.use-case';

function crearAsignatura(
  id: string,
  sct: number,
  estado: EstadoAsignatura,
): Asignatura {
  return new Asignatura({
    id,
    codigo: id,
    nombre: id,
    sct,
    nivel: 1,
    estado,
    idsPrerequisitos: [],
  });
}

describe('AnalizarCargaMallaUseCase', () => {
  function crear(asignaturas: Asignatura[]) {
    const analisisIa: jest.Mocked<PuertoAnalisisIa> = {
      analizar: jest.fn().mockResolvedValue({ comentario: 'ok' }),
    };
    const repositorio: jest.Mocked<PuertoRepositorioMalla> = {
      buscarPorCarrera: jest.fn().mockResolvedValue(asignaturas),
      guardarEstadoAsignatura: jest.fn(),
      limpiarProgreso: jest.fn(),
    };
    const casoDeUso = new AnalizarCargaMallaUseCase(analisisIa, repositorio);
    return { analisisIa, repositorio, casoDeUso };
  }

  it('calcula el desglose desde la malla y delega la clasificación a la IA', async () => {
    const { analisisIa, repositorio, casoDeUso } = crear([
      crearAsignatura('A', 7, EstadoAsignatura.EnCurso),
      crearAsignatura('B', 7, EstadoAsignatura.EnCurso),
      crearAsignatura('C', 6, EstadoAsignatura.EnCurso),
      crearAsignatura('D', 5, EstadoAsignatura.Aprobada),
      crearAsignatura('E', 5, EstadoAsignatura.Disponible),
    ]);

    const resultado = await casoDeUso.ejecutar('icc', 42);

    expect(resultado.comentario).toBe('ok');
    expect(repositorio.buscarPorCarrera).toHaveBeenCalledWith('icc', 42);
    expect(analisisIa.analizar).toHaveBeenCalledWith({
      idCarrera: 'icc',
      sctEnCurso: 20,
      cantidadEnCurso: 3,
      sctAprobado: 5,
      sctTotal: 30,
      nivelCarga: 'ligero',
      ramosAdicionalesSugeridos: 2,
    });
  });

  it('marca como excesiva una carga de más de 5 ramos', async () => {
    const enCurso = Array.from({ length: 6 }, (_, i) =>
      crearAsignatura(`R${i}`, 4, EstadoAsignatura.EnCurso),
    );
    const { analisisIa, casoDeUso } = crear(enCurso);

    await casoDeUso.ejecutar('icc', 1);

    expect(analisisIa.analizar).toHaveBeenCalledWith(
      expect.objectContaining({
        nivelCarga: 'excesivo',
        ramosAdicionalesSugeridos: 0,
      }),
    );
  });

  it('lanza NotFoundException si la carrera no existe', async () => {
    const { casoDeUso } = crear([]);

    await expect(casoDeUso.ejecutar('inexistente', 1)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
