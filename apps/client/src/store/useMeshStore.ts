import { useState, useEffect, useCallback, useRef } from 'react';
import { apiClient } from '../services/apiClient';
import {
    adaptarMeshAFrontend,
    adaptarStatusABackend,
    type BackendMeshResponse,
    type BackendCambioEstadoResponse,
    type AnalisisIaResponse,
} from '../services/meshAdapter';
import type { Semester, Subject, SubjectStatus } from '../types/malla';

const RETARDO_ANALISIS_MS = 800;

interface UseMeshResult {
    semestres: Semester[];
    modulosIngles: Subject[];
    practicas: Subject[];
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

function desbloquearSemestres(prev: Semester[], ids: string[]): Semester[] {
    return prev.map((sem) => ({
        ...sem,
        asignaturas: sem.asignaturas.map((sub) =>
            ids.includes(sub.id) ? { ...sub, status: 'disponible' as SubjectStatus } : sub
        ),
    }));
}

function desbloquearColeccion(items: Subject[], ids: string[]): Subject[] {
    return items.map((sub) =>
        ids.includes(sub.id) ? { ...sub, status: 'disponible' as SubjectStatus } : sub
    );
}

export function useMesh(idCarrera: string): UseMeshResult {
    const [semestres, setSemestres] = useState<Semester[]>([]);
    const [modulosIngles, setModulosIngles] = useState<Subject[]>([]);
    const [practicas, setPracticas] = useState<Subject[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [comentarioIa, setComentarioIa] = useState<string | null>(null);
    const [analizando, setAnalizando] = useState(false);
    const semestresRef = useRef<Semester[]>([]);
    semestresRef.current = semestres;
    const modulosInglesRef = useRef<Subject[]>([]);
    modulosInglesRef.current = modulosIngles;
    const practicasRef = useRef<Subject[]>([]);
    practicasRef.current = practicas;
    const timeoutAnalisisRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        let mounted = true;
        setIsLoading(true);
        setError(null);

        apiClient.get<BackendMeshResponse>(`/mesh/${idCarrera}`)
            .then((data) => {
                if (mounted) {
                    const { semestres, modulosIngles, practicas } = adaptarMeshAFrontend(data);
                    setSemestres(semestres);
                    setModulosIngles(modulosIngles);
                    setPracticas(practicas);
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
            apiClient.post<AnalisisIaResponse>(`/mesh/${idCarrera}/analisis-ia`)
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
        const buscarEnSemestres = (): SubjectStatus | null => {
            for (const sem of semestresRef.current) {
                const sub = sem.asignaturas.find((s) => s.id === idAsignatura);
                if (sub) return sub.status;
            }
            return null;
        };
        const buscarEnLista = (items: Subject[]): SubjectStatus | null => {
            const sub = items.find((s) => s.id === idAsignatura);
            return sub ? sub.status : null;
        };

        const estadoAnterior = buscarEnSemestres()
            ?? buscarEnLista(modulosInglesRef.current)
            ?? buscarEnLista(practicasRef.current)
            ?? 'bloqueado';

        // Actualización optimista en las 3 colecciones
        setSemestres((prev) => actualizarEstado(prev, idAsignatura, nuevoEstado));
        setModulosIngles((prev) => prev.map(s => s.id === idAsignatura ? { ...s, status: nuevoEstado } : s));
        setPracticas((prev) => prev.map(s => s.id === idAsignatura ? { ...s, status: nuevoEstado } : s));

        apiClient.patch<BackendCambioEstadoResponse>(`/mesh/${idCarrera}/estado`, {
            idAsignatura,
            estado: adaptarStatusABackend(nuevoEstado),
        })
            .then((resultado) => {
                if (resultado.idsAsignaturasDesbloqueadas.length > 0) {
                    setSemestres((prev) => desbloquearSemestres(prev, resultado.idsAsignaturasDesbloqueadas));
                    setModulosIngles((prev) => desbloquearColeccion(prev, resultado.idsAsignaturasDesbloqueadas));
                    setPracticas((prev) => desbloquearColeccion(prev, resultado.idsAsignaturasDesbloqueadas));
                }
                programarAnalisis();
            })
            .catch(() => {
                // Revertir en las 3 colecciones
                setSemestres((prev) => actualizarEstado(prev, idAsignatura, estadoAnterior));
                setModulosIngles((prev) => prev.map(s => s.id === idAsignatura ? { ...s, status: estadoAnterior } : s));
                setPracticas((prev) => prev.map(s => s.id === idAsignatura ? { ...s, status: estadoAnterior } : s));
            });
    }, [idCarrera, programarAnalisis]);

    return {
        semestres,
        modulosIngles,
        practicas,
        isLoading,
        error,
        cambiarEstado,
        comentarioIa,
        analizando,
    };
}