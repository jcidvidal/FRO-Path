import { MeshGrid } from './MeshGrid';
import type { SubjectStatus } from '../../types/malla';
import { useMesh } from '../../store/useMeshStore';
import { useAuth } from '../../services/AuthContext';
import styles from './MeshContainer.module.css';
import bandurrIA from '../../assets/imagenes/Bandurrias/badurrIA.png';

const ID_CARRERA_POR_DEFECTO = 'ii';

export function MeshContainer() {
    const { user } = useAuth();
    const idCarrera = user?.idCarrera ?? ID_CARRERA_POR_DEFECTO;
    const nombreCarrera = user?.nombreCarrera ?? 'Malla curricular';

    const {
        semestres,
        isLoading,
        error,
        cambiarEstado,
        comentarioIa,
        analizando,
    } = useMesh(idCarrera);

    const asignaturas = semestres.flatMap((s) => s.asignaturas);
    const totalSct = asignaturas.reduce((acc, a) => acc + a.sct, 0);
    const aprobadoSct = asignaturas
        .filter((a) => a.status === 'aprobado')
        .reduce((acc, a) => acc + a.sct, 0);
    const cursandoSct = asignaturas
        .filter((a) => a.status === 'cursando')
        .reduce((acc, a) => acc + a.sct, 0);
    const porcentajeAprobado = totalSct === 0 ? 0 : Math.round((aprobadoSct / totalSct) * 100);
    const porcentajeCursando = totalSct === 0 ? 0 : Math.round((cursandoSct / totalSct) * 100);

    function handleStatusChange(subjectId: string, newStatus: SubjectStatus) {
        cambiarEstado(subjectId, newStatus);
    }

    return (
        <div className={styles.container}>
            <div className={styles.infoBar}>
                <div className={styles.infoLeft}>
                    <p className={styles.carrera}>{nombreCarrera}</p>
                    <div className={styles.progreso}>
                        <div className={styles.progresoHeader}>
                            <span>Avance Curricular</span>
                            <span>{aprobadoSct + cursandoSct} / {totalSct} sct</span>
                        </div>
                        <div className={styles.progressBar}>
                            <div
                                className={styles.progressFill}
                                style={{ width: `${porcentajeAprobado}%` }}
                            />
                            <div
                                className={styles.progressFillCursando}
                                style={{ width: `${porcentajeCursando}%` }}
                            />
                        </div>
                        <span className={styles.porcentaje}>{porcentajeAprobado + porcentajeCursando}%</span>
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
