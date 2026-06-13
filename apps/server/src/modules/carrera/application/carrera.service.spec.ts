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
      id: 'uuid-1',
      nombre: 'Ingenieria Informatica',
      codigo_carrera: 'ICC706',
    });

    const resultado = await carreraService.create({
      nombre: 'Ingenieria Informatica',
      codigo_carrera: 'ICC706',
    });

    expect(resultado.codigo_carrera).toBe('ICC706');
    expect(carreraRepository.crear).toHaveBeenCalledWith({
      nombre: 'Ingenieria Informatica',
      codigo_carrera: 'ICC706',
    });
  });

  it('rechaza crear si el codigo ya existe', async () => {
    carreraRepository.buscarPorCodigo.mockResolvedValue({
      id: 'uuid-existente',
      nombre: 'Otra Carrera',
      codigo_carrera: 'ICC706',
    });

    await expect(
      carreraService.create({ nombre: 'Nueva', codigo_carrera: 'ICC706' }),
    ).rejects.toThrow(ConflictException);
  });

  it('arroja NotFound si la carrera no existe al buscar por ID', async () => {
    carreraRepository.buscarPorId.mockResolvedValue(null);

    await expect(carreraService.findOne('uuid-falso')).rejects.toThrow(
      NotFoundException,
    );
  });
});
