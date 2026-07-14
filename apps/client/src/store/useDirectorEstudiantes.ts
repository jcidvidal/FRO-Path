import { useCallback, useEffect, useState } from 'react';
import {
    buscarEstudiantes,
    obtenerMallaEstudiante,
    type EstudianteResumen,
} from '../services/directorService';
import type { Semester, Subject } from '../types/malla';

const RETARDO_BUSQUEDA_MS = 300;

interface UseBusquedaEstudiantesResult {
    estudiantes: EstudianteResumen[];
    cargando: boolean;
    error: string | null;
    recargar: () => void;
}

export function useBusquedaEstudiantes(busqueda: string): UseBusquedaEstudiantesResult {
    const [estudiantes, setEstudiantes] = useState<EstudianteResumen[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [version, setVersion] = useState(0);

    const recargar = useCallback(() => {
        setVersion((valor) => valor + 1);
    }, []);

    useEffect(() => {
        let activo = true;

        const cargar = async () => {
            setCargando(true);
            setError(null);
            try {
                const datos = await buscarEstudiantes(busqueda);
                if (activo) {
                    setEstudiantes(datos);
                }
            } catch (err: unknown) {
                if (activo) {
                    setError(err instanceof Error ? err.message : 'Error al buscar estudiantes');
                }
            } finally {
                if (activo) {
                    setCargando(false);
                }
            }
        };

        const temporizador = setTimeout(() => {
            void cargar();
        }, RETARDO_BUSQUEDA_MS);

        return () => {
            activo = false;
            clearTimeout(temporizador);
        };
    }, [busqueda, version]);

    return { estudiantes, cargando, error, recargar };
}

interface UseMallaEstudianteResult {
    semestres: Semester[];
    modulosIngles: Subject[];
    practicas: Subject[];
    cargando: boolean;
    error: string | null;
}

export function useMallaEstudiante(
    idCarrera: string,
    idEstudiante: number | null,
): UseMallaEstudianteResult {
    const [semestres, setSemestres] = useState<Semester[]>([]);
    const [modulosIngles, setModulosIngles] = useState<Subject[]>([]);
    const [practicas, setPracticas] = useState<Subject[]>([]);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let activo = true;

        const cargar = async () => {
            if (idEstudiante === null) {
                setSemestres([]);
                setModulosIngles([]);
                setPracticas([]);
                setError(null);
                return;
            }

            setCargando(true);
            setError(null);
            try {
                const datos = await obtenerMallaEstudiante(idCarrera, idEstudiante);
                if (activo) {
                    setSemestres(datos.semestres);
                    setModulosIngles(datos.modulosIngles);
                    setPracticas(datos.practicas);
                }
            } catch (err: unknown) {
                if (activo) {
                    setError(err instanceof Error ? err.message : 'Error al cargar la malla');
                }
            } finally {
                if (activo) {
                    setCargando(false);
                }
            }
        };

        void cargar();

        return () => {
            activo = false;
        };
    }, [idCarrera, idEstudiante]);

    return { semestres, modulosIngles, practicas, cargando, error };
}