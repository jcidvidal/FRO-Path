export type SubjectStatus = 'aprobado' | 'reprobado' | 'cursando' | 'disponible' | 'bloqueado';

export interface Subject {
    id: string;
    nombre: string;
    sct: number;
    status: SubjectStatus;
    prerrequisitos?: string[];
}

export interface Semester {
    numero: number;
    asignaturas: Subject[];
}