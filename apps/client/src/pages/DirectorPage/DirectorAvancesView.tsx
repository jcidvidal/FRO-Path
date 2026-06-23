import { useState } from 'react';
import { MeshGrid } from '../../components/mesh/MeshGrid';
import { mockStudents } from '../../data/studentsData';
import { SearchIcon, UserIcon } from '../../components/icons/Icons';
import type { SubjectStatus, SubjectStatus as Status } from '../../types/malla';
import styles from './DirectorPage.module.css';

const STATUS_LIST: Status[] = ['aprobado', 'reprobado', 'cursando', 'disponible', 'bloqueado'];

export function DirectorAvancesView() {
    const [search, setSearch] = useState('');
    const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
    const [carreraFilter, setCarreraFilter] = useState('todas');

    const [studentsState, setStudentsState] = useState(() =>
        mockStudents.map((s) => ({ ...s, semestres: s.semestres.map((sem) => ({ ...sem, asignaturas: [...sem.asignaturas] })) }))
    );

    const selectedStudent = studentsState.find((s) => s.id === selectedStudentId) ?? null;

    const filtered = studentsState.filter((s) => {
        const matchSearch =
            s.nombre.toLowerCase().includes(search.toLowerCase()) ||
            s.rut.includes(search);
        const matchCarrera = carreraFilter === 'todas' || s.carrera === carreraFilter;
        return matchSearch && matchCarrera;
    });

    const carreras = [...new Set(mockStudents.map((s) => s.carrera))];

    const allSubjects = selectedStudent
        ? selectedStudent.semestres.flatMap((s) => s.asignaturas)
        : [];

    const totalSct = allSubjects.reduce((acc, a) => acc + a.sct, 0);
    const aprobadoSct = allSubjects.filter((a) => a.status === 'aprobado').reduce((acc, a) => acc + a.sct, 0);
    const porcentaje = totalSct > 0 ? Math.round((aprobadoSct / totalSct) * 100) : 0;

    const statusCounts = STATUS_LIST.reduce((acc, status) => {
        acc[status] = allSubjects.filter((a) => a.status === status).length;
        return acc;
    }, {} as Record<Status, number>);

    function handleStatusChange(subjectId: string, newStatus: SubjectStatus) {
        setStudentsState((prev) =>
            prev.map((student) => {
                if (student.id !== selectedStudentId) return student;
                return {
                    ...student,
                    semestres: student.semestres.map((sem) => ({
                        ...sem,
                        asignaturas: sem.asignaturas.map((sub) =>
                            sub.id === subjectId ? { ...sub, status: newStatus } : sub
                        ),
                    })),
                };
            })
        );
    }

    return (
        <>
            <h2 className={styles.subtitle}>Avance de Estudiantes</h2>

            <div className={styles.filters}>
                <div className={styles.searchWrapper}>
                    <SearchIcon className={styles.searchIcon} />
                    <input
                        className={styles.searchInput}
                        placeholder="Buscar por nombre o RUT..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <select
                    className={styles.carreraSelect}
                    value={carreraFilter}
                    onChange={(e) => setCarreraFilter(e.target.value)}
                >
                    <option value="todas">Todas las carreras</option>
                    {carreras.map((c) => (
                        <option key={c} value={c}>{c}</option>
                    ))}
                </select>
            </div>

            <div className={styles.mainPanel}>
                <div className={styles.studentList}>
                    <p className={styles.listTitle}>Estudiantes ({filtered.length})</p>
                    <div className={styles.studentItems}>
                        {filtered.map((s) => (
                            <button
                                key={s.id}
                                className={`${styles.studentItem} ${selectedStudent?.id === s.id ? styles.studentItemActive : ''}`}
                                onClick={() => setSelectedStudentId(s.id)}
                            >
                                <UserIcon className={styles.userIcon} />
                                <div className={styles.studentInfo}>
                                    <span className={styles.studentName}>{s.nombre}</span>
                                    <div className={styles.studentMeta}>
                                        <span className={styles.studentRut}>{s.rut}</span>
                                        <span className={styles.studentCarrera}>{s.carrera}</span>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                <div className={styles.meshPanel}>
                    {!selectedStudent ? (
                        <p className={styles.placeholder}>Seleccione un estudiante para ver su avance</p>
                    ) : (
                        <>
                            <div className={styles.meshArea}>
                                <MeshGrid
                                    semestres={selectedStudent.semestres}
                                    onStatusChange={handleStatusChange}
                                />
                            </div>

                            <div className={styles.studentDetail}>
                                <div className={styles.detailCard}>
                                    <p className={styles.detailTitle}>Informacion del estudiante</p>
                                    <p>Nombre: {selectedStudent.nombre}</p>
                                    <p>Rut: {selectedStudent.rut}</p>
                                    <p>Correo: {selectedStudent.email}</p>
                                    <p>Carrera: {selectedStudent.carrera}</p>
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
                                    <p><span className={`${styles.dot} ${styles.dotAprobado}`} /> Aprobadas: {statusCounts.aprobado}</p>
                                    <p><span className={`${styles.dot} ${styles.dotReprobado}`} /> Reprobadas: {statusCounts.reprobado}</p>
                                    <p><span className={`${styles.dot} ${styles.dotCursando}`} /> Cursando: {statusCounts.cursando}</p>
                                    <p><span className={`${styles.dot} ${styles.dotDisponible}`} /> Disponible: {statusCounts.disponible}</p>
                                    <p><span className={`${styles.dot} ${styles.dotBloqueado}`} /> Bloqueado: {statusCounts.bloqueado}</p>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}