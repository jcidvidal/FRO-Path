import { useState, useEffect, useCallback, useRef } from 'react';
import { apiClient } from '../services/apiClient';
import {
    adaptarMeshAFrontend,
    adaptarStatusABackend,
    type BackendMeshResponse,
    type BackendCambioEstadoResponse,
    type AnalisisIaResponse,
} from '../services/meshAdapter';
import type { Semester, SubjectStatus } from '../types/malla';

// Tiempo de espera tras el último cambio de estado antes de pedir el análisis,
// para no llamar a la IA en cada clic mientras el estudiante ajusta su malla.
const RETARDO_ANALISIS_MS = 800;

interface UseMeshResult {
    semestres: Semester[];
    isLoading: boolean;
    error: string | null;
    cambiarEstado: (idAsignatura: string, nuevoEstado: SubjectStatus) => void;
    comentarioIa: string | null;
    analizando: boolean;
}

function actualizarEstado(prev: Semester[], idAsignatura: string, status: SubjectStatus): Semester[] {
    return prev.map((sem) => ({
        ...sem,
        asignaturas: sem.asignaturas.map((sub) =>
            sub.id === idAsignatura ? { ...sub, status } : sub
        ),
    }));
}

function desbloquear(prev: Semester[], ids: string[]): Semester[] {
    return prev.map((sem) => ({
        ...sem,
        asignaturas: sem.asignaturas.map((sub) =>
            ids.includes(sub.id) ? { ...sub, status: 'disponible' } : sub
        ),
    }));
}

export function useMesh(idCarrera: string): UseMeshResult {
    const [semestres, setSemestres] = useState<Semester[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [comentarioIa, setComentarioIa] = useState<string | null>(null);
    const [analizando, setAnalizando] = useState(false);
    const semestresRef = useRef<Semester[]>([]);
    semestresRef.current = semestres;
    const timeoutAnalisisRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        let mounted = true;
        setIsLoading(true);
        setError(null);

        apiClient.get<BackendMeshResponse>(`/mesh/${idCarrera}`)
            .then((data) => {
                if (mounted) {
                    setSemestres(adaptarMeshAFrontend(data));
                    setIsLoading(false);
                }
            })
            .catch((err: unknown) => {
                if (mounted) {
                    setError(err instanceof Error ? err.message : 'Error al cargar la malla');
                    setIsLoading(false);
                }
            });

        return () => { mounted = false; };
    }, [idCarrera]);

    // Limpia cualquier análisis pendiente al desmontar.
    useEffect(() => {
        return () => {
            if (timeoutAnalisisRef.current) {
                clearTimeout(timeoutAnalisisRef.current);
            }
        };
    }, []);

    const programarAnalisis = useCallback(() => {
        if (timeoutAnalisisRef.current) {
            clearTimeout(timeoutAnalisisRef.current);
        }

        setAnalizando(true);
        timeoutAnalisisRef.current = setTimeout(() => {
            apiClient.post<AnalisisIaResponse>(
                `/mesh/${idCarrera}/analisis-ia`,
            )
                .then((resultado) => {
                    setComentarioIa(resultado.comentario);
                    setAnalizando(false);
                })
                .catch(() => {
                    setAnalizando(false);
                });
        }, RETARDO_ANALISIS_MS);
    }, [idCarrera]);

    const cambiarEstado = useCallback((idAsignatura: string, nuevoEstado: SubjectStatus) => {
        let estadoAnterior: SubjectStatus = 'bloqueado';
        for (const sem of semestresRef.current) {
            const sub = sem.asignaturas.find((s) => s.id === idAsignatura);
            if (sub) { estadoAnterior = sub.status; break; }
        }

        setSemestres((prev) => actualizarEstado(prev, idAsignatura, nuevoEstado));

        apiClient.patch<BackendCambioEstadoResponse>(`/mesh/${idCarrera}/estado`, {
            idAsignatura,
            estado: adaptarStatusABackend(nuevoEstado),
        })
            .then((resultado) => {
                if (resultado.idsAsignaturasDesbloqueadas.length > 0) {
                    setSemestres((prev) => desbloquear(prev, resultado.idsAsignaturasDesbloqueadas));
                }
                programarAnalisis();
            })
            .catch(() => {
                setSemestres((prev) => actualizarEstado(prev, idAsignatura, estadoAnterior));
            });
    }, [idCarrera, programarAnalisis]);

    return {
        semestres,
        isLoading,
        error,
        cambiarEstado,
        comentarioIa,
        analizando,
    };
}
