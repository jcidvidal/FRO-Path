import { RolUsuario } from './roles';

export interface UsuarioAutenticado {
  id: number;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  email: string;
  rol: RolUsuario;
}

export interface UsuarioConPassword extends UsuarioAutenticado {
  passwordHash: string;
}
