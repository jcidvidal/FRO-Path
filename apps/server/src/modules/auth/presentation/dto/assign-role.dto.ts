import { IsEnum } from 'class-validator';
import { RolUsuario } from '../../domain/roles';

export class AsignarRolDto {
  @IsEnum([RolUsuario.Profesor, RolUsuario.Director], {
    message: 'Solo se puede asignar rol profesor o director.',
  })
  rol!: RolUsuario.Profesor | RolUsuario.Director;
}
