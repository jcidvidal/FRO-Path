import { Carrera } from '../enums/carrera.enum';
import { Usuario } from './usuario.entity';

export class Director extends Usuario {
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

  verAvanceEstudiante(): void {
    console.log(
      'El Director está consultando el avance académico de un estudiante...',
    );
  }

  eliminarEstudiante(): void {
    console.log(
      'El Director está ejecutando la eliminación de un estudiante de su carrera...',
    );
  }
}
