import type { Subject, Semester } from '../../types/malla';

export function findSubjectById(
    semestres: Semester[],
    modulosIngles: Subject[] | undefined,
    practicas: Subject[] | undefined,
    id?: string | null,
): Subject | null {
    if (!id) return null;
    const all: Subject[] = [
        ...semestres.flatMap((s) => s.asignaturas),
        ...(modulosIngles || []),
        ...(practicas || []),
    ];
    return all.find((s) => s.id === id) ?? null;
}