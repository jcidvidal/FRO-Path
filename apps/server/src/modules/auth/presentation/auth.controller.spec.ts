import { RolUsuario } from '../domain/roles';
import { AuthController } from './auth.controller';
import type { RequestConUsuario } from './jwt-auth.guard';

describe('AuthController', () => {
  const authService = {
    login: jest.fn(),
    register: jest.fn(),
    asignarRolUsuario: jest.fn(),
  };
  let controlador: AuthController;

  beforeEach(() => {
    jest.clearAllMocks();
    controlador = new AuthController(authService as never);
  });

  it('login delega el cuerpo al servicio', () => {
    authService.login.mockReturnValue('respuesta-login');

    const resultado = controlador.login({ email: 'a@b.cl', password: 'Pass1234' });

    expect(resultado).toBe('respuesta-login');
    expect(authService.login).toHaveBeenCalledWith({ email: 'a@b.cl', password: 'Pass1234' });
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

    const resultado = controlador.asignarRol('5', { rol: RolUsuario.Profesor }, solicitud);

    expect(resultado).toBe('rol-asignado');
    expect(authService.asignarRolUsuario).toHaveBeenCalledWith({
      idUsuario: 5,
      rol: RolUsuario.Profesor,
      usuarioSolicitante: solicitud.user,
    });
  });
});
