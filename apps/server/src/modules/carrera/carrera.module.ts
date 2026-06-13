import { Module } from '@nestjs/common';
import { CarreraController } from './presentation/carrera.controller';
import { CarreraService } from './application/carrera.service';
import { CarreraRepository } from './application/carrera.repository';

@Module({
  controllers: [CarreraController],
  providers: [CarreraService, CarreraRepository],
  exports: [CarreraService, CarreraRepository],
})
export class CarreraModule {}
