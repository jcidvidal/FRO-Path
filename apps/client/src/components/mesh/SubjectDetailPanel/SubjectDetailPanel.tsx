import type { Subject, Semester } from '../../../types/malla';
import { findSubjectById } from '../utils';
import styles from './SubjectDetailPanel.module.css';

interface SubjectDetailPanelProps {
    subject: Subject | null;
    semestres: Semester[];
    modulosIngles?: Subject[];
    practicas?: Subject[];
    onClose: () => void;
}

export function SubjectDetailPanel({ subject, semestres, modulosIngles, practicas, onClose }: SubjectDetailPanelProps) {
    if (!subject) return null;

    const statusLabels: Record<string, string> = {
        aprobado: 'Aprobado',
        reprobado: 'Reprobado',
        cursando: 'Cursando',
        disponible: 'Disponible',
        bloqueado: 'Bloqueado',
    };

    return (
        <div className={styles.panel} role="region" aria-label={`Detalles de ${subject.nombre}`}>
            <div className={styles.panelHeader}>
                <span className={styles.panelTitle}>{subject.nombre}</span>
                <button
                    className={styles.panelClose}
                    onClick={onClose}
                    aria-label="Cerrar panel de detalles"
                    title="Cerrar"
                >
                    ✕
                </button>
            </div>
            <div className={styles.panelMeta}>
                <span>{subject.sct} SCT</span>
                <span>Estado: {statusLabels[subject.status] ?? subject.status}</span>
            </div>
            <div className={styles.panelPrerequisitos}>
                <span className={styles.panelPrerequisitosLabel}>Prerrequisitos:</span>
                {subject.prerrequisitos && subject.prerrequisitos.length > 0 ? (
                    <ul className={styles.panelPrerequisitosList}>
                        {subject.prerrequisitos.map((id) => {
                            const prereq = findSubjectById(semestres, modulosIngles, practicas, id);
                            return <li key={id}>{prereq ? prereq.nombre : id}</li>;
                        })}
                    </ul>
                ) : (
                    <span className={styles.panelNoPrereq}>No tiene prerrequisitos</span>
                )}
            </div>
        </div>
    );
}