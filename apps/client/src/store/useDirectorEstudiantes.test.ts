import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useBusquedaEstudiantes, useMallaEstudiante } from './useDirectorEstudiantes';
import { apiClient } from '../services/apiClient';
import * as meshAdapter from '../services/meshAdapter';
import type { FrontendMalla } from '../services/meshAdapter';

vi.mock('../services/apiClient', () => ({
    apiClient: {
        get: vi.fn(),
    },
}));

vi.mock('../services/meshAdapter', () => ({
    adaptarMeshAFrontend: vi.fn(),
}));

describe('useBusquedaEstudiantes', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('retorna estado inicial cargando', () => {
        vi.mocked(apiClient.get).mockResolvedValue([]);

        const { result } = renderHook(() => useBusquedaEstudiantes(''));

        expect(result.current.cargando).toBe(true);
        expect(result.current.estudiantes).toEqual([]);
        expect(result.current.error).toBeNull();
    });

    it('carga estudiantes desde el backend tras el debounce', async () => {
        const estudiantesMock = [
            { id: 1, nombre: 'Ana', apellidoPaterno: 'López', apellidoMaterno: 'Rivas', email: 'ana@ufrontera.cl', rol: 'estudiante', idCarrera: 'icc', nombreCarrera: 'ICC' },
        ];
        vi.mocked(apiClient.get).mockResolvedValue(estudiantesMock);

        const { result } = renderHook(() => useBusquedaEstudiantes('Ana'));

        expect(result.current.cargando).toBe(true);

        await waitFor(() => expect(result.current.cargando).toBe(false));

        expect(apiClient.get).toHaveBeenCalledWith('/auth/estudiantes?busqueda=Ana');
        expect(result.current.estudiantes).toEqual(estudiantesMock);
        expect(result.current.error).toBeNull();
    });

    it('no llama al API si el hook se desmonta antes del debounce', async () => {
        const { unmount } = renderHook(() => useBusquedaEstudiantes('Test'));
        unmount();

        await new Promise((r) => setTimeout(r, 400));
        expect(apiClient.get).not.toHaveBeenCalled();
    });

    it('maneja error del backend', async () => {
        vi.mocked(apiClient.get).mockRejectedValue(new Error('Error de red'));

        const { result } = renderHook(() => useBusquedaEstudiantes('Ana'));

        await waitFor(() => expect(result.current.cargando).toBe(false));

        expect(result.current.error).toBe('Error de red');
        expect(result.current.estudiantes).toEqual([]);
    });

    it('recargar incrementa la versión y vuelve a cargar', async () => {
        vi.mocked(apiClient.get).mockResolvedValue([]);

        const { result } = renderHook(() => useBusquedaEstudiantes('Pedro'));

        await waitFor(() => expect(result.current.cargando).toBe(false));
        expect(apiClient.get).toHaveBeenCalledTimes(1);

        act(() => {
            result.current.recargar();
        });

        await waitFor(() => expect(apiClient.get).toHaveBeenCalledTimes(2));
    });
});

describe('useMallaEstudiante', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('retorna vacío cuando idEstudiante es null', () => {
        const { result } = renderHook(() => useMallaEstudiante('icc', null));

        expect(result.current.semestres).toEqual([]);
        expect(result.current.modulosIngles).toEqual([]);
        expect(result.current.practicas).toEqual([]);
        expect(result.current.cargando).toBe(false);
        expect(result.current.error).toBeNull();
    });

    it('carga la malla del estudiante desde el backend', async () => {
        const backendData = {
            asignaturas: [
                { id: 'MAT-01', codigo: 'MAT-01', nombre: 'Matemáticas', sct: 6, nivel: 1, estado: 'aprobado', idsPrerequisitos: [] },
            ],
            modulosIngles: [],
            practicas: [],
        };
        const frontendData: FrontendMalla = {
            semestres: [
                {
                    numero: 1,
                    asignaturas: [
                        {
                            id: 'MAT-01',
                            nombre: 'Matemáticas',
                            sct: 6,
                            status: 'aprobado',
                            prerrequisitos: [],
                        },
                    ],
                },
            ],
            modulosIngles: [],
            practicas: [],
        };
        vi.mocked(apiClient.get).mockResolvedValue(backendData);
        vi.mocked(meshAdapter.adaptarMeshAFrontend).mockReturnValue(frontendData);

        const { result } = renderHook(() => useMallaEstudiante('icc', 1));

        expect(result.current.cargando).toBe(true);

        await waitFor(() => expect(result.current.cargando).toBe(false));

        expect(result.current.semestres).toEqual(frontendData.semestres);
        expect(result.current.modulosIngles).toEqual(frontendData.modulosIngles);
        expect(result.current.practicas).toEqual(frontendData.practicas);
        expect(result.current.error).toBeNull();
    });

    it('limpia el estado si idEstudiante cambia a null', async () => {
        vi.mocked(apiClient.get).mockResolvedValue({ semestres: [], modulosIngles: [], practicas: [] });

        const { result, rerender } = renderHook(
            ({ idCarrera, idEstudiante }) => useMallaEstudiante(idCarrera, idEstudiante),
            { initialProps: { idCarrera: 'icc', idEstudiante: 1 as number | null } },
        );

        await waitFor(() => expect(result.current.cargando).toBe(false));

        rerender({ idCarrera: 'icc', idEstudiante: null });

        expect(result.current.semestres).toEqual([]);
        expect(result.current.modulosIngles).toEqual([]);
        expect(result.current.practicas).toEqual([]);
        expect(result.current.cargando).toBe(false);
        expect(result.current.error).toBeNull();
    });

    it('maneja error del backend', async () => {
        vi.mocked(apiClient.get).mockRejectedValue(new Error('Error de malla'));

        const { result } = renderHook(() => useMallaEstudiante('icc', 1));

        await waitFor(() => expect(result.current.cargando).toBe(false));

        expect(result.current.error).toBe('Error de malla');
        expect(result.current.semestres).toEqual([]);
    });

    it('no actualiza estado si el hook se desmonta antes de la respuesta', async () => {
        let resolver: (value: unknown) => void = () => { };
        const promesa = new Promise((resolve) => { resolver = resolve; });
        vi.mocked(apiClient.get).mockReturnValue(promesa);

        const { unmount } = renderHook(() => useMallaEstudiante('icc', 1));
        unmount();

        resolver({ semestres: [{ nivel: 1, asignaturas: [] }], modulosIngles: [], practicas: [] });

        await new Promise((r) => setTimeout(r, 50));

        expect(apiClient.get).toHaveBeenCalledWith('/mesh/icc/estudiante/1');
    });
});