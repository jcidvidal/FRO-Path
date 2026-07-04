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

  it('findAll devuelve todas las carreras', async () => {
    const carreras = [
      { id: 1, nombre: 'A', codigo_carrera: 'DIR: 1' },
      { id: 2, nombre: 'B', codigo_carrera: 'DIR: 2' },
    ];
    carreraRepository.buscarTodos.mockResolvedValue(carreras);

    await expect(carreraService.findAll()).resolves.toEqual(carreras);
  });

  it('findOne devuelve la carrera cuando existe', async () => {
    const carrera = { id: 1, nombre: 'A', codigo_carrera: 'DIR: 1' };
    carreraRepository.buscarPorId.mockResolvedValue(carrera);

    await expect(carreraService.findOne(1)).resolves.toEqual(carrera);
  });

  describe('update', () => {
    const existente = { id: 1, nombre: 'A', codigo_carrera: 'DIR: 1' };

    it('actualiza cuando la carrera existe y el código no cambia', async () => {
      carreraRepository.buscarPorId.mockResolvedValue(existente);
      carreraRepository.actualizar.mockResolvedValue({
        ...existente,
        nombre: 'A modificada',
      });

      const resultado = await carreraService.update(1, {
        nombre: 'A modificada',
      });

      expect(resultado.nombre).toBe('A modificada');
      expect(carreraRepository.buscarPorCodigo).not.toHaveBeenCalled();
    });

    it('permite actualizar el código si pertenece a la misma carrera', async () => {
      carreraRepository.buscarPorId.mockResolvedValue(existente);
      carreraRepository.buscarPorCodigo.mockResolvedValue(existente);
      carreraRepository.actualizar.mockResolvedValue({
        ...existente,
        codigo_carrera: 'DIR: 1',
      });

      await expect(
        carreraService.update(1, { codigo_carrera: 'DIR: 1' }),
      ).resolves.toBeDefined();
    });

    it('rechaza si el nuevo código pertenece a otra carrera', async () => {
      carreraRepository.buscarPorId.mockResolvedValue(existente);
      carreraRepository.buscarPorCodigo.mockResolvedValue({
        id: 2,
        nombre: 'Otra',
        codigo_carrera: 'DIR: 9',
      });

      await expect(
        carreraService.update(1, { codigo_carrera: 'DIR: 9' }),
      ).rejects.toThrow(ConflictException);
    });

    it('arroja NotFound si la carrera a actualizar no existe', async () => {
      carreraRepository.buscarPorId.mockResolvedValue(null);

      await expect(
        carreraService.update(999, { nombre: 'X' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('elimina cuando la carrera existe', async () => {
      carreraRepository.buscarPorId.mockResolvedValue({
        id: 1,
        nombre: 'A',
        codigo_carrera: 'DIR: 1',
      });
      carreraRepository.eliminar.mockResolvedValue(undefined);

      await carreraService.remove(1);

      expect(carreraRepository.eliminar).toHaveBeenCalledWith(1);
    });

    it('arroja NotFound si la carrera a eliminar no existe', async () => {
      carreraRepository.buscarPorId.mockResolvedValue(null);

      await expect(carreraService.remove(999)).rejects.toThrow(
        NotFoundException,
      );
      expect(carreraRepository.eliminar).not.toHaveBeenCalled();
    });
  });
});
