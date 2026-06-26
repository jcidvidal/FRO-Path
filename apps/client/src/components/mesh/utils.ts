import type { Subject, Semester, SubjectStatus } from '../../types/malla';

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

export function resolveDependencies(
    semestres: Semester[],
    modulosIngles: Subject[],
    practicas: Subject[],
    overrides: Record<string, SubjectStatus>,
): { semestres: Semester[]; modulos: Subject[]; practicas: Subject[] } {
    const allSubjects = new Map<string, Subject>();

    for (const sem of semestres) {
        for (const sub of sem.asignaturas) {
            allSubjects.set(sub.id, { ...sub });
        }
    }
    for (const sub of modulosIngles) {
        if (!allSubjects.has(sub.id)) allSubjects.set(sub.id, { ...sub });
    }
    for (const sub of practicas) {
        if (!allSubjects.has(sub.id)) allSubjects.set(sub.id, { ...sub });
    }

    for (const [id, status] of Object.entries(overrides)) {
        const s = allSubjects.get(id);
        if (s) s.status = status;
    }

    let changed = true;
    let iter = 0;
    while (changed && iter < 50) {
        changed = false;
        iter++;
        for (const [, subject] of allSubjects) {
            if (subject.status !== 'bloqueado') continue;
            const prereqs = subject.prerrequisitos ?? [];
            if (prereqs.length === 0) continue;
            const allMet = prereqs.every((prereqId) => {
                const p = allSubjects.get(prereqId);
                return p && p.status === 'aprobado';
            });
            if (allMet) { subject.status = 'disponible'; changed = true; }
        }
    }

    changed = true;
    iter = 0;
    while (changed && iter < 50) {
        changed = false;
        iter++;
        for (const [, subject] of allSubjects) {
            if (subject.status !== 'disponible') continue;
            if (overrides[subject.id]) continue;
            const prereqs = subject.prerrequisitos ?? [];
            if (prereqs.length === 0) continue;
            const anyMissing = prereqs.some((prereqId) => {
                const p = allSubjects.get(prereqId);
                return !p || p.status !== 'aprobado';
            });
            if (anyMissing) { subject.status = 'bloqueado'; changed = true; }
        }
    }

    const newSemestres = semestres.map((sem) => ({
        ...sem,
        asignaturas: sem.asignaturas.map((sub) => allSubjects.get(sub.id) ?? sub),
    }));
    const newModulos = modulosIngles.map((sub) => allSubjects.get(sub.id) ?? sub);
    const newPracticas = practicas.map((sub) => allSubjects.get(sub.id) ?? sub);
    return { semestres: newSemestres, modulos: newModulos, practicas: newPracticas };
}