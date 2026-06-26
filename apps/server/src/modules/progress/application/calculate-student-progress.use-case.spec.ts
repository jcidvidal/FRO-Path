import { NotFoundException } from '@nestjs/common';
import { Asignatura } from '../../mesh/domain/entities/course.entity';
import type { PuertoRepositorioMalla } from '../../mesh/domain/ports/mesh-repository.port';
import { EstadoAsignatura } from '../../mesh/domain/value-objects/course-status.vo';
import { EstrategiaProgresoSct } from '../domain/sct-progress.strategy';
import { CalcularProgresoEstudianteUseCase } from './calculate-student-progress.use-case';

const repositorioFake: jest.Mocked<PuertoRepositorioMalla> = {
  buscarPorCarrera: jest.fn(),
  guardarEstadoAsignatura: jest.fn(),
  limpiarProgreso: jest.fn(),
};

const estrategiaSct = new EstrategiaProgresoSct();

describe('CalcularProgresoEstudianteUseCase', () => {
  let casoDeUso: CalcularProgresoEstudianteUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    casoDeUso = new CalcularProgresoEstudianteUseCase(repositorioFake, estrategiaSct);
  });

  it('calcula porcentaje SCT correctamente segun asignaturas aprobadas', async () => {
    repositorioFake.buscarPorCarrera.mockResolvedValue({
      asignaturas: [
        new Asignatura({ id: '1', codigo: 'A', nombre: 'A', sct: 6, nivel: 1, estado: EstadoAsignatura.Aprobada, idsPrerequisitos: [] }),
        new Asignatura({ id: '2', codigo: 'B', nombre: 'B', sct: 4, nivel: 1, estado: EstadoAsignatura.Disponible, idsPrerequisitos: [] }),
      ],
      modulosIngles: [],
      practicas: [],
    });

    const resultado = await casoDeUso.ejecutar('icc', 1);

    expect(resultado.sctAprobados).toBe(6);
    expect(resultado.sctTotales).toBe(10);
    expect(resultado.porcentaje).toBe(60);
  });

  it('retorna progreso cero si ninguna asignatura esta aprobada', async () => {
    repositorioFake.buscarPorCarrera.mockResolvedValue({
      asignaturas: [
        new Asignatura({ id: '1', codigo: 'A', nombre: 'A', sct: 6, nivel: 1, estado: EstadoAsignatura.Disponible, idsPrerequisitos: [] }),
        new Asignatura({ id: '2', codigo: 'B', nombre: 'B', sct: 4, nivel: 1, estado: EstadoAsignatura.Bloqueada, idsPrerequisitos: ['1'] }),
      ],
      modulosIngles: [],
      practicas: [],
    });

    const resultado = await casoDeUso.ejecutar('icc', 1);

    expect(resultado.sctAprobados).toBe(0);
    expect(resultado.porcentaje).toBe(0);
  });

  it('lanza NotFoundException si la carrera no existe', async () => {
    repositorioFake.buscarPorCarrera.mockResolvedValue({ asignaturas: [], modulosIngles: [], practicas: [] });

    await expect(casoDeUso.ejecutar('no-existe', 1)).rejects.toThrow(NotFoundException);
  });
});
