import { describe, it, expect } from 'vitest';
import { adaptarMeshAFrontend, adaptarStatusABackend } from './meshAdapter';
import type { BackendMeshResponse } from './meshAdapter';

const RESPUESTA_BASE: BackendMeshResponse = {
    idCarrera: 'icc',
    asignaturas: [
        { id: 'ICC-001', codigo: 'ICC-001', nombre: 'Prog I', sct: 6, nivel: 1, estado: 'disponible', idsPrerequisitos: [] },
        { id: 'ICC-002', codigo: 'ICC-002', nombre: 'Prog II', sct: 6, nivel: 2, estado: 'bloqueada', idsPrerequisitos: ['ICC-001'] },
        { id: 'ICC-003', codigo: 'ICC-003', nombre: 'Prog III', sct: 4, nivel: 1, estado: 'aprobada', idsPrerequisitos: [] },
    ],
};

describe('adaptarMeshAFrontend', () => {
    it('agrupa asignaturas del mismo nivel en un mismo semestre', () => {
        const semestres = adaptarMeshAFrontend(RESPUESTA_BASE);

        expect(semestres).toHaveLength(2);
        expect(semestres[0].asignaturas).toHaveLength(2);
        expect(semestres[1].asignaturas).toHaveLength(1);
    });

    it('ordena los semestres de menor a mayor nivel', () => {
        const respuesta: BackendMeshResponse = {
            idCarrera: 'icc',
            asignaturas: [
                { id: 'C', codigo: 'C', nombre: 'C', sct: 3, nivel: 3, estado: 'bloqueada', idsPrerequisitos: [] },
                { id: 'A', codigo: 'A', nombre: 'A', sct: 3, nivel: 1, estado: 'disponible', idsPrerequisitos: [] },
            ],
        };

        const semestres = adaptarMeshAFrontend(respuesta);

        expect(semestres[0].numero).toBe(1);
        expect(semestres[1].numero).toBe(3);
    });

    it('mapea todos los estados del backend al equivalente del frontend', () => {
        const respuesta: BackendMeshResponse = {
            idCarrera: 'icc',
            asignaturas: [
                { id: '1', codigo: 'A', nombre: 'A', sct: 1, nivel: 1, estado: 'disponible', idsPrerequisitos: [] },
                { id: '2', codigo: 'B', nombre: 'B', sct: 1, nivel: 2, estado: 'bloqueada', idsPrerequisitos: [] },
                { id: '3', codigo: 'C', nombre: 'C', sct: 1, nivel: 3, estado: 'aprobada', idsPrerequisitos: [] },
                { id: '4', codigo: 'D', nombre: 'D', sct: 1, nivel: 4, estado: 'en_curso', idsPrerequisitos: [] },
                { id: '5', codigo: 'E', nombre: 'E', sct: 1, nivel: 5, estado: 'reprobada', idsPrerequisitos: [] },
            ],
        };

        const semestres = adaptarMeshAFrontend(respuesta);

        expect(semestres[0].asignaturas[0].status).toBe('disponible');
        expect(semestres[1].asignaturas[0].status).toBe('bloqueado');
        expect(semestres[2].asignaturas[0].status).toBe('aprobado');
        expect(semestres[3].asignaturas[0].status).toBe('cursando');
        expect(semestres[4].asignaturas[0].status).toBe('reprobado');
    });

    it('usa "bloqueado" como fallback para un estado desconocido', () => {
        const respuesta = {
            idCarrera: 'icc',
            asignaturas: [
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                { id: '1', codigo: 'A', nombre: 'A', sct: 1, nivel: 1, estado: 'desconocido' as any, idsPrerequisitos: [] },
            ],
        };

        const semestres = adaptarMeshAFrontend(respuesta);

        expect(semestres[0].asignaturas[0].status).toBe('bloqueado');
    });

    it('incluye los ids de prerrequisitos en la asignatura adaptada', () => {
        const semestres = adaptarMeshAFrontend(RESPUESTA_BASE);
        const prog2 = semestres[1].asignaturas[0];

        expect(prog2.prerrequisitos).toEqual(['ICC-001']);
    });

    it('retorna un array vacio si no hay asignaturas', () => {
        const semestres = adaptarMeshAFrontend({ idCarrera: 'icc', asignaturas: [] });

        expect(semestres).toHaveLength(0);
    });
});

describe('adaptarStatusABackend', () => {
    it('convierte todos los status del frontend al estado del backend', () => {
        expect(adaptarStatusABackend('disponible')).toBe('disponible');
        expect(adaptarStatusABackend('bloqueado')).toBe('bloqueada');
        expect(adaptarStatusABackend('aprobado')).toBe('aprobada');
        expect(adaptarStatusABackend('cursando')).toBe('en_curso');
        expect(adaptarStatusABackend('reprobado')).toBe('reprobada');
    });
});
