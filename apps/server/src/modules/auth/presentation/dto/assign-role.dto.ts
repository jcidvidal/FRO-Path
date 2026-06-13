import { RolUsuario } from '../../domain/roles';

export class AsignarRolDto {
  rol!: RolUsuario.Profesor | RolUsuario.Director;
}
