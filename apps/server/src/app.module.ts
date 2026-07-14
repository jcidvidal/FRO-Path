import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { MeshModule } from './modules/mesh/mesh.module';
import { ProgressModule } from './modules/progress/progress.module';
import { CarreraModule } from './modules/carrera/carrera.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, cache: true }),
    AuthModule,
    MeshModule,
    ProgressModule,
    CarreraModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

