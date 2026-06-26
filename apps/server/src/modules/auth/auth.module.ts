import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import type { JwtSignOptions } from '@nestjs/jwt';
import { AuthService } from './application/auth.service';
import { UsuariosRepository } from './application/users.repository';
import { AuthController } from './presentation/auth.controller';
import { JwtAuthGuard } from './presentation/jwt-auth.guard';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? 'fro-path-dev-secret',
      signOptions: {
        expiresIn: (process.env.JWT_EXPIRES_IN ??
          '1h') as JwtSignOptions['expiresIn'],
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UsuariosRepository, JwtAuthGuard],
  exports: [AuthService, UsuariosRepository, JwtAuthGuard, JwtModule],
})
export class AuthModule {}
