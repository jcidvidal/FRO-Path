import { Carrera } from '../enums/carrera.enum';
import { Estado } from '../enums/estados.enums';
import { Asignatura } from './asignatura.entity';
import { Usuario } from './usuario.entity';

export class Estudiante extends Usuario {
  carrera: Carrera;

  constructor(
    id: number,
    nombre: string,
    correo: string,
    rut: string,
    contrasena: string,
    carrera: Carrera,
  ) {
    super(id, nombre, correo, rut, contrasena);
    this.carrera = carrera;
  }

  cambiarEstadoAsignatura(asignatura: Asignatura, nuevoEstado: Estado): void {
    if (asignatura.estado === Estado.BLOQUEADO) {
      throw new Error(
        `No se puede modificar la asignatura porque su acceso se encuentra BLOQUEADO.`,
      );
    }
    asignatura.cambiarEstado(nuevoEstado);
  }
}
