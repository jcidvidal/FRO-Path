import { Asignatura } from './asignatura.entity';
import { Usuario } from './usuario.entity';

export class Profesor extends Usuario {
  constructor(
    id: number,
    nombre: string,
    correo: string,
    rut: string,
    contrasena: string,
    public asignaturas: Asignatura[] = [],
  ) {
    super(id, nombre, correo, rut, contrasena);
  }
}
