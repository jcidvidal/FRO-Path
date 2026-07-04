import { RolUsuario } from '../domain/roles';
import { AuthController } from './auth.controller';
import type { RequestConUsuario } from './jwt-auth.guard';

describe('AuthController', () => {
  const authService = {
    login: jest.fn(),
    register: jest.fn(),
    asignarRolUsuario: jest.fn(),
    listarUsuarios: jest.fn(),
    eliminarEstudiante: jest.fn(),
  };
  let controlador: AuthController;

  beforeEach(() => {
    jest.clearAllMocks();
    controlador = new AuthController(authService as never);
  });

  it('login delega el cuerpo al servicio', () => {
    authService.login.mockReturnValue('respuesta-login');

    const resultado = controlador.login({
      email: 'a@b.cl',
      password: 'Pass1234',
    });

    expect(resultado).toBe('respuesta-login');
    expect(authService.login).toHaveBeenCalledWith({
      email: 'a@b.cl',
      password: 'Pass1234',
    });
  });

  it('register delega el cuerpo al servicio', () => {
    authService.register.mockReturnValue('respuesta-register');

    const cuerpo = { nombre: 'Nuevo', email: 'a@b.cl', password: 'Pass1234' };
    const resultado = controlador.register(cuerpo);

    expect(resultado).toBe('respuesta-register');
    expect(authService.register).toHaveBeenCalledWith(cuerpo);
  });

  it('asignarRol convierte el id a numero y propaga el usuario solicitante', () => {
    authService.asignarRolUsuario.mockReturnValue('rol-asignado');

    const solicitud = {
      user: { id: 1, email: 'admin@b.cl', rol: RolUsuario.Admin },
    } as RequestConUsuario;

    const resultado = controlador.asignarRol(
      '5',
      { rol: RolUsuario.Profesor },
      solicitud,
    );

    expect(resultado).toBe('rol-asignado');
    expect(authService.asignarRolUsuario).toHaveBeenCalledWith({
      idUsuario: 5,
      rol: RolUsuario.Profesor,
      usuarioSolicitante: solicitud.user,
    });
  });

  it('listarUsuarios propaga busqueda, rol y usuario solicitante', () => {
    authService.listarUsuarios.mockReturnValue('lista-usuarios');

    const solicitud = {
      user: { id: 1, email: 'admin@b.cl', rol: RolUsuario.Admin },
    } as RequestConUsuario;

    const resultado = controlador.listarUsuarios(
      'ana',
      RolUsuario.Profesor,
      solicitud,
    );

    expect(resultado).toBe('lista-usuarios');
    expect(authService.listarUsuarios).toHaveBeenCalledWith({
      busqueda: 'ana',
      rol: RolUsuario.Profesor,
      usuarioSolicitante: solicitud.user,
    });
  });

  it('eliminarUsuario convierte el id a numero y propaga el usuario solicitante', () => {
    authService.eliminarEstudiante.mockReturnValue('usuario-eliminado');

    const solicitud = {
      user: { id: 2, email: 'director@b.cl', rol: RolUsuario.Director },
    } as RequestConUsuario;

    const resultado = controlador.eliminarUsuario('7', solicitud);

    expect(resultado).toBe('usuario-eliminado');
    expect(authService.eliminarEstudiante).toHaveBeenCalledWith({
      idUsuario: 7,
      usuarioSolicitante: solicitud.user,
    });
  });
});
