import { RolUsuario } from '../../auth/domain/roles';
import { EstadoAsignatura } from '../domain/value-objects/course-status.vo';
import { MeshController } from './mesh.controller';
import type { RequestConUsuario } from '../../auth/presentation/jwt-auth.guard';

function solicitudConUsuario(id: number, rol: RolUsuario = RolUsuario.Estudiante): RequestConUsuario {
  return { user: { id, rol } } as RequestConUsuario;
}

describe('MeshController', () => {
  const obtenerMallaUseCase = { ejecutar: jest.fn() };
  const cambiarEstadoUseCase = { ejecutar: jest.fn() };
  const limpiarProgresoUseCase = { ejecutar: jest.fn() };
  const analizarCargaUseCase = { ejecutar: jest.fn() };

  let controlador: MeshController;

  beforeEach(() => {
    jest.clearAllMocks();
    controlador = new MeshController(
      obtenerMallaUseCase as never,
      cambiarEstadoUseCase as never,
      limpiarProgresoUseCase as never,
      analizarCargaUseCase as never,
    );
  });

  it('obtenerMalla delega con el idCarrera y el id del usuario autenticado', async () => {
    obtenerMallaUseCase.ejecutar.mockResolvedValue('malla');

    const resultado = await controlador.obtenerMalla('icc', solicitudConUsuario(7));

    expect(resultado).toBe('malla');
    expect(obtenerMallaUseCase.ejecutar).toHaveBeenCalledWith('icc', 7);
  });

  it('obtenerMalla oculta el avance curricular para usuarios que no son estudiantes', async () => {
    obtenerMallaUseCase.ejecutar.mockResolvedValue({
      asignaturas: [{ id: '1', estado: EstadoAsignatura.Aprobada }],
      modulosIngles: [{ id: '2', estado: EstadoAsignatura.Aprobada }],
      practicas: [{ id: '3', estado: EstadoAsignatura.Aprobada }],
    });

    const resultado = await controlador.obtenerMalla('icc', solicitudConUsuario(7, RolUsuario.Director));

    expect(resultado.asignaturas[0].estado).toBe(EstadoAsignatura.Disponible);
    expect(resultado.modulosIngles[0].estado).toBe(EstadoAsignatura.Disponible);
    expect(resultado.practicas[0].estado).toBe(EstadoAsignatura.Disponible);
  });

  it('cambiarEstadoAsignatura delega con los datos del cuerpo y el usuario', () => {
    cambiarEstadoUseCase.ejecutar.mockReturnValue('cambio');

    const resultado = controlador.cambiarEstadoAsignatura(
      'icc',
      { idAsignatura: 'ICC-001', estado: EstadoAsignatura.Aprobada },
      solicitudConUsuario(7),
    );

    expect(resultado).toBe('cambio');
    expect(cambiarEstadoUseCase.ejecutar).toHaveBeenCalledWith(
      'icc',
      'ICC-001',
      EstadoAsignatura.Aprobada,
      7,
    );
  });

  it('limpiarProgreso delega y retorna el mensaje de confirmacion', async () => {
    limpiarProgresoUseCase.ejecutar.mockResolvedValue(undefined);

    const resultado = await controlador.limpiarProgreso('icc', solicitudConUsuario(7));

    expect(resultado).toEqual({ mensaje: 'Progreso eliminado correctamente.' });
    expect(limpiarProgresoUseCase.ejecutar).toHaveBeenCalledWith('icc', 7);
  });

  it('analizarCargaMalla delega con el idCarrera y el id del usuario autenticado', () => {
    analizarCargaUseCase.ejecutar.mockReturnValue('analisis');

    const resultado = controlador.analizarCargaMalla('icc', solicitudConUsuario(7));

    expect(resultado).toBe('analisis');
    expect(analizarCargaUseCase.ejecutar).toHaveBeenCalledWith('icc', 7);
  });
});
