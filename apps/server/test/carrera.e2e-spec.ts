import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { CarreraRepository } from '../src/modules/carrera/application/carrera.repository';

describe('CarreraController (e2e)', () => {
  let aplicacion: INestApplication<App>;
  let mockCarreraRepository: jest.Mocked<
    Pick<
      CarreraRepository,
      | 'buscarPorId'
      | 'buscarPorCodigo'
      | 'buscarTodos'
      | 'crear'
      | 'actualizar'
      | 'eliminar'
    >
  >;

  beforeEach(async () => {
    mockCarreraRepository = {
      buscarPorId: jest.fn(),
      buscarPorCodigo: jest.fn(),
      buscarTodos: jest.fn(),
      crear: jest.fn(),
      actualizar: jest.fn(),
      eliminar: jest.fn(),
    };

    const moduloPruebas: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(CarreraRepository)
      .useValue(mockCarreraRepository)
      .compile();

    aplicacion = moduloPruebas.createNestApplication();
    await aplicacion.init();
  });

  afterAll(async () => {
    await aplicacion.close();
  });

  describe('POST /carrera', () => {
    it('debe crear una carrera exitosamente y retornar 201 con ReadCarreraDto', async () => {
      const entrada = { nombre: 'Ingeniería Informática', codigo_carrera: 'DIR: 3086' };
      const resultadoDb = { id: 1, nombre: 'Ingeniería Informática', codigo_carrera: 'DIR: 3086' };

      mockCarreraRepository.buscarPorCodigo.mockResolvedValue(null);
      mockCarreraRepository.crear.mockResolvedValue(resultadoDb);

      const respuesta = await request(aplicacion.getHttpServer())
        .post('/carrera')
        .send(entrada)
        .expect(HttpStatus.CREATED);

      expect(respuesta.body).toEqual({
        id: 1,
        nombre: 'Ingeniería Informática',
        codigo_carrera: 'DIR: 3086',
      });
      expect(mockCarreraRepository.crear).toHaveBeenCalledWith(entrada);
    });

    it('debe lanzar 409 Conflict si el codigo de carrera ya existe', async () => {
      const entrada = { nombre: 'Ingeniería Informática', codigo_carrera: 'DIR: 3086' };
      const existente = { id: 2, nombre: 'Otra', codigo_carrera: 'DIR: 3086' };

      mockCarreraRepository.buscarPorCodigo.mockResolvedValue(existente);

      const respuesta = await request(aplicacion.getHttpServer())
        .post('/carrera')
        .send(entrada)
        .expect(HttpStatus.CONFLICT);

      expect(respuesta.body.message).toBe('El codigo de carrera ya esta registrado.');
    });
  });

  describe('GET /carrera', () => {
    it('debe retornar 200 con una lista de carreras en formato ReadCarreraDto', async () => {
      const carreras = [
        { id: 1, nombre: 'Ingeniería Civil Informática', codigo_carrera: 'DIR: 3087' },
        { id: 2, nombre: 'Ingeniería Informática', codigo_carrera: 'DIR: 3086' },
      ];

      mockCarreraRepository.buscarTodos.mockResolvedValue(carreras);

      const respuesta = await request(aplicacion.getHttpServer())
        .get('/carrera')
        .expect(HttpStatus.OK);

      expect(respuesta.body).toEqual(carreras);
    });
  });

  describe('GET /carrera/:id', () => {
    it('debe retornar 200 con ReadCarreraDto si existe la carrera', async () => {
      const carrera = { id: 1, nombre: 'Ingeniería Civil Informática', codigo_carrera: 'DIR: 3087' };
      mockCarreraRepository.buscarPorId.mockResolvedValue(carrera);

      const respuesta = await request(aplicacion.getHttpServer())
        .get('/carrera/1')
        .expect(HttpStatus.OK);

      expect(respuesta.body).toEqual(carrera);
    });

    it('debe retornar 404 si la carrera no existe', async () => {
      mockCarreraRepository.buscarPorId.mockResolvedValue(null);

      const respuesta = await request(aplicacion.getHttpServer())
        .get('/carrera/999')
        .expect(HttpStatus.NOT_FOUND);

      expect(respuesta.body.message).toBe('La carrera con ID 999 no existe.');
    });

    it('debe retornar 400 Bad Request si el ID no es numerico', async () => {
      const respuesta = await request(aplicacion.getHttpServer())
        .get('/carrera/abc')
        .expect(HttpStatus.BAD_REQUEST);

      expect(respuesta.body.message).toContain('Validation failed');
    });
  });

  describe('PATCH /carrera/:id', () => {
    it('debe retornar 200 con ReadCarreraDto al actualizar exitosamente', async () => {
      const carreraExistente = { id: 1, nombre: 'Ingeniería Civil Informática', codigo_carrera: 'DIR: 3087' };
      const carreraActualizada = { id: 1, nombre: 'Ingeniería Civil Informática Modificada', codigo_carrera: 'DIR: 3087' };

      mockCarreraRepository.buscarPorId.mockResolvedValue(carreraExistente);
      mockCarreraRepository.buscarPorCodigo.mockResolvedValue(null);
      mockCarreraRepository.actualizar.mockResolvedValue(carreraActualizada);

      const respuesta = await request(aplicacion.getHttpServer())
        .patch('/carrera/1')
        .send({ nombre: 'Ingeniería Civil Informática Modificada' })
        .expect(HttpStatus.OK);

      expect(respuesta.body).toEqual(carreraActualizada);
    });

    it('debe retornar 400 Bad Request si el ID no es numerico', async () => {
      const respuesta = await request(aplicacion.getHttpServer())
        .patch('/carrera/abc')
        .send({ nombre: 'Ingeniería Civil Informática' })
        .expect(HttpStatus.BAD_REQUEST);

      expect(respuesta.body.message).toContain('Validation failed');
    });
  });

  describe('DELETE /carrera/:id', () => {
    it('debe retornar 200 al eliminar exitosamente', async () => {
      const carreraExistente = { id: 1, nombre: 'Ingeniería Civil Informática', codigo_carrera: 'DIR: 3087' };

      mockCarreraRepository.buscarPorId.mockResolvedValue(carreraExistente);
      mockCarreraRepository.eliminar.mockResolvedValue(undefined);

      await request(aplicacion.getHttpServer())
        .delete('/carrera/1')
        .expect(HttpStatus.OK);

      expect(mockCarreraRepository.eliminar).toHaveBeenCalledWith(1);
    });

    it('debe retornar 400 Bad Request si el ID no es numerico', async () => {
      const respuesta = await request(aplicacion.getHttpServer())
        .delete('/carrera/abc')
        .expect(HttpStatus.BAD_REQUEST);

      expect(respuesta.body.message).toContain('Validation failed');
    });
  });
});
