import { useMesh } from '../../store/useMeshStore';
import { useAuth } from '../../services/AuthContext';
import { MeshGrid } from './MeshGrid';
import type { SubjectStatus } from '../../types/malla';
import styles from './MeshContainer.module.css';
import bandurrIA from '../../assets/imagenes/Bandurrias/badurrIA.png';

const DEFAULT_CAREER_ID = 'ii';

export function MeshContainer() {
    const { user } = useAuth();
    const careerId = user?.idCarrera ?? DEFAULT_CAREER_ID;
    const careerName = user?.nombreCarrera ?? 'Malla curricular';

    const {
        semestres,
        modulosIngles,
        practicas,
        isLoading,
        error,
        cambiarEstado,
        comentarioIa,
        analizando,
    } = useMesh(careerId);

    const meshSubjects = semestres.flatMap((s) => s.asignaturas);
    const totalSct = meshSubjects.reduce((acc, a) => acc + a.sct, 0);
    const approvedSct = meshSubjects
        .filter((a) => a.status === 'aprobado')
        .reduce((acc, a) => acc + a.sct, 0);
    const inProgressSct = meshSubjects
        .filter((a) => a.status === 'cursando')
        .reduce((acc, a) => acc + a.sct, 0);
    const approvedPercentage = totalSct === 0 ? 0 : Math.round((approvedSct / totalSct) * 100);
    const inProgressPercentage = totalSct === 0 ? 0 : Math.round((inProgressSct / totalSct) * 100);

    function handleStatusChange(subjectId: string, newStatus: SubjectStatus) {
        cambiarEstado(subjectId, newStatus);
    }

    return (
        <div className={styles.container}>
            <div className={styles.infoBar}>
                <div className={styles.infoLeft}>
                    <p className={styles.carrera}>{careerName}</p>
                    <div className={styles.progreso}>
                        <div className={styles.progresoHeader}>
                            <span>Avance Curricular</span>
                            <span>{approvedSct + inProgressSct} / {totalSct} sct</span>
                        </div>
                        <div className={styles.progressBar}>
                            <div
                                className={styles.progressFill}
                                style={{ width: `${approvedPercentage}%` }}
                            />
                            <div
                                className={styles.progressFillCursando}
                                style={{ width: `${inProgressPercentage}%` }}
                            />
                        </div>
                        <span className={styles.porcentaje}>{approvedPercentage + inProgressPercentage}%</span>
                    </div>
                </div>

                <div className={styles.bandurrSection}>
                    <div className={styles.bandurrTitleRow}>
                        <img
                            src={bandurrIA}
                            alt="Bandurr-IA"
                            className={styles.bandurrIcon}
                        />
                        <span className={styles.bandurrTitle}>Bandurr-IA</span>
                    </div>
                    <div className={styles.bandurrBox}>
                        {analizando && (
                            <p className={styles.bandurrText}>
                                Analizando tu carga académica...
                            </p>
                        )}

                        {!analizando && comentarioIa && (
                            <p className={styles.bandurrComentario}>{comentarioIa}</p>
                        )}
                    </div>
                </div>
            </div>

            {isLoading && (
                <div className={styles.estadoCarga}>Cargando malla curricular...</div>
            )}

            {error && (
                <div className={styles.estadoError}>{error}</div>
            )}

            {!isLoading && !error && (
                <MeshGrid
                    semestres={semestres}
                    modulosIngles={modulosIngles}
                    practicas={practicas}
                    onStatusChange={handleStatusChange}
                />
            )}

            <div className={styles.leyenda}>
                <span className={styles.leyendaItem}>
                    <span className={`${styles.dot} ${styles.dotAprobado}`} /> Aprobado
                </span>
                <span className={styles.leyendaItem}>
                    <span className={`${styles.dot} ${styles.dotReprobado}`} /> Reprobado
                </span>
                <span className={styles.leyendaItem}>
                    <span className={`${styles.dot} ${styles.dotCursando}`} /> Cursando
                </span>
                <span className={styles.leyendaItem}>
                    <span className={`${styles.dot} ${styles.dotDisponible}`} /> Disponible
                </span>
                <span className={styles.leyendaItem}>
                    <span className={`${styles.dot} ${styles.dotBloqueado}`} /> Bloqueado
                </span>
            </div>
        </div>
    );
}
