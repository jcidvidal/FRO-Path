import { obtenerDataSourceFroPath } from '../../mesh/infrastructure/persistence/postgres/postgres-data-source';
import { CarreraRepository } from './carrera.repository';

jest.mock(
  '../../mesh/infrastructure/persistence/postgres/postgres-data-source',
);

/**
 * Pruebas unitarias del repositorio de carreras.
 *
 * Se reemplaza el DataSource de TypeORM por un doble para verificar el mapeo
 * entre el registro de la base de datos (campo `codigo`) y el modelo de dominio
 * (campo `codigo_carrera`) sin depender de una base de datos real.
 */
describe('CarreraRepository', () => {
  let repositorio: CarreraRepository;
  let typeOrmRepo: {
    find: jest.Mock;
    findOne: jest.Mock;
    findOneOrFail: jest.Mock;
    save: jest.Mock;
    delete: jest.Mock;
  };

  beforeEach(() => {
    jest.clearAllMocks();
    typeOrmRepo = {
      find: jest.fn(),
      findOne: jest.fn(),
      findOneOrFail: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };
    (obtenerDataSourceFroPath as jest.Mock).mockResolvedValue({
      getRepository: () => typeOrmRepo,
    });
    repositorio = new CarreraRepository();
  });

  it('buscarTodos mapea cada registro al modelo de dominio', async () => {
    typeOrmRepo.find.mockResolvedValue([
      { id: 1, nombre: 'A', codigo: 'DIR: 1' },
    ]);

    const carreras = await repositorio.buscarTodos();

    expect(carreras).toEqual([{ id: 1, nombre: 'A', codigo_carrera: 'DIR: 1' }]);
  });

  it('buscarPorId devuelve la carrera mapeada cuando existe', async () => {
    typeOrmRepo.findOne.mockResolvedValue({ id: 2, nombre: 'B', codigo: 'DIR: 2' });

    await expect(repositorio.buscarPorId(2)).resolves.toEqual({
      id: 2,
      nombre: 'B',
      codigo_carrera: 'DIR: 2',
    });
  });

  it('buscarPorId devuelve null cuando no existe', async () => {
    typeOrmRepo.findOne.mockResolvedValue(null);

    await expect(repositorio.buscarPorId(99)).resolves.toBeNull();
  });

  it('buscarPorCodigo consulta por el campo codigo', async () => {
    typeOrmRepo.findOne.mockResolvedValue({ id: 3, nombre: 'C', codigo: 'DIR: 3' });

    const carrera = await repositorio.buscarPorCodigo('DIR: 3');

    expect(carrera?.codigo_carrera).toBe('DIR: 3');
  });

  it('buscarPorCodigo devuelve null cuando no existe', async () => {
    typeOrmRepo.findOne.mockResolvedValue(null);

    await expect(repositorio.buscarPorCodigo('DIR: X')).resolves.toBeNull();
  });

  it('crear persiste y devuelve la carrera mapeada', async () => {
    typeOrmRepo.save.mockResolvedValue({ id: 4, nombre: 'D', codigo: 'DIR: 4' });

    const carrera = await repositorio.crear({
      nombre: 'D',
      codigo_carrera: 'DIR: 4',
    });

    expect(typeOrmRepo.save).toHaveBeenCalledWith({
      nombre: 'D',
      codigo: 'DIR: 4',
    });
    expect(carrera).toEqual({ id: 4, nombre: 'D', codigo_carrera: 'DIR: 4' });
  });

  it('actualizar modifica solo los campos provistos', async () => {
    typeOrmRepo.findOneOrFail.mockResolvedValue({
      id: 5,
      nombre: 'Viejo',
      codigo: 'DIR: 5',
    });
    typeOrmRepo.save.mockImplementation((c: unknown) => Promise.resolve(c));

    const carrera = await repositorio.actualizar(5, { nombre: 'Nuevo' });

    expect(carrera.nombre).toBe('Nuevo');
    expect(carrera.codigo_carrera).toBe('DIR: 5');
  });

  it('actualizar cambia el código cuando se provee', async () => {
    typeOrmRepo.findOneOrFail.mockResolvedValue({
      id: 6,
      nombre: 'E',
      codigo: 'DIR: 6',
    });
    typeOrmRepo.save.mockImplementation((c: unknown) => Promise.resolve(c));

    const carrera = await repositorio.actualizar(6, { codigo_carrera: 'DIR: 60' });

    expect(carrera.codigo_carrera).toBe('DIR: 60');
  });

  it('eliminar delega en el repositorio de TypeORM', async () => {
    typeOrmRepo.delete.mockResolvedValue({ affected: 1 });

    await repositorio.eliminar(7);

    expect(typeOrmRepo.delete).toHaveBeenCalledWith(7);
  });

  it('reutiliza el DataSource entre llamadas (no lo recrea)', async () => {
    typeOrmRepo.find.mockResolvedValue([]);

    await repositorio.buscarTodos();
    await repositorio.buscarTodos();

    expect(obtenerDataSourceFroPath as jest.Mock).toHaveBeenCalledTimes(1);
  });
});
