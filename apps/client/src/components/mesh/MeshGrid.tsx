import { SubjectNode } from './nodes/SubjectNode';
import type { Subject, SubjectStatus, Semester } from '../../types/malla';
import styles from './MeshGrid.module.css';

interface MeshGridProps {
    semestres: Semester[];
    modulosIngles?: Subject[];
    practicas?: Subject[];
    onStatusChange?: (subjectId: string, newStatus: SubjectStatus) => void;
    readOnly?: boolean;
    selectedSubjectId?: string;
    onSubjectClick?: (subjectId: string) => void;
}

export function MeshGrid({ semestres, modulosIngles, practicas, onStatusChange, readOnly, selectedSubjectId, onSubjectClick }: MeshGridProps) {
    return (
        <div className={styles.gridWrapper}>
            <div className={styles.grid}>
                {semestres.map((semestre) => (
                    <div key={semestre.numero} className={styles.column}>
                        <div className={styles.semesterHeader}>
                            <span className={styles.semesterNumber}>{semestre.numero}</span>
                        </div>
                        <div className={styles.subjects}>
                            {semestre.asignaturas.map((subject) => (
                                <SubjectNode
                                    key={subject.id}
                                    subject={subject}
                                    onStatusChange={onStatusChange}
                                    readOnly={readOnly}
                                    onSubjectClick={onSubjectClick}
                                    isSelected={selectedSubjectId === subject.id}
                                    semestres={semestres}
                                    modulosIngles={modulosIngles}
                                    practicas={practicas}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {(modulosIngles || practicas) && (
                <div className={styles.specialRow}>
                    {modulosIngles && (
                        <div className={styles.specialGroup}>
                            <div className={`${styles.specialHeader} ${styles.specialHeaderGreen}`}>
                                Modulos Ingles
                            </div>
                            <div className={styles.specialItems}>
                                {modulosIngles.map((item) => (
                                    <SubjectNode
                                        key={item.id}
                                        subject={item}
                                        onStatusChange={onStatusChange}
                                        readOnly={readOnly}
                                        onSubjectClick={onSubjectClick}
                                        isSelected={selectedSubjectId === item.id}
                                        semestres={semestres}
                                        modulosIngles={modulosIngles}
                                        practicas={practicas}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {practicas && (
                        <div className={styles.specialGroup}>
                            <div className={`${styles.specialHeader} ${styles.specialHeaderGreen}`}>
                                Practicas
                            </div>
                            <div className={styles.specialItems}>
                                {practicas.map((item) => (
                                    <SubjectNode
                                        key={item.id}
                                        subject={item}
                                        onStatusChange={onStatusChange}
                                        readOnly={readOnly}
                                        onSubjectClick={onSubjectClick}
                                        isSelected={selectedSubjectId === item.id}
                                        semestres={semestres}
                                        modulosIngles={modulosIngles}
                                        practicas={practicas}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}