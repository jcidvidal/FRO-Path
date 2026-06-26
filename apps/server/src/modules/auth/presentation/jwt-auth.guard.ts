import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { RolUsuario } from '../domain/roles';

export interface RequestConUsuario extends Request {
  user?: {
    id: number;
    email: string;
    rol: RolUsuario;
  };
}

interface JwtPayload {
  sub: number;
  email: string;
  rol: RolUsuario;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<RequestConUsuario>();
    const token = this.extraerToken(request);

    if (!token) {
      throw new UnauthorizedException('Token de autenticacion requerido.');
    }

    try {
      const payload = this.jwtService.verify<JwtPayload>(token);
      request.user = {
        id: payload.sub,
        email: payload.email,
        rol: payload.rol,
      };
      return true;
    } catch {
      throw new UnauthorizedException('Token invalido o expirado.');
    }
  }

  private extraerToken(request: Request): string | null {
    const [tipo, token] = request.headers.authorization?.split(' ') ?? [];
    return tipo === 'Bearer' && token ? token : null;
  }
}
