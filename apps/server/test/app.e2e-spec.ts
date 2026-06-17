import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';

describe('AppController (e2e)', () => {
  let aplicacion: INestApplication<App>;

  beforeEach(async () => {
    const moduloPruebas: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    aplicacion = moduloPruebas.createNestApplication();
    await aplicacion.init();
  });

  it('/ (GET)', () => {
    return request(aplicacion.getHttpServer())
      .get('/')
      .expect(200)
      .expect('FRO-Path API is running.');
  });
});
