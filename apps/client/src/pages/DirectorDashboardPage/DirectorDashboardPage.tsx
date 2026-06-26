import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DashboardLayout } from '../../layouts/DashboardLayout/DashboardLayout';
import { AppSidebar } from '../../components/auth/AppSidebar/AppSidebar';
import { MeshGrid } from '../../components/mesh/MeshGrid';
import { useMesh } from '../../store/useMeshStore';
import { listarCarreras } from '../../services/carreraService';
import {
    useBusquedaEstudiantes,
    useMallaEstudiante,
} from '../../store/useDirectorEstudiantes';
import { nombreCompleto } from '../../services/directorService';
import type { CarreraDto } from '../../services/carreraService';
import type { Semester, Subject, SubjectStatus } from '../../types/malla';
import styles from './DirectorDashboardPage.module.css';

function SearchIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.searchIcon}>
            <circle cx="7" cy="7" r="5.5" stroke="#6b7280" strokeWidth="1.5" />
            <path d="M11 11L14.5 14.5" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    );
}

function UserIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.userIcon}>
            <circle cx="10" cy="7" r="3.5" stroke="var(--color-green)" strokeWidth="1.5" />
            <path d="M3 18C3 14.5 6.5 12 10 12C13.5 12 17 14.5 17 18" stroke="var(--color-green)" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    );
}

