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
    asignaturas: BackendAsignatura[];
}

export interface BackendCambioEstadoResponse {
    asignatura: BackendAsignatura;
    idsAsignaturasDesbloqueadas: string[];
    eventos: unknown[];
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

export function adaptarMeshAFrontend(response: BackendMeshResponse): Semester[] {
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

    return Array.from(porNivel.entries())
        .sort(([a], [b]) => a - b)
        .map(([nivel, asignaturas]) => ({ numero: nivel, asignaturas }));
}

export function adaptarStatusABackend(status: SubjectStatus): BackendEstado {
    return STATUS_A_ESTADO[status];
}
