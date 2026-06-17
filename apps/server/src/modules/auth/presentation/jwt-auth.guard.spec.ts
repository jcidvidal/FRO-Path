import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RolUsuario } from '../domain/roles';
import { JwtAuthGuard } from './jwt-auth.guard';
import type { RequestConUsuario } from './jwt-auth.guard';

function contextoConRequest(request: Partial<RequestConUsuario>): ExecutionContext {
  return {
    switchToHttp: () => ({ getRequest: () => request }),
  } as unknown as ExecutionContext;
}

describe('JwtAuthGuard', () => {
  let jwtService: jest.Mocked<Pick<JwtService, 'verify'>>;
  let guard: JwtAuthGuard;

  beforeEach(() => {
    jwtService = { verify: jest.fn() };
    guard = new JwtAuthGuard(jwtService as unknown as JwtService);
  });

  it('permite el acceso y adjunta el usuario cuando el token es valido', () => {
    jwtService.verify.mockReturnValue({
      sub: 9,
      email: 'user@b.cl',
      rol: RolUsuario.Estudiante,
    });
    const request: Partial<RequestConUsuario> = {
      headers: { authorization: 'Bearer token-valido' },
    };

    const resultado = guard.canActivate(contextoConRequest(request));

    expect(resultado).toBe(true);
    expect(request.user).toEqual({
      id: 9,
      email: 'user@b.cl',
      rol: RolUsuario.Estudiante,
    });
  });

  it('lanza UnauthorizedException si no hay header de autorizacion', () => {
    const request: Partial<RequestConUsuario> = { headers: {} };

    expect(() => guard.canActivate(contextoConRequest(request))).toThrow(
      new UnauthorizedException('Token de autenticacion requerido.'),
    );
  });

  it('lanza UnauthorizedException si el esquema no es Bearer', () => {
    const request: Partial<RequestConUsuario> = {
      headers: { authorization: 'Basic abc' },
    };

    expect(() => guard.canActivate(contextoConRequest(request))).toThrow(
      UnauthorizedException,
    );
  });

  it('lanza UnauthorizedException si el token es invalido o expirado', () => {
    jwtService.verify.mockImplementation(() => {
      throw new Error('jwt expired');
    });
    const request: Partial<RequestConUsuario> = {
      headers: { authorization: 'Bearer token-malo' },
    };

    expect(() => guard.canActivate(contextoConRequest(request))).toThrow(
      new UnauthorizedException('Token invalido o expirado.'),
    );
  });
});
