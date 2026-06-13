import { JwtService } from '@nestjs/jwt';
import { hash } from 'bcrypt';
import { RolUsuario } from '../domain/roles';
import { AuthService } from './auth.service';
import { UsuariosRepository } from './users.repository';

describe('AuthService', () => {
  let usuariosRepository: jest.Mocked<
    Pick<UsuariosRepository, 'buscarPorEmail' | 'buscarPorId' | 'crear' | 'actualizarRol'>
  >;
  let jwtService: jest.Mocked<Pick<JwtService, 'sign'>>;
  let authService: AuthService;

  beforeEach(() => {
    usuariosRepository = {
      buscarPorEmail: jest.fn(),
      buscarPorId: jest.fn(),
      crear: jest.fn(),
      actualizarRol: jest.fn(),
    };
    jwtService = {
      sign: jest.fn().mockReturnValue('jwt-token'),
    };
    authService = new AuthService(
      usuariosRepository as UsuariosRepository,
      jwtService as JwtService,
    );
  });

  it('inicia sesion con email y password validos', async () => {
    usuariosRepository.buscarPorEmail.mockResolvedValue({
      id: 1,
      nombre: 'Estudiante',
      apellidoPaterno: 'Demo',
      apellidoMaterno: 'FROPath',
      email: 'estudiante@fro-path.local',
      rol: RolUsuario.Estudiante,
      passwordHash: await hash('Pass1234', 10),
    });

    const respuesta = await authService.login({
      email: 'estudiante@fro-path.local',
      password: 'Pass1234',
    });

    expect(respuesta.accessToken).toBe('jwt-token');
    expect(respuesta.tokenType).toBe('Bearer');
    expect(respuesta.expiresIn).toBe('1h');
    expect(respuesta.user.email).toBe('estudiante@fro-path.local');
    expect('passwordHash' in respuesta.user).toBe(false);
    expect(jwtService.sign).toHaveBeenCalledWith({
      sub: 1,
      email: 'estudiante@fro-path.local',
      rol: RolUsuario.Estudiante,
    });
  });

  it('rechaza credenciales invalidas', async () => {
    usuariosRepository.buscarPorEmail.mockResolvedValue(null);

    await expect(
      authService.login({
        email: 'nadie@fro-path.local',
        password: 'Pass1234',
      }),
    ).rejects.toThrow('Credenciales invalidas.');
  });

  it('registra estudiantes con password hasheada', async () => {
    usuariosRepository.buscarPorEmail.mockResolvedValue(null);
    usuariosRepository.crear.mockResolvedValue({
      id: 2,
      nombre: 'Nueva',
      apellidoPaterno: 'Estudiante',
      apellidoMaterno: 'Demo',
      email: 'nueva@fro-path.local',
      rol: RolUsuario.Estudiante,
    });

    const respuesta = await authService.register({
      nombre: 'Nueva',
      apellidoPaterno: 'Estudiante',
      apellidoMaterno: 'Demo',
      email: 'nueva@fro-path.local',
      password: 'Pass1234',
    });

    expect(respuesta.user.rol).toBe(RolUsuario.Estudiante);
    expect(usuariosRepository.crear).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'nueva@fro-path.local',
        rol: RolUsuario.Estudiante,
      }),
    );
    expect(usuariosRepository.crear.mock.calls[0][0].passwordHash).not.toBe(
      'Pass1234',
    );
  });

  it('rechaza registros con correo existente', async () => {
    usuariosRepository.buscarPorEmail.mockResolvedValue({
      id: 1,
      nombre: 'Estudiante',
      apellidoPaterno: 'Demo',
      apellidoMaterno: 'FROPath',
      email: 'estudiante@fro-path.local',
      rol: RolUsuario.Estudiante,
      passwordHash: await hash('Pass1234', 10),
    });

    await expect(
      authService.register({
        nombre: 'Estudiante',
        email: 'estudiante@fro-path.local',
        password: 'Pass1234',
      }),
    ).rejects.toThrow('El correo ya esta registrado.');
  });

  it('permite que un admin asigne rol profesor a un estudiante', async () => {
    usuariosRepository.buscarPorId.mockResolvedValue({
      id: 2,
      nombre: 'Estudiante',
      apellidoPaterno: 'Demo',
      apellidoMaterno: 'FROPath',
      email: 'estudiante@fro-path.local',
      rol: RolUsuario.Estudiante,
    });
    usuariosRepository.actualizarRol.mockResolvedValue({
      id: 2,
      nombre: 'Estudiante',
      apellidoPaterno: 'Demo',
      apellidoMaterno: 'FROPath',
      email: 'estudiante@fro-path.local',
      rol: RolUsuario.Profesor,
    });

    const respuesta = await authService.asignarRolUsuario({
      idUsuario: 2,
      rol: RolUsuario.Profesor,
      usuarioSolicitante: {
        id: 1,
        email: 'admin@fro-path.local',
        rol: RolUsuario.Admin,
      },
    });

    expect(respuesta.rol).toBe(RolUsuario.Profesor);
    expect(usuariosRepository.actualizarRol).toHaveBeenCalledWith(
      2,
      RolUsuario.Profesor,
    );
  });

  it('rechaza asignacion de rol si el solicitante no es admin', async () => {
    await expect(
      authService.asignarRolUsuario({
        idUsuario: 2,
        rol: RolUsuario.Director,
        usuarioSolicitante: {
          id: 2,
          email: 'estudiante@fro-path.local',
          rol: RolUsuario.Estudiante,
        },
      }),
    ).rejects.toThrow('Solo un administrador puede asignar roles.');
  });

  it('rechaza asignacion de roles distintos a profesor o director', async () => {
    await expect(
      authService.asignarRolUsuario({
        idUsuario: 2,
        rol: RolUsuario.Admin,
        usuarioSolicitante: {
          id: 1,
          email: 'admin@fro-path.local',
          rol: RolUsuario.Admin,
        },
      }),
    ).rejects.toThrow('Solo se puede asignar rol profesor o director.');
  });

  it('rechaza asignacion de rol a usuarios inexistentes', async () => {
    usuariosRepository.buscarPorId.mockResolvedValue(null);

    await expect(
      authService.asignarRolUsuario({
        idUsuario: 999,
        rol: RolUsuario.Director,
        usuarioSolicitante: {
          id: 1,
          email: 'admin@fro-path.local',
          rol: RolUsuario.Admin,
        },
      }),
    ).rejects.toThrow('El usuario 999 no existe.');
  });
});
