import { Usuario } from './usuario.entity';

export class Admin extends Usuario {
  constructor(
    id: number,
    nombre: string,
    correo: string,
    rut: string,
    contrasena: string,
  ) {
    super(id, nombre, correo, rut, contrasena);
  }

  eliminarEstudiantes(): void {
    console.log('Administrador ejecutando la eliminación de un estudiante...');
  }

  asignarRoles(): void {
    console.log('Administrador asignando nuevos roles en el sistema...');
  }
}
