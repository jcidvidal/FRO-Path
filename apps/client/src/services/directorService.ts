import { apiClient } from './apiClient';
import { adaptarMeshAFrontend, type BackendMeshResponse } from './meshAdapter';
import type { Semester } from '../types/malla';

export interface EstudianteResumen {
    id: number;
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    email: string;
    rol: string;
}

export function nombreCompleto(estudiante: EstudianteResumen): string {
    return [estudiante.nombre, estudiante.apellidoPaterno, estudiante.apellidoMaterno]
        .filter(Boolean)
        .join(' ');
}

export function buscarEstudiantes(busqueda: string): Promise<EstudianteResumen[]> {
    const query = busqueda.trim()
        ? `?busqueda=${encodeURIComponent(busqueda.trim())}`
        : '';
    return apiClient.get<EstudianteResumen[]>(`/auth/estudiantes${query}`);
}

export function eliminarEstudiante(idEstudiante: number): Promise<{ id: number }> {
    return apiClient.delete<{ id: number }>(`/auth/usuarios/${idEstudiante}`);
}

export async function obtenerMallaEstudiante(
    idCarrera: string,
    idEstudiante: number,
): Promise<Semester[]> {
    const data = await apiClient.get<BackendMeshResponse>(
        `/mesh/${idCarrera}/estudiante/${idEstudiante}`,
    );
    return adaptarMeshAFrontend(data);
}
