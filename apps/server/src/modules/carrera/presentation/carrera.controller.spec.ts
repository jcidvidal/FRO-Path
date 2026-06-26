import { CarreraController } from './carrera.controller';
import { CarreraService } from '../application/carrera.service';
import { Carrera } from '../domain/carrera';

describe('CarreraController', () => {
  let controller: CarreraController;
  let carreraService: jest.Mocked<
    Pick<CarreraService, 'create' | 'findAll' | 'findOne' | 'update' | 'remove'>
  >;

  const carrera: Carrera = {
    id: 1,
    nombre: 'Ingeniería Informática',
    codigo_carrera: 'DIR: 3086',
  };

  beforeEach(() => {
    carreraService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };
    controller = new CarreraController(
      carreraService as unknown as CarreraService,
    );
  });

  it('create delega en el servicio y devuelve el ReadCarreraDto', async () => {
    carreraService.create.mockResolvedValue(carrera);

    const dto = {
      nombre: 'Ingeniería Informática',
      codigo_carrera: 'DIR: 3086',
    };
    const resultado = await controller.create(dto);

    expect(carreraService.create).toHaveBeenCalledWith(dto);
    expect(resultado).toEqual({
      id: 1,
      nombre: 'Ingeniería Informática',
      codigo_carrera: 'DIR: 3086',
    });
  });

  it('findAll mapea cada carrera a su ReadCarreraDto', async () => {
    carreraService.findAll.mockResolvedValue([
      carrera,
      { id: 2, nombre: 'Otra', codigo_carrera: 'DIR: 3087' },
    ]);

    const resultado = await controller.findAll();

    expect(resultado).toHaveLength(2);
    expect(resultado[1]).toEqual({
      id: 2,
      nombre: 'Otra',
      codigo_carrera: 'DIR: 3087',
    });
  });

  it('findOne devuelve la carrera encontrada', async () => {
    carreraService.findOne.mockResolvedValue(carrera);

    const resultado = await controller.findOne(1);

    expect(carreraService.findOne).toHaveBeenCalledWith(1);
    expect(resultado.codigo_carrera).toBe('DIR: 3086');
  });

  it('update delega en el servicio con el id y el body', async () => {
    const actualizada = { ...carrera, nombre: 'Nuevo nombre' };
    carreraService.update.mockResolvedValue(actualizada);

    const resultado = await controller.update(1, { nombre: 'Nuevo nombre' });

    expect(carreraService.update).toHaveBeenCalledWith(1, {
      nombre: 'Nuevo nombre',
    });
    expect(resultado.nombre).toBe('Nuevo nombre');
  });

  it('remove delega en el servicio', async () => {
    carreraService.remove.mockResolvedValue(undefined);

    await controller.remove(1);

    expect(carreraService.remove).toHaveBeenCalledWith(1);
  });
});
