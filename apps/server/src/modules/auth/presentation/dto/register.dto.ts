import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre es obligatorio.' })
  nombre!: string;

  @IsEmail({}, { message: 'El email no tiene un formato válido.' })
  @IsNotEmpty({ message: 'El email es obligatorio.' })
  email!: string;

  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres.' })
  @IsNotEmpty({ message: 'La contraseña es obligatoria.' })
  password!: string;

  @IsString()
  @IsOptional()
  apellidoPaterno?: string;

  @IsString()
  @IsOptional()
  apellidoMaterno?: string;

  @IsString()
  @IsOptional()
  carrera?: string;
}
