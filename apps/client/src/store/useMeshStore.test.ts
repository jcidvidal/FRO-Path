import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useMesh } from './useMeshStore';
import { apiClient } from '../services/apiClient';
import type { BackendMeshResponse, BackendCambioEstadoResponse } from '../services/meshAdapter';

vi.mock('../services/apiClient', () => ({
    apiClient: {
        get: vi.fn(),
        patch: vi.fn(),
        post: vi.fn().mockResolvedValue({ comentario: 'Carga equilibrada.' }),
    },
}));

const respuestaMalla: BackendMeshResponse = {
    idCarrera: 'icc',
    asignaturas: [
        { id: 'ICC-001', codigo: 'ICC-001', nombre: 'Prog I', sct: 6, nivel: 1, estado: 'disponible', idsPrerequisitos: [] },
        { id: 'ICC-002', codigo: 'ICC-002', nombre: 'Prog II', sct: 6, nivel: 2, estado: 'bloqueada', idsPrerequisitos: ['ICC-001'] },
    ],
};

describe('useMesh', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('carga la malla desde el backend al montar', async () => {
        vi.mocked(apiClient.get).mockResolvedValue(respuestaMalla);

        const { result } = renderHook(() => useMesh('icc'));

        expect(result.current.isLoading).toBe(true);

        await waitFor(() => expect(result.current.isLoading).toBe(false));

        expect(apiClient.get).toHaveBeenCalledWith('/mesh/icc');
        expect(result.current.semestres).toHaveLength(2);
        expect(result.current.error).toBeNull();
    });

    it('expone un error si la carga falla', async () => {
        vi.mocked(apiClient.get).mockRejectedValue(new Error('Falla de red'));

        const { result } = renderHook(() => useMesh('icc'));

        await waitFor(() => expect(result.current.isLoading).toBe(false));

        expect(result.current.error).toBe('Falla de red');
        expect(result.current.semestres).toHaveLength(0);
    });

    it('actualiza el estado de forma optimista y aplica desbloqueos en cascada', async () => {
        vi.mocked(apiClient.get).mockResolvedValue(respuestaMalla);
        const respuestaCambio: BackendCambioEstadoResponse = {
            asignatura: { id: 'ICC-001', codigo: 'ICC-001', nombre: 'Prog I', sct: 6, nivel: 1, estado: 'aprobada', idsPrerequisitos: [] },
            idsAsignaturasDesbloqueadas: ['ICC-002'],
            eventos: [],
        };
        vi.mocked(apiClient.patch).mockResolvedValue(respuestaCambio);

        const { result } = renderHook(() => useMesh('icc'));
        await waitFor(() => expect(result.current.isLoading).toBe(false));

        act(() => {
            result.current.cambiarEstado('ICC-001', 'aprobado');
        });

        // Update optimista inmediato
        const icc001 = () => result.current.semestres.flatMap((s) => s.asignaturas).find((a) => a.id === 'ICC-001');
        expect(icc001()?.status).toBe('aprobado');

        // Desbloqueo en cascada tras la respuesta del backend
        await waitFor(() => {
            const icc002 = result.current.semestres.flatMap((s) => s.asignaturas).find((a) => a.id === 'ICC-002');
            expect(icc002?.status).toBe('disponible');
        });

        expect(apiClient.patch).toHaveBeenCalledWith('/mesh/icc/estado', {
            idAsignatura: 'ICC-001',
            estado: 'aprobada',
        });
    });

    it('revierte el estado optimista si el backend falla', async () => {
        vi.mocked(apiClient.get).mockResolvedValue(respuestaMalla);
        vi.mocked(apiClient.patch).mockRejectedValue(new Error('500'));

        const { result } = renderHook(() => useMesh('icc'));
        await waitFor(() => expect(result.current.isLoading).toBe(false));

        act(() => {
            result.current.cambiarEstado('ICC-001', 'aprobado');
        });

        const icc001 = () => result.current.semestres.flatMap((s) => s.asignaturas).find((a) => a.id === 'ICC-001');
        expect(icc001()?.status).toBe('aprobado');

        // Tras el rechazo, vuelve al estado anterior
        await waitFor(() => expect(icc001()?.status).toBe('disponible'));
    });

    it('tras un cambio exitoso solicita el análisis de IA al servidor', async () => {
        vi.mocked(apiClient.get).mockResolvedValue(respuestaMalla);
        const respuestaCambio: BackendCambioEstadoResponse = {
            asignatura: { id: 'ICC-001', codigo: 'ICC-001', nombre: 'Prog I', sct: 6, nivel: 1, estado: 'en_curso', idsPrerequisitos: [] },
            idsAsignaturasDesbloqueadas: [],
            eventos: [],
        };
        vi.mocked(apiClient.patch).mockResolvedValue(respuestaCambio);
        vi.mocked(apiClient.post).mockResolvedValue({ comentario: 'Carga equilibrada.' });

        const { result } = renderHook(() => useMesh('icc'));
        await waitFor(() => expect(result.current.isLoading).toBe(false));

        act(() => {
            result.current.cambiarEstado('ICC-001', 'cursando');
        });

        await waitFor(() => expect(result.current.comentarioIa).toBe('Carga equilibrada.'), { timeout: 2000 });

        expect(apiClient.post).toHaveBeenCalledWith('/mesh/icc/analisis-ia');
        expect(result.current.analizando).toBe(false);
    });

    it('marca "analizando" y lo desactiva aunque el análisis de IA falle', async () => {
        vi.mocked(apiClient.get).mockResolvedValue(respuestaMalla);
        const respuestaCambio: BackendCambioEstadoResponse = {
            asignatura: { id: 'ICC-001', codigo: 'ICC-001', nombre: 'Prog I', sct: 6, nivel: 1, estado: 'en_curso', idsPrerequisitos: [] },
            idsAsignaturasDesbloqueadas: [],
            eventos: [],
        };
        vi.mocked(apiClient.patch).mockResolvedValue(respuestaCambio);
        vi.mocked(apiClient.post).mockRejectedValue(new Error('IA caída'));

        const { result } = renderHook(() => useMesh('icc'));
        await waitFor(() => expect(result.current.isLoading).toBe(false));

        act(() => {
            result.current.cambiarEstado('ICC-001', 'cursando');
        });

        await waitFor(() => expect(result.current.analizando).toBe(true));
        await waitFor(() => expect(result.current.analizando).toBe(false), { timeout: 2000 });
        expect(result.current.comentarioIa).toBeNull();
    });
});
