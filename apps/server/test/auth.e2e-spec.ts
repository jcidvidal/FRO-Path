import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { hash } from 'bcrypt';
import request from 'supertest';
import type { App } from 'supertest/types';
import { UsuariosRepository } from '../src/modules/auth/application/users.repository';
import { RolUsuario } from '../src/modules/auth/domain/roles';
import { AuthModule } from '../src/modules/auth/auth.module';

describe('Auth (e2e)', () => {
  let app: INestApplication<App>;
  let mockUsuariosRepository: jest.Mocked<
    Pick<UsuariosRepository, 'buscarPorEmail' | 'buscarPorId' | 'crear' | 'actualizarRol'>
  >;
  let passwordHash: string;

  beforeAll(async () => {
    passwordHash = await hash('Pass1234', 10);

    mockUsuariosRepository = {
      buscarPorEmail: jest.fn(),
      buscarPorId: jest.fn(),
      crear: jest.fn(),
      actualizarRol: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      imports: [AuthModule],
    })
      .overrideProvider(UsuariosRepository)
      .useValue(mockUsuariosRepository)
      .compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /auth/login', () => {
    it('retorna 201 con token y datos del usuario al iniciar sesion correctamente', async () => {
      mockUsuariosRepository.buscarPorEmail.mockResolvedValue({
        id: 1,
        nombre: 'Estudiante',
        apellidoPaterno: 'Demo',
        apellidoMaterno: 'FROPath',
        email: 'estudiante@fro-path.local',
        rol: RolUsuario.Estudiante,
        passwordHash,
      });

      const respuesta = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'estudiante@fro-path.local', password: 'Pass1234' })
        .expect(201);

      expect(respuesta.body.accessToken).toBeDefined();
      expect(respuesta.body.tokenType).toBe('Bearer');
      expect(respuesta.body.user.email).toBe('estudiante@fro-path.local');
      expect(respuesta.body.user.passwordHash).toBeUndefined();
    });

    it('retorna 401 con credenciales invalidas', async () => {
      mockUsuariosRepository.buscarPorEmail.mockResolvedValue(null);

      await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'nadie@fro-path.local', password: 'Pass1234' })
        .expect(401);
    });

    it('retorna 400 si el body esta incompleto', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'solo@email.cl' })
        .expect(400);
    });
  });

  describe('POST /auth/register', () => {
    it('retorna 201 con token al registrar un nuevo usuario', async () => {
      mockUsuariosRepository.buscarPorEmail.mockResolvedValue(null);
      mockUsuariosRepository.crear.mockResolvedValue({
        id: 2,
        nombre: 'Nuevo',
        apellidoPaterno: 'Usuario',
        apellidoMaterno: 'Test',
        email: 'nuevo@test.cl',
        rol: RolUsuario.Estudiante,
      });

      const respuesta = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          nombre: 'Nuevo',
          apellidoPaterno: 'Usuario',
          apellidoMaterno: 'Test',
          email: 'nuevo@test.cl',
          password: 'Pass1234',
        })
        .expect(201);

      expect(respuesta.body.accessToken).toBeDefined();
      expect(respuesta.body.user.email).toBe('nuevo@test.cl');
    });

    it('retorna 409 si el correo ya esta registrado', async () => {
      mockUsuariosRepository.buscarPorEmail.mockResolvedValue({
        id: 1,
        nombre: 'Existente',
        apellidoPaterno: 'Demo',
        apellidoMaterno: 'FROPath',
        email: 'existente@test.cl',
        rol: RolUsuario.Estudiante,
        passwordHash,
      });

      await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          nombre: 'Otro',
          email: 'existente@test.cl',
          password: 'Pass1234',
        })
        .expect(409);
    });
  });

  describe('Rutas protegidas', () => {
    it('retorna 401 al acceder a una ruta protegida sin JWT', async () => {
      await request(app.getHttpServer())
        .patch('/auth/usuarios/2/rol')
        .send({ rol: RolUsuario.Profesor })
        .expect(401);
    });
  });
});
