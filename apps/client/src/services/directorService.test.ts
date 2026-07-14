import { describe, it, expect, beforeEach, vi } from 'vitest';
import { apiClient } from './apiClient';
import {
    buscarEstudiantes,
    eliminarEstudiante,
    obtenerMallaEstudiante,
    nombreCompleto,
    type EstudianteResumen,
} from './directorService';
import { adaptarMeshAFrontend } from './meshAdapter';

vi.mock('./meshAdapter', () => ({
    adaptarMeshAFrontend: vi.fn(),
}));

describe('directorService', () => {
    const estudianteEjemplo: EstudianteResumen = {
        id: 1,
        nombre: 'María',
        apellidoPaterno: 'López',
        apellidoMaterno: 'Rivas',
        email: 'maria@ufrontera.cl',
        rol: 'estudiante',
        idCarrera: 'icc',
        nombreCarrera: 'Ingeniería Civil en Computación',
    };

    beforeEach(() => {
        vi.restoreAllMocks();
    });

    describe('nombreCompleto', () => {
        it('concatena nombre + apellidoPaterno + apellidoMaterno', () => {
            expect(nombreCompleto(estudianteEjemplo)).toBe('María López Rivas');
        });

        it('filtra valores nulos', () => {
            const conNulos = { ...estudianteEjemplo, apellidoPaterno: undefined as unknown as string };
            expect(nombreCompleto(conNulos)).toBe('María Rivas');
        });
    });

    describe('buscarEstudiantes', () => {
        it('llama a GET /auth/estudiantes con query de búsqueda', async () => {
            const spy = vi.spyOn(apiClient, 'get').mockResolvedValue([]);
            await buscarEstudiantes('María');
            expect(spy).toHaveBeenCalledWith('/auth/estudiantes?busqueda=Mar%C3%ADa');
        });

        it('llama a GET /auth/estudiantes sin query si la búsqueda está vacía', async () => {
            const spy = vi.spyOn(apiClient, 'get').mockResolvedValue([]);
            await buscarEstudiantes('');
            expect(spy).toHaveBeenCalledWith('/auth/estudiantes');
        });

        it('retorna los estudiantes del backend', async () => {
            vi.spyOn(apiClient, 'get').mockResolvedValue([estudianteEjemplo]);
            const resultado = await buscarEstudiantes('María');
            expect(resultado).toEqual([estudianteEjemplo]);
        });
    });

    describe('eliminarEstudiante', () => {
        it('llama a DELETE /auth/usuarios/:id', async () => {
            const spy = vi.spyOn(apiClient, 'delete').mockResolvedValue({ id: 3 });
            await eliminarEstudiante(3);
            expect(spy).toHaveBeenCalledWith('/auth/usuarios/3');
        });
    });

    describe('obtenerMallaEstudiante', () => {
        it('llama a GET /mesh/:carrera/estudiante/:id y adapta la respuesta', async () => {
            const backendData = { semestres: [] };
            const frontendData = { semestres: [], modulosIngles: [], practicas: [] };
            vi.spyOn(apiClient, 'get').mockResolvedValue(backendData);
            (adaptarMeshAFrontend as unknown as ReturnType<typeof vi.fn>).mockReturnValue(frontendData);

            const resultado = await obtenerMallaEstudiante('icc', 1);

            expect(apiClient.get).toHaveBeenCalledWith('/mesh/icc/estudiante/1');
            expect(adaptarMeshAFrontend).toHaveBeenCalledWith(backendData);
            expect(resultado).toEqual(frontendData);
        });
    });
});
