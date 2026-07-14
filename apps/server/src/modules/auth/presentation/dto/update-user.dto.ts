import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { RolUsuario } from '../../domain/roles';

export class ActualizarUsuarioDto {
  @IsString()
  @IsOptional()
  nombre?: string;

  @IsString()
  @IsOptional()
  apellidoPaterno?: string;

  @IsString()
  @IsOptional()
  apellidoMaterno?: string;

  @IsEmail({}, { message: 'El email no tiene un formato válido.' })
  @IsOptional()
  email?: string;

  @IsEnum(RolUsuario, { message: 'El rol no es válido.' })
  @IsOptional()
  rol?: RolUsuario;
}