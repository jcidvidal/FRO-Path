import { apiClient } from './apiClient';

export type RolUsuario = 'estudiante' | 'profesor' | 'director' | 'admin';
export type RolAsignable = 'profesor' | 'director';

export interface UsuarioResumen {
    id: number;
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    email: string;
    rol: RolUsuario;
}

export function nombreCompleto(usuario: UsuarioResumen): string {
    return [usuario.nombre, usuario.apellidoPaterno, usuario.apellidoMaterno]
        .filter(Boolean)
        .join(' ');
}

export function buscarUsuarios(params: {
    busqueda?: string;
    rol?: RolUsuario;
}): Promise<UsuarioResumen[]> {
    const query = new URLSearchParams();
    const termino = params.busqueda?.trim();
    if (termino) {
        query.set('busqueda', termino);
    }
    if (params.rol) {
        query.set('rol', params.rol);
    }
    const cadena = query.toString();
    return apiClient.get<UsuarioResumen[]>(`/auth/usuarios${cadena ? `?${cadena}` : ''}`);
}

export function asignarRol(idUsuario: number, rol: RolAsignable): Promise<UsuarioResumen> {
    return apiClient.patch<UsuarioResumen>(`/auth/usuarios/${idUsuario}/rol`, { rol });
}

export function eliminarUsuario(idUsuario: number): Promise<{ id: number }> {
    return apiClient.delete<{ id: number }>(`/auth/usuarios/${idUsuario}`);
}

export function crearUsuario(datos: {
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    email: string;
    password: string;
    rol: string;
}): Promise<UsuarioResumen> {
    return apiClient.post<UsuarioResumen>('/auth/usuarios', datos);
}

export function actualizarUsuario(id: number, datos: {
    nombre?: string;
    apellidoPaterno?: string;
    apellidoMaterno?: string;
    email?: string;
    rol?: RolUsuario;
}): Promise<UsuarioResumen> {
    return apiClient.patch<UsuarioResumen>(`/auth/usuarios/${id}`, datos);
}
