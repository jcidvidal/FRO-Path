import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { beforeEach, describe, it } from 'node:test';

describe('AppController', () => {
  let controladorApp: AppController;

  beforeEach(async () => {
    const moduloPruebas: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    controladorApp = moduloPruebas.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return the API health message', () => {
      expect(controladorApp.obtenerSaludo()).toBe('FRO-Path API is running.');
    });
  });
});
