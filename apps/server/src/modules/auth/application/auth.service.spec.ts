import { JwtService } from '@nestjs/jwt';
import { hash } from 'bcrypt';
import { RolUsuario } from '../domain/roles';
import { AuthService } from './auth.service';
import { UsuariosRepository } from './users.repository';

describe('AuthService', () => {
  let usuariosRepository: jest.Mocked<
    Pick<
      UsuariosRepository,
      | 'buscarPorEmail'
      | 'buscarPorId'
      | 'crear'
      | 'actualizarRol'
      | 'buscarUsuarios'
      | 'eliminar'
    >
  >;
  let jwtService: jest.Mocked<Pick<JwtService, 'sign'>>;
  let authService: AuthService;

  beforeEach(() => {
    usuariosRepository = {
      buscarPorEmail: jest.fn(),
      buscarPorId: jest.fn(),
      crear: jest.fn(),
      actualizarRol: jest.fn(),
      buscarUsuarios: jest.fn(),
      eliminar: jest.fn(),
    };
    jwtService = {
      sign: jest.fn().mockReturnValue('jwt-token'),
    };
    authService = new AuthService(
      usuariosRepository as unknown as UsuariosRepository,
      jwtService as unknown as JwtService,
    );
  });

  // ─── login ────────────────────────────────────────────────────────────────
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

  it('rechaza credenciales cuando la password no coincide con el hash', async () => {
    usuariosRepository.buscarPorEmail.mockResolvedValue({
      id: 1,
      nombre: 'Estudiante',
      apellidoPaterno: 'Demo',
      apellidoMaterno: 'FROPath',
      email: 'estudiante@fro-path.local',
      rol: RolUsuario.Estudiante,
      passwordHash: await hash('OtraPass', 10),
    });

    await expect(
      authService.login({
        email: 'estudiante@fro-path.local',
        password: 'Pass1234',
      }),
    ).rejects.toThrow('Credenciales invalidas.');
  });

  it('rechaza login si el email esta vacio', async () => {
    await expect(
      authService.login({ email: '   ', password: 'Pass1234' }),
    ).rejects.toThrow('El email es obligatorio.');
  });

  it('rechaza login si la password tiene menos de 6 caracteres', async () => {
    await expect(
      authService.login({ email: 'test@test.cl', password: '123' }),
    ).rejects.toThrow('La contrasena debe tener al menos 6 caracteres.');
  });

  // ─── register ─────────────────────────────────────────────────────────────
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

  it('rechaza registro si el nombre esta vacio o solo tiene espacios', async () => {
    usuariosRepository.buscarPorEmail.mockResolvedValue(null);

    await expect(
      authService.register({
        nombre: '   ',
        email: 'test@fro-path.local',
        password: 'Pass1234',
      }),
    ).rejects.toThrow('El nombre es obligatorio.');
  });

  it('rechaza registro si el email esta vacio', async () => {
    await expect(
      authService.register({ nombre: 'Test', email: '', password: 'Pass1234' }),
    ).rejects.toThrow('El email es obligatorio.');
  });

  it('rechaza registro si la password tiene menos de 6 caracteres', async () => {
    await expect(
      authService.register({ nombre: 'Test', email: 'test@test.cl', password: '123' }),
    ).rejects.toThrow('La contrasena debe tener al menos 6 caracteres.');
  });

  it('usa apellido por defecto si los apellidos son omitidos', async () => {
    usuariosRepository.buscarPorEmail.mockResolvedValue(null);
    usuariosRepository.crear.mockResolvedValue({
      id: 3,
      nombre: 'Solo',
      apellidoPaterno: 'Sin apellido',
      apellidoMaterno: 'Sin apellido',
      email: 'solo@fro-path.local',
      rol: RolUsuario.Estudiante,
    });

    await authService.register({
      nombre: 'Solo',
      email: 'solo@fro-path.local',
      password: 'Pass1234',
    });

    expect(usuariosRepository.crear).toHaveBeenCalledWith(
      expect.objectContaining({
        apellidoPaterno: 'Sin apellido',
        apellidoMaterno: 'Sin apellido',
      }),
    );
  });

  // ─── asignarRolUsuario ────────────────────────────────────────────────────
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

  it('rechaza asignacion cuando no hay usuario solicitante', async () => {
    await expect(
      authService.asignarRolUsuario({
        idUsuario: 2,
        rol: RolUsuario.Profesor,
        usuarioSolicitante: undefined,
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

  it('rechaza asignacion de rol si el id de usuario es cero o negativo', async () => {
    await expect(
      authService.asignarRolUsuario({
        idUsuario: 0,
        rol: RolUsuario.Profesor,
        usuarioSolicitante: {
          id: 1,
          email: 'admin@fro-path.local',
          rol: RolUsuario.Admin,
        },
      }),
    ).rejects.toThrow('El id de usuario no es valido.');

    await expect(
      authService.asignarRolUsuario({
        idUsuario: -5,
        rol: RolUsuario.Profesor,
        usuarioSolicitante: {
          id: 1,
          email: 'admin@fro-path.local',
          rol: RolUsuario.Admin,
        },
      }),
    ).rejects.toThrow('El id de usuario no es valido.');
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

  it('permite que un admin liste usuarios de los roles gestionables', async () => {
    usuariosRepository.buscarUsuarios.mockResolvedValue([]);

    await authService.listarUsuarios({
      busqueda: 'ana',
      usuarioSolicitante: {
        id: 1,
        email: 'admin@fro-path.local',
        rol: RolUsuario.Admin,
      },
    });

    expect(usuariosRepository.buscarUsuarios).toHaveBeenCalledWith({
      busqueda: 'ana',
      roles: [RolUsuario.Estudiante, RolUsuario.Profesor, RolUsuario.Director],
    });
  });

  it('filtra el listado por rol cuando el admin lo indica', async () => {
    usuariosRepository.buscarUsuarios.mockResolvedValue([]);

    await authService.listarUsuarios({
      rol: RolUsuario.Profesor,
      usuarioSolicitante: {
        id: 1,
        email: 'admin@fro-path.local',
        rol: RolUsuario.Admin,
      },
    });

    expect(usuariosRepository.buscarUsuarios).toHaveBeenCalledWith({
      busqueda: undefined,
      roles: [RolUsuario.Profesor],
    });
  });

  it('rechaza el listado de usuarios si el solicitante no es admin', async () => {
    await expect(
      authService.listarUsuarios({
        usuarioSolicitante: {
          id: 2,
          email: 'director@fro-path.local',
          rol: RolUsuario.Director,
        },
      }),
    ).rejects.toThrow('Solo un administrador puede listar usuarios.');
  });

  it('permite que un director elimine a un estudiante', async () => {
    usuariosRepository.buscarPorId.mockResolvedValue({
      id: 3,
      nombre: 'Estudiante',
      apellidoPaterno: 'Demo',
      apellidoMaterno: 'FROPath',
      email: 'estudiante@fro-path.local',
      rol: RolUsuario.Estudiante,
    });

    const resultado = await authService.eliminarEstudiante({
      idUsuario: 3,
      usuarioSolicitante: {
        id: 2,
        email: 'director@fro-path.local',
        rol: RolUsuario.Director,
      },
    });

    expect(resultado).toEqual({ id: 3 });
    expect(usuariosRepository.eliminar).toHaveBeenCalledWith(3);
  });

  it('rechaza eliminar a usuarios que no son estudiantes', async () => {
    usuariosRepository.buscarPorId.mockResolvedValue({
      id: 4,
      nombre: 'Profesor',
      apellidoPaterno: 'Demo',
      apellidoMaterno: 'FROPath',
      email: 'profesor@fro-path.local',
      rol: RolUsuario.Profesor,
    });

    await expect(
      authService.eliminarEstudiante({
        idUsuario: 4,
        usuarioSolicitante: {
          id: 2,
          email: 'director@fro-path.local',
          rol: RolUsuario.Director,
        },
      }),
    ).rejects.toThrow('Solo se puede eliminar a un estudiante.');
    expect(usuariosRepository.eliminar).not.toHaveBeenCalled();
  });

  it('rechaza que un estudiante elimine a otros usuarios', async () => {
    await expect(
      authService.eliminarEstudiante({
        idUsuario: 3,
        usuarioSolicitante: {
          id: 5,
          email: 'otro@fro-path.local',
          rol: RolUsuario.Estudiante,
        },
      }),
    ).rejects.toThrow(
      'Solo un director o administrador puede eliminar estudiantes.',
    );
  });
});
