import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import type { App } from 'supertest/types';
import { UsuariosRepository } from '../src/modules/auth/application/users.repository';
import { RolUsuario } from '../src/modules/auth/domain/roles';
import { AuthModule } from '../src/modules/auth/auth.module';
import { REPOSITORIO_MALLA } from '../src/modules/mesh/domain/ports/mesh-repository.port';
import { RepositorioMallaEnMemoria } from '../src/modules/mesh/infrastructure/persistence/in-memory-mesh.repository';
import { MeshModule } from '../src/modules/mesh/mesh.module';

const mockUsuariosRepository = {
  buscarPorEmail: jest.fn(),
  buscarPorId: jest.fn(),
  crear: jest.fn(),
  actualizarRol: jest.fn(),
};

describe('Mesh (e2e)', () => {
  let app: INestApplication<App>;
  let jwtValido: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true, ignoreEnvFile: true }),
        AuthModule,
        MeshModule,
      ],
    })
      .overrideProvider(UsuariosRepository)
      .useValue(mockUsuariosRepository)
      .overrideProvider(REPOSITORIO_MALLA)
      .useClass(RepositorioMallaEnMemoria)
      .compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
    );
    await app.init();

    const jwtService = moduleRef.get(JwtService);
    jwtValido = jwtService.sign({ sub: 1, email: 'estudiante@fro-path.local', rol: RolUsuario.Estudiante });
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /mesh/:idCarrera', () => {
    it('retorna 200 con la malla si la carrera existe', async () => {
      const respuesta = await request(app.getHttpServer())
        .get('/mesh/informatica')
        .set('Authorization', `Bearer ${jwtValido}`)
        .expect(200);

      expect(respuesta.body.idCarrera).toBe('informatica');
      expect(Array.isArray(respuesta.body.asignaturas)).toBe(true);
      expect(respuesta.body.asignaturas.length).toBeGreaterThan(0);
      expect(Array.isArray(respuesta.body.modulosIngles)).toBe(true);
      expect(Array.isArray(respuesta.body.practicas)).toBe(true);
    });

    it('retorna 404 si la carrera no existe', async () => {
      await request(app.getHttpServer())
        .get('/mesh/no-existe')
        .set('Authorization', `Bearer ${jwtValido}`)
        .expect(404);
    });

    it('retorna 401 sin JWT', async () => {
      await request(app.getHttpServer())
        .get('/mesh/informatica')
        .expect(401);
    });
  });

  describe('PATCH /mesh/:idCarrera/estado', () => {
    it('retorna 200 al cambiar el estado de una asignatura existente', async () => {
      const respuesta = await request(app.getHttpServer())
        .patch('/mesh/informatica/estado')
        .set('Authorization', `Bearer ${jwtValido}`)
        .send({ idAsignatura: 'programming-1', estado: 'aprobada' })
        .expect(200);

      expect(respuesta.body.asignatura.id).toBe('programming-1');
      expect(respuesta.body.asignatura.estado).toBe('aprobada');
      expect(Array.isArray(respuesta.body.idsAsignaturasDesbloqueadas)).toBe(true);
    });

    it('retorna 400 si el body tiene campos invalidos', async () => {
      await request(app.getHttpServer())
        .patch('/mesh/informatica/estado')
        .set('Authorization', `Bearer ${jwtValido}`)
        .send({ idAsignatura: 'programming-1', estado: 'estado_inventado' })
        .expect(400);
    });

    it('retorna 401 sin JWT', async () => {
      await request(app.getHttpServer())
        .patch('/mesh/informatica/estado')
        .send({ idAsignatura: 'programming-1', estado: 'aprobada' })
        .expect(401);
    });
  });

  describe('DELETE /mesh/:idCarrera/progreso', () => {
    it('retorna 200 y mensaje de confirmacion al limpiar el progreso', async () => {
      const respuesta = await request(app.getHttpServer())
        .delete('/mesh/informatica/progreso')
        .set('Authorization', `Bearer ${jwtValido}`)
        .expect(200);

      expect(respuesta.body.mensaje).toBeDefined();
    });

    it('retorna 401 sin JWT', async () => {
      await request(app.getHttpServer())
        .delete('/mesh/informatica/progreso')
        .expect(401);
    });
  });
});
