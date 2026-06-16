import { IsEnum, IsString } from 'class-validator';
import { EstadoAsignatura } from '../../domain/value-objects/course-status.vo';

export class CambiarEstadoAsignaturaDto {
  @IsString()
  idAsignatura!: string;

  @IsEnum(EstadoAsignatura, { message: `El estado debe ser uno de: ${Object.values(EstadoAsignatura).join(', ')}` })
  estado!: EstadoAsignatura;
}
