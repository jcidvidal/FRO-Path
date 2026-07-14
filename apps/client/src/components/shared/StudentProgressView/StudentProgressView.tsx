import { useState, useEffect, useMemo } from 'react';
import { MeshGrid } from '../../mesh/MeshGrid';
import { SearchIcon, UserIcon } from '../../icons/Icons';
import { useBusquedaEstudiantes, useMallaEstudiante } from '../../../store/useDirectorEstudiantes';
import { listarCarreras, type CarreraDto } from '../../../services/carreraService';
import { nombreCompleto } from '../../../services/directorService';
import { resolveDependencies } from '../../mesh/utils';
import type { SubjectStatus } from '../../../types/malla';
import styles from './StudentProgressView.module.css';

export function StudentProgressView({ careerId }: { careerId?: string }) {
    const [search, setSearch] = useState('');
    const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
    const [statusOverrides, setStatusOverrides] = useState<Record<string, SubjectStatus>>({});
    const [careerFilter, setCareerFilter] = useState('all');
    const [careers, setCareers] = useState<CarreraDto[]>([]);

    useEffect(() => { setStatusOverrides({}); }, [selectedStudentId]);

    useEffect(() => {
        listarCarreras().then(setCareers).catch(() => setCareers([]));
    }, []);

    const { estudiantes, cargando, error } = useBusquedaEstudiantes(search);
    const selectedStudent = estudiantes.find((s) => s.id === selectedStudentId) ?? null;

    const filteredStudents = careerFilter === 'all'
        ? estudiantes
        : estudiantes.filter((s) => s.idCarrera === careerFilter);

    const {
        semestres,
        modulosIngles,
        practicas,
        cargando: loadingMesh,
        error: meshError,
    } = useMallaEstudiante(careerId ?? 'icc', selectedStudentId);

    const resolved = useMemo(
        () => resolveDependencies(semestres, modulosIngles, practicas, statusOverrides),
        [semestres, modulosIngles, practicas, statusOverrides],
    );
    const overrideSemestres = resolved.semestres;
    const overrideModulos = resolved.modulos;
    const overridePracticas = resolved.practicas;

    const totalSct = useMemo(
        () => overrideSemestres.flatMap((s) => s.asignaturas).reduce((acc, a) => acc + a.sct, 0),
        [overrideSemestres],
    );
    const approvedSct = useMemo(
        () => overrideSemestres
            .flatMap((s) => s.asignaturas)
            .filter((a) => a.status === 'aprobado')
            .reduce((acc, a) => acc + a.sct, 0),
        [overrideSemestres],
    );
    const percentage = totalSct > 0 ? Math.round((approvedSct / totalSct) * 100) : 0;

    const countByStatus = (status: string) =>
        overrideSemestres.flatMap((s) => s.asignaturas).filter((a) => a.status === status).length
        + overrideModulos.filter((a) => a.status === status).length
        + overridePracticas.filter((a) => a.status === status).length;

    const handleStatusChange = (subjectId: string, newStatus: SubjectStatus) => {
        setStatusOverrides(prev => ({ ...prev, [subjectId]: newStatus }));
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Avance de Estudiantes</h2>
            <div className={styles.filters}>
                <div className={styles.searchWrapper}>
                    <SearchIcon />
                    <input
                        className={styles.searchInput}
                        placeholder="Buscar por nombre o email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        aria-label="Buscar estudiantes"
                    />
                </div>
                <select
                    className={styles.careerSelect}
                    value={careerFilter}
                    onChange={(e) => setCareerFilter(e.target.value)}
                    aria-label="Filtrar por carrera"
                >
                    <option value="all">Todas las carreras</option>
                    {careers.map((c) => (
                        <option key={c.codigo_carrera} value={c.codigo_carrera}>{c.nombre}</option>
                    ))}
                </select>
            </div>
            <div className={styles.mainPanel}>
                <div className={styles.studentList}>
                    <p className={styles.listTitle}>Estudiantes ({filteredStudents.length})</p>
                    <div className={styles.studentItems} role="listbox" aria-label="Lista de estudiantes">
                        {cargando && <p className={styles.placeholder}>Buscando...</p>}
                        {error && <p className={styles.placeholder}>{error}</p>}
                        {!cargando && !error && filteredStudents.length === 0 && (
                            <p className={styles.placeholder}>No se encontraron estudiantes.</p>
                        )}
                        {filteredStudents.map((s) => (
                            <button
                                key={s.id}
                                className={`${styles.studentItem} ${selectedStudent?.id === s.id ? styles.studentItemActive : ''}`}
                                onClick={() => setSelectedStudentId(s.id)}
                                role="option"
                                aria-selected={selectedStudent?.id === s.id}
                            >
                                <UserIcon />
                                <div className={styles.studentInfo}>
                                    <span className={styles.studentName}>{nombreCompleto(s)}</span>
                                    <div className={styles.studentMeta}>
                                        <span className={styles.studentEmail}>{s.email}</span>
                                        {s.nombreCarrera && <span className={styles.studentCareer}>{s.nombreCarrera}</span>}
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
                <div className={styles.meshPanel}>
                    {!selectedStudent ? (
                        <p className={styles.placeholder}>Seleccione un estudiante para ver su avance</p>
                    ) : loadingMesh ? (
                        <p className={styles.placeholder}>Cargando malla...</p>
                    ) : meshError ? (
                        <p className={styles.placeholder}>{meshError}</p>
                    ) : (
                        <>
                            <div className={styles.meshArea}>
                                <MeshGrid
                                    semestres={overrideSemestres}
                                    modulosIngles={overrideModulos}
                                    practicas={overridePracticas}
                                    onStatusChange={handleStatusChange}
                                />
                            </div>
                            <div className={styles.studentDetail}>
                                <div className={styles.detailCard}>
                                    <p className={styles.detailTitle}>Informacion del estudiante</p>
                                    <p>Nombre: {nombreCompleto(selectedStudent)}</p>
                                    <p>Email: {selectedStudent.email}</p>
                                </div>
                                <div className={styles.detailCard}>
                                    <p className={styles.detailTitle}>Avance Curricular</p>
                                    <div className={styles.progressHeader}>
                                        <span>Progreso</span>
                                        <span className={styles.sctGreen}>{approvedSct} / {totalSct} sct</span>
                                    </div>
                                    <div className={styles.progressBar}>
                                        <div className={styles.progressFill} style={{ width: `${percentage}%` }} />
                                    </div>
                                    <span className={styles.percentage}>{percentage}%</span>
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
