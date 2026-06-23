// Carga las variables del .env antes que cualquier otro import. Es necesario
// porque el DataSource de TypeORM se instancia en tiempo de import (fuera del
// ciclo de vida de Nest), antes de que ConfigModule.forRoot() llegue a ejecutarse.
import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function iniciar() {
  const aplicacion = await NestFactory.create(AppModule);

  aplicacion.enableCors({
    origin: process.env.CLIENT_URL ?? 'http://localhost:5173',
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  aplicacion.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await aplicacion.listen(process.env.PORT ?? 3000);
}
void iniciar();
