import { NotFoundException } from '@nestjs/common';
import { Asignatura } from '../../domain/entities/course.entity';
import type { PuertoRepositorioMalla } from '../../domain/ports/mesh-repository.port';
import { EstadoAsignatura } from '../../domain/value-objects/course-status.vo';
import { ObtenerMallaUseCase } from './get-mesh.use-case';

const asignaturaFake = new Asignatura({
  id: 'ICC-001',
  codigo: 'ICC-001',
  nombre: 'Programacion I',
  sct: 6,
  nivel: 1,
  estado: EstadoAsignatura.Disponible,
  idsPrerequisitos: [],
});

const repositorioFake: jest.Mocked<PuertoRepositorioMalla> = {
  buscarPorCarrera: jest.fn(),
  guardarEstadoAsignatura: jest.fn(),
  limpiarProgreso: jest.fn(),
};

describe('ObtenerMallaUseCase', () => {
  let casoDeUso: ObtenerMallaUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    casoDeUso = new ObtenerMallaUseCase(repositorioFake);
  });

  it('retorna la malla con asignaturas si la carrera existe', async () => {
    repositorioFake.buscarPorCarrera.mockResolvedValue({ asignaturas: [asignaturaFake], modulosIngles: [], practicas: [] });

    const resultado = await casoDeUso.ejecutar('icc', 1);

    expect(resultado.idCarrera).toBe('icc');
    expect(resultado.asignaturas).toHaveLength(1);
    expect(resultado.asignaturas[0].id).toBe('ICC-001');
    expect(repositorioFake.buscarPorCarrera).toHaveBeenCalledWith('icc', 1);
  });

  it('lanza NotFoundException si la carrera no tiene asignaturas', async () => {
    repositorioFake.buscarPorCarrera.mockResolvedValue({ asignaturas: [], modulosIngles: [], practicas: [] });

    await expect(casoDeUso.ejecutar('no-existe', 1)).rejects.toThrow(
      new NotFoundException('La carrera no-existe no existe.'),
    );
  });
});
