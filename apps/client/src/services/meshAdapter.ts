import type { Semester, Subject, SubjectStatus } from '../types/malla';

export type BackendEstado = 'disponible' | 'bloqueada' | 'aprobada' | 'en_curso' | 'reprobada';

export interface BackendAsignatura {
    id: string;
    codigo: string;
    nombre: string;
    sct: number;
    nivel: number;
    estado: BackendEstado;
    idsPrerequisitos: string[];
}

export interface BackendMeshResponse {
    idCarrera: string;
    asignaturas: BackendAsignatura[];    // malla regular
    modulosIngles: BackendAsignatura[];  // módulos de inglés
    practicas: BackendAsignatura[];      // prácticas
}

export interface BackendCambioEstadoResponse {
    asignatura: BackendAsignatura;
    idsAsignaturasDesbloqueadas: string[];
    eventos: unknown[];
}

export interface AnalisisIaResponse {
    comentario: string;
}

export interface FrontendMalla {
    semestres: Semester[];        // malla agrupada por semestre (nivel)
    modulosIngles: Subject[];     // inglés como Subject[] planos
    practicas: Subject[];         // prácticas como Subject[] planos
}

const ESTADO_A_STATUS: Record<BackendEstado, SubjectStatus> = {
    disponible: 'disponible',
    bloqueada: 'bloqueado',
    aprobada: 'aprobado',
    en_curso: 'cursando',
    reprobada: 'reprobado',
};

const STATUS_A_ESTADO: Record<SubjectStatus, BackendEstado> = {
    disponible: 'disponible',
    bloqueado: 'bloqueada',
    aprobado: 'aprobada',
    cursando: 'en_curso',
    reprobado: 'reprobada',
};

export function adaptarMeshAFrontend(response: BackendMeshResponse): FrontendMalla {
    // Agrupar asignaturas de malla por nivel (igual que ahora)
    const porNivel = new Map<number, Subject[]>();
    for (const asig of response.asignaturas) {
        const subject: Subject = {
            id: asig.id,
            nombre: asig.nombre,
            sct: asig.sct,
            status: ESTADO_A_STATUS[asig.estado] ?? 'bloqueado',
            prerrequisitos: asig.idsPrerequisitos,
        };
        const lista = porNivel.get(asig.nivel) ?? [];
        lista.push(subject);
        porNivel.set(asig.nivel, lista);
    }

    // Mapear módulos de inglés (planos, sin agrupar por nivel)
    const modulosIngles: Subject[] = response.modulosIngles.map(asig => ({
        id: asig.id,
        nombre: asig.nombre,
        sct: asig.sct,
        status: ESTADO_A_STATUS[asig.estado] ?? 'bloqueado',
        prerrequisitos: asig.idsPrerequisitos,
    }));

    // Mapear prácticas (planas, sin agrupar por nivel)
    const practicas: Subject[] = response.practicas.map(asig => ({
        id: asig.id,
        nombre: asig.nombre,
        sct: asig.sct,
        status: ESTADO_A_STATUS[asig.estado] ?? 'bloqueado',
        prerrequisitos: asig.idsPrerequisitos,
    }));

    return {
        semestres: Array.from(porNivel.entries())
            .sort(([a], [b]) => a - b)
            .map(([nivel, asignaturas]) => ({ numero: nivel, asignaturas })),
        modulosIngles,
        practicas,
    };
}

export function adaptarStatusABackend(status: SubjectStatus): BackendEstado {
    return STATUS_A_ESTADO[status];
}
