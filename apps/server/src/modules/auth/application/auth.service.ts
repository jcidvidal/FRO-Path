import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import { UsuarioAutenticado } from '../domain/auth-user';
import { RolUsuario } from '../domain/roles';
import { LoginDto } from '../presentation/dto/login.dto';
import { RegisterDto } from '../presentation/dto/register.dto';
import { UsuariosRepository } from './users.repository';

export interface AuthResponse {
  accessToken: string;
  tokenType: 'Bearer';
  expiresIn: string;
  user: UsuarioAutenticado;
}

interface JwtPayload {
  sub: number;
  email: string;
  rol: RolUsuario;
}

interface UsuarioSolicitante {
  id: number;
  email: string;
  rol: RolUsuario;
}

interface AsignarRolUsuarioEntrada {
  idUsuario: number;
  rol: RolUsuario;
  usuarioSolicitante?: UsuarioSolicitante;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usuariosRepository: UsuariosRepository,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto): Promise<AuthResponse> {
    this.validarCredencialesBasicas(dto.email, dto.password);

    const usuario = await this.usuariosRepository.buscarPorEmail(dto.email);

    if (!usuario || !(await compare(dto.password, usuario.passwordHash))) {
      throw new UnauthorizedException('Credenciales invalidas.');
    }

    return this.crearRespuestaAuth(usuario);
  }

  async register(dto: RegisterDto): Promise<AuthResponse> {
    this.validarCredencialesBasicas(dto.email, dto.password);

    if (!dto.nombre?.trim()) {
      throw new BadRequestException('El nombre es obligatorio.');
    }

    const existente = await this.usuariosRepository.buscarPorEmail(dto.email);

    if (existente) {
      throw new ConflictException('El correo ya esta registrado.');
    }

    const usuario = await this.usuariosRepository.crear({
      nombre: dto.nombre.trim(),
      apellidoPaterno: dto.apellidoPaterno?.trim() || 'Sin apellido',
      apellidoMaterno: dto.apellidoMaterno?.trim() || 'Sin apellido',
      email: dto.email,
      passwordHash: await hash(dto.password, 10),
      rol: RolUsuario.Estudiante,
    });

    return this.crearRespuestaAuth(usuario);
  }

  async asignarRolUsuario({
    idUsuario,
    rol,
    usuarioSolicitante,
  }: AsignarRolUsuarioEntrada): Promise<UsuarioAutenticado> {
    if (usuarioSolicitante?.rol !== RolUsuario.Admin) {
      throw new ForbiddenException('Solo un administrador puede asignar roles.');
    }

    if (!Number.isInteger(idUsuario) || idUsuario <= 0) {
      throw new BadRequestException('El id de usuario no es valido.');
    }

    if (!this.esRolAsignable(rol)) {
      throw new BadRequestException(
        'Solo se puede asignar rol profesor o director.',
      );
    }

    const usuario = await this.usuariosRepository.buscarPorId(idUsuario);

    if (!usuario) {
      throw new NotFoundException(`El usuario ${idUsuario} no existe.`);
    }

    return this.usuariosRepository.actualizarRol(idUsuario, rol);
  }

  private esRolAsignable(
    rol: RolUsuario,
  ): rol is RolUsuario.Profesor | RolUsuario.Director {
    return [RolUsuario.Profesor, RolUsuario.Director].includes(rol);
  }

  private crearRespuestaAuth(usuario: UsuarioAutenticado): AuthResponse {
    const usuarioSeguro: UsuarioAutenticado = {
      id: usuario.id,
      nombre: usuario.nombre,
      apellidoPaterno: usuario.apellidoPaterno,
      apellidoMaterno: usuario.apellidoMaterno,
      email: usuario.email,
      rol: usuario.rol,
    };
    const payload: JwtPayload = {
      sub: usuarioSeguro.id,
      email: usuarioSeguro.email,
      rol: usuarioSeguro.rol,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      tokenType: 'Bearer',
      expiresIn: process.env.JWT_EXPIRES_IN ?? '1h',
      user: usuarioSeguro,
    };
  }

  private validarCredencialesBasicas(email: string, password: string): void {
    if (!email?.trim()) {
      throw new BadRequestException('El email es obligatorio.');
    }

    if (!password || password.length < 6) {
      throw new BadRequestException(
        'La contrasena debe tener al menos 6 caracteres.',
      );
    }
  }
}
