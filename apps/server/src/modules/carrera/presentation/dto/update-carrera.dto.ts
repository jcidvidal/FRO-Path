import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateCarreraDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre no puede estar vacio.' })
  @IsOptional()
  nombre?: string;

  @IsString()
  @IsNotEmpty({ message: 'El codigo de carrera no puede estar vacio.' })
  @IsOptional()
  codigo_carrera?: string;
}
