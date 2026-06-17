import { IsArray, IsString } from 'class-validator';

export class AnalizarCargaMallaDto {
  @IsArray()
  @IsString({ each: true })
  idsAsignaturasSeleccionadas!: string[];

  @IsArray()
  @IsString({ each: true })
  idsAsignaturasAprobadas!: string[];
}
