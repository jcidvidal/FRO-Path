import { apiClient } from './apiClient';

export interface CarreraDto {
    id: number;
    nombre: string;
    codigo_carrera: string;
}

export function listarCarreras(): Promise<CarreraDto[]> {
    return apiClient.get<CarreraDto[]>('/carrera');
}