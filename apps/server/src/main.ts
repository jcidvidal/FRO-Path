import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function iniciar() {
  const aplicacion = await NestFactory.create(AppModule);
  await aplicacion.listen(process.env.PORT ?? 3000);
}
void iniciar();
