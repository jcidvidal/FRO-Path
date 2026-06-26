import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import type { App } from 'supertest/types';
import { UsuariosRepository } from '../src/modules/auth/application/users.repository';
import { RolUsuario } from '../src/modules/auth/domain/roles';
import { REPOSITORIO_MALLA } from '../src/modules/mesh/domain/ports/mesh-repository.port';
import { RepositorioMallaEnMemoria } from '../src/modules/mesh/infrastructure/persistence/in-memory-mesh.repository';
import { ProgressModule } from '../src/modules/progress/progress.module';

/**
 * Pruebas de integración del módulo de progreso.
 *
 * Se levanta ProgressModule completo (controller + caso de uso + estrategia
 * SCT + guard JWT) y se entra por HTTP. La malla se sirve desde el repositorio
 * en memoria (carrera "informatica" con dos asignaturas de 6 SCT cada una,
 * ninguna aprobada), de modo que el progreso esperado es 0 de 12 SCT.
 */
describe('Progress (integración)', () => {
  let app: INestApplication<App>;
  let jwtValido: string;

  const mockUsuariosRepository = {
    buscarPorEmail: jest.fn(),
    buscarPorId: jest.fn(),
    crear: jest.fn(),
    actualizarRol: jest.fn(),
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true, ignoreEnvFile: true }),
        ProgressModule,
      ],
    })
      .overrideProvider(UsuariosRepository)
      .useValue(mockUsuariosRepository)
      .overrideProvider(REPOSITORIO_MALLA)
      .useClass(RepositorioMallaEnMemoria)
      .compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();

    const jwtService = moduleRef.get(JwtService);
    jwtValido = jwtService.sign({
      sub: 1,
      email: 'estudiante@fro-path.local',
      rol: RolUsuario.Estudiante,
    });
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /progress/:idCarrera', () => {
    it('retorna 200 con las estadísticas de progreso de la carrera', async () => {
      const respuesta = await request(app.getHttpServer())
        .get('/progress/informatica')
        .set('Authorization', `Bearer ${jwtValido}`)
        .expect(200);

      expect(respuesta.body).toEqual({
        sctAprobados: 0,
        sctTotales: 12,
        porcentaje: 0,
      });
    });

    it('retorna 404 si la carrera no existe', async () => {
      await request(app.getHttpServer())
        .get('/progress/no-existe')
        .set('Authorization', `Bearer ${jwtValido}`)
        .expect(404);
    });

    it('retorna 401 sin JWT', async () => {
      await request(app.getHttpServer())
        .get('/progress/informatica')
        .expect(401);
    });

    it('retorna 401 con un JWT inválido', async () => {
      await request(app.getHttpServer())
        .get('/progress/informatica')
        .set('Authorization', 'Bearer token-falso')
        .expect(401);
    });
  });
});
