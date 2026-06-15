import { ConflictException, NotFoundException } from '@nestjs/common';
import { CarreraService } from './carrera.service';
import { CarreraRepository } from './carrera.repository';

describe('CarreraService', () => {
  let carreraRepository: jest.Mocked<
    Pick<
      CarreraRepository,
      | 'buscarPorId'
      | 'buscarPorCodigo'
      | 'crear'
      | 'buscarTodos'
      | 'actualizar'
      | 'eliminar'
    >
  >;
  let carreraService: CarreraService;

  beforeEach(() => {
    carreraRepository = {
      buscarPorId: jest.fn(),
      buscarPorCodigo: jest.fn(),
      buscarTodos: jest.fn(),
      crear: jest.fn(),
      actualizar: jest.fn(),
      eliminar: jest.fn(),
    };
    carreraService = new CarreraService(
      carreraRepository as unknown as CarreraRepository,
    );
  });

  it('crea una carrera exitosamente', async () => {
    carreraRepository.buscarPorCodigo.mockResolvedValue(null);
    carreraRepository.crear.mockResolvedValue({
      id: 1,
      nombre: 'Ingeniería Informática',
      codigo_carrera: 'DIR: 3086',
    });

    const resultado = await carreraService.create({
      nombre: 'Ingeniería Informática',
      codigo_carrera: 'DIR: 3086',
    });

    expect(resultado.codigo_carrera).toBe('DIR: 3086');
    expect(carreraRepository.crear).toHaveBeenCalledWith({
      nombre: 'Ingeniería Informática',
      codigo_carrera: 'DIR: 3086',
    });
  });

  it('rechaza crear si el codigo ya existe', async () => {
    carreraRepository.buscarPorCodigo.mockResolvedValue({
      id: 2,
      nombre: 'Ingeniería Civil Informática',
      codigo_carrera: 'DIR: 3087',
    });

    await expect(
      carreraService.create({ nombre: 'Nueva', codigo_carrera: 'DIR: 3087' }),
    ).rejects.toThrow(ConflictException);
  });

  it('arroja NotFound si la carrera no existe al buscar por ID', async () => {
    carreraRepository.buscarPorId.mockResolvedValue(null);

    await expect(carreraService.findOne(999)).rejects.toThrow(
      NotFoundException,
    );
  });
});
