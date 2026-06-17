import { MeshGrid } from './MeshGrid';
import type { SubjectStatus } from '../../types/malla';
import { useMesh } from '../../store/useMeshStore';
import styles from './MeshContainer.module.css';
import bandurrIA from '../../assets/imagenes/Bandurrias/badurrIA.png';

const ID_CARRERA = 'icc';

export function MeshContainer() {
    const { semestres, isLoading, error, cambiarEstado } = useMesh(ID_CARRERA);

    const totalSct = semestres.flatMap((s) => s.asignaturas).reduce((acc, a) => acc + a.sct, 0);
    const aprobadoSct = semestres
        .flatMap((s) => s.asignaturas)
        .filter((a) => a.status === 'aprobado')
        .reduce((acc, a) => acc + a.sct, 0);
    const porcentaje = totalSct === 0 ? 0 : Math.round((aprobadoSct / totalSct) * 100);

    function handleStatusChange(subjectId: string, newStatus: SubjectStatus) {
        cambiarEstado(subjectId, newStatus);
    }

    return (
        <div className={styles.container}>
            <div className={styles.infoBar}>
                <div className={styles.infoLeft}>
                    <p className={styles.carrera}>ingenieria informatica</p>
                    <div className={styles.progreso}>
                        <div className={styles.progresoHeader}>
                            <span>Avance Curricular</span>
                            <span>{aprobadoSct} / {totalSct} sct</span>
                        </div>
                        <div className={styles.progressBar}>
                            <div
                                className={styles.progressFill}
                                style={{ width: `${porcentaje}%` }}
                            />
                        </div>
                        <span className={styles.porcentaje}>{porcentaje}%</span>
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
                        <p className={styles.bandurrText}>
                            Aqui apareceran sugerencias y mensajes del asistente inteligente sobre tu progreso academico.
                        </p>
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