function resolverDependencias(
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
            if (allMet) {
                subject.status = 'disponible';
                changed = true;
            }
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
            if (anyMissing) {
                subject.status = 'bloqueado';
                changed = true;
            }
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

function StudentProgressView() {
    const [search, setSearch] = useState('');
    const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
    const [carreraFilter, setCarreraFilter] = useState('todas');
    const [carreras, setCarreras] = useState<CarreraDto[]>([]);
    const [statusOverrides, setStatusOverrides] = useState<Record<string, SubjectStatus>>({});

    useEffect(() => {
        listarCarreras()
            .then(setCarreras)
            .catch(() => setCarreras([]));
    }, []);

    useEffect(() => {
        setStatusOverrides({});
    }, [selectedStudentId]);

    const { estudiantes, cargando, error } = useBusquedaEstudiantes(search);

    const selectedStudent = estudiantes.find((s) => s.id === selectedStudentId) ?? null;

    const {
        semestres,
        modulosIngles,
        practicas,
        cargando: cargandoMalla,
        error: errorMalla,
    } = useMallaEstudiante('icc', selectedStudentId);

    const resolved = useMemo(
        () => resolverDependencias(semestres, modulosIngles, practicas, statusOverrides),
        [semestres, modulosIngles, practicas, statusOverrides],
    );
    const overrideSemestres = resolved.semestres;
    const overrideModulos = resolved.modulos;
    const overridePracticas = resolved.practicas;

    const totalSct = useMemo(
        () => overrideSemestres.flatMap((s) => s.asignaturas).reduce((acc, a) => acc + a.sct, 0),
        [overrideSemestres],
    );

    const aprobadoSct = useMemo(
        () => overrideSemestres
            .flatMap((s) => s.asignaturas)
            .filter((a) => a.status === 'aprobado')
            .reduce((acc, a) => acc + a.sct, 0),
        [overrideSemestres],
    );

    const porcentaje = totalSct > 0 ? Math.round((aprobadoSct / totalSct) * 100) : 0;

    const countByStatus = (status: string) =>
        overrideSemestres.flatMap((s) => s.asignaturas).filter((a) => a.status === status).length
        + overrideModulos.filter((a) => a.status === status).length
        + overridePracticas.filter((a) => a.status === status).length;

    const handleStatusChange = (subjectId: string, newStatus: SubjectStatus) => {
        setStatusOverrides(prev => ({ ...prev, [subjectId]: newStatus }));
    };

    return (
        <div className={styles.avancesContainer}>
            <h2 className={styles.subtitle}>Avance de Estudiantes</h2>
            <div className={styles.filters}>
                <div className={styles.searchWrapper}>
                    <SearchIcon />
                    <input className={styles.searchInput} placeholder="Buscar por nombre o email..." value={search} onChange={(e) => setSearch(e.target.value)} aria-label="Buscar estudiantes" />
                </div>
                <select className={styles.carreraSelect} value={carreraFilter} onChange={(e) => setCarreraFilter(e.target.value)} aria-label="Filtrar por carrera">
                    <option value="todas">Todas las carreras</option>
                    {carreras.map((c) => (
                        <option key={c.codigo_carrera} value={c.codigo_carrera}>{c.nombre}</option>
                    ))}
                </select>
            </div>
            <div className={styles.mainPanel}>
                <div className={styles.studentList}>
                    <p className={styles.listTitle}>Estudiantes ({estudiantes.length})</p>
                    <div className={styles.studentItems} role="listbox" aria-label="Lista de estudiantes">
                        {cargando && <p className={styles.placeholder}>Buscando...</p>}
                        {error && <p className={styles.placeholder}>{error}</p>}
                        {!cargando && !error && estudiantes.length === 0 && <p className={styles.placeholder}>No se encontraron estudiantes.</p>}
                        {estudiantes.map((s) => (
                            <button key={s.id} className={`${styles.studentItem} ${selectedStudent?.id === s.id ? styles.studentItemActive : ''}`} onClick={() => setSelectedStudentId(s.id)} role="option" aria-selected={selectedStudent?.id === s.id}>
                                <UserIcon />
                                <div className={styles.studentInfo}>
                                    <span className={styles.studentName}>{nombreCompleto(s)}</span>
                                    <div className={styles.studentMeta}>
                                        <span className={styles.studentRut}>{s.email}</span>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
                <div className={styles.meshPanel}>
                    {!selectedStudent ? (
                        <p className={styles.placeholder}>Seleccione un estudiante para ver su avance</p>
                    ) : cargandoMalla ? (
                        <p className={styles.placeholder}>Cargando malla...</p>
                    ) : errorMalla ? (
                        <p className={styles.placeholder}>{errorMalla}</p>
                    ) : (
                        <>
                            <div className={styles.meshArea}>
                                <MeshGrid semestres={overrideSemestres} modulosIngles={overrideModulos} practicas={overridePracticas} onStatusChange={handleStatusChange} />
                            </div>
                            <div className={styles.studentDetail}>
                                <div className={styles.detailCard}>
                                    <p className={styles.detailTitle}>Informacion del estudiante</p>
                                    <p>Nombre: {nombreCompleto(selectedStudent)}</p>
                                    <p>Email: {selectedStudent.email}</p>
                                </div>
                                <div className={styles.detailCard}>
                                    <p className={styles.detailTitle}>Avance Curricular</p>
                                    <div className={styles.progresoHeader}>
                                        <span>Progreso</span>
                                        <span className={styles.sctGreen}>{aprobadoSct} / {totalSct} sct</span>
                                    </div>
                                    <div className={styles.progressBar}>
                                        <div className={styles.progressFill} style={{ width: `${porcentaje}%` }} />
                                    </div>
                                    <span className={styles.porcentaje}>{porcentaje}%</span>
                                </div>
                                <div className={styles.detailStats}>
                                    <p><span className={`${styles.dot} ${styles.dotAprobado}`} /> Aprobadas: {countByStatus('aprobado')}</p>
                                    <p><span className={`${styles.dot} ${styles.dotReprobado}`} /> Reprobadas: {countByStatus('reprobado')}</p>
                                    <p><span className={`${styles.dot} ${styles.dotCursando}`} /> Cursando: {countByStatus('cursando')}</p>
                                    <p><span className={`${styles.dot} ${styles.dotDisponible}`} /> Disponible: {countByStatus('disponible')}</p>
                                    <p><span className={`${styles.dot} ${styles.dotBloqueado}`} /> Bloqueado: {countByStatus('bloqueado')}</p>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export function DirectorDashboardPage() {
    const [searchParams] = useSearchParams();
    const view = searchParams.get('view') || 'mallas';
    const [carreras, setCarreras] = useState<CarreraDto[]>([]);
    const [selectedCareerId, setSelectedCareerId] = useState('icc');

    useEffect(() => {
        listarCarreras().then(setCarreras).catch(() => setCarreras([]));
    }, []);

    const { semestres, modulosIngles, practicas, isLoading } = useMesh(selectedCareerId);
    const selectedCareer = carreras.find((c) => c.codigo_carrera === selectedCareerId);

    return (
        <DashboardLayout sidebar={(onCloseSidebar) => (<AppSidebar onCloseSidebar={onCloseSidebar} />)}>
            <div className={styles.content}>
                {view === 'mallas' ? (
                    <>
                        <div className={styles.toolbar}>
                            <label htmlFor="director-career-select" className={styles.selectLabel}>Seleccionar Carrera</label>
                            <select id="director-career-select" className={styles.careerSelect} value={selectedCareerId} onChange={(e) => setSelectedCareerId(e.target.value)}>
                                <option value="">-- Seleccione una carrera --</option>
                                {carreras.map((c) => (<option key={c.id} value={c.codigo_carrera}>{c.nombre}</option>))}
                            </select>
                        </div>
                        <h3 className={styles.careerTitle}>{selectedCareer?.nombre}</h3>
                        <div className={styles.mainPanel}>
                            <div className={styles.meshArea}>
                                {isLoading ? (<p className={styles.placeholder}>Cargando malla...</p>) : (
                                    <MeshGrid semestres={semestres} modulosIngles={modulosIngles} practicas={practicas} readOnly />
                                )}
                            </div>
                        </div>
                    </>
                ) : (
                    <StudentProgressView />
                )}
            </div>
        </DashboardLayout>
    );
}
