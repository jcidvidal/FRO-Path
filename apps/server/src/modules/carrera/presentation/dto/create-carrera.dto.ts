import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCarreraDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre es obligatorio.' })
  nombre!: string;

  @IsString()
  @IsNotEmpty({ message: 'El codigo de carrera es obligatorio.' })
  codigo_carrera!: string;
}
