import { describe, it, expect, beforeEach, vi } from 'vitest';
import { apiClient } from './apiClient';
import { listarCarreras, type CarreraDto } from './carreraService';

describe('carreraService', () => {
    const carrerasEjemplo: CarreraDto[] = [
        { id: 1, nombre: 'Ingeniería Civil en Computación', codigo_carrera: 'icc' },
        { id: 2, nombre: 'Ingeniería Industrial', codigo_carrera: 'ii' },
    ];

    beforeEach(() => {
        vi.restoreAllMocks();
    });

    describe('listarCarreras', () => {
        it('llama a GET /carrera', async () => {
            const spy = vi.spyOn(apiClient, 'get').mockResolvedValue([]);
            await listarCarreras();
            expect(spy).toHaveBeenCalledWith('/carrera');
        });

        it('retorna la lista de carreras del backend', async () => {
            vi.spyOn(apiClient, 'get').mockResolvedValue(carrerasEjemplo);
            const resultado = await listarCarreras();
            expect(resultado).toEqual(carrerasEjemplo);
            expect(resultado).toHaveLength(2);
            expect(resultado[0].codigo_carrera).toBe('icc');
        });

        it('propaga el error si el API falla', async () => {
            vi.spyOn(apiClient, 'get').mockRejectedValue(new Error('Error de red'));
            await expect(listarCarreras()).rejects.toThrow('Error de red');
        });
    });
});
