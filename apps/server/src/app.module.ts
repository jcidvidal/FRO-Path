import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { MeshModule } from './modules/mesh/mesh.module';
import { ProgressModule } from './modules/progress/progress.module';

@Module({
  imports: [AuthModule, MeshModule, ProgressModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
