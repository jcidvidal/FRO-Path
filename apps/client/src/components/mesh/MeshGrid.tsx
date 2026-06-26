import { useState } from 'react';
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
    const [hoveredSubjectId, setHoveredSubjectId] = useState<string | null>(null);

    let prerequisiteIds: string[] = [];
    if (readOnly && hoveredSubjectId) {
        const allSubjects = [
            ...semestres.flatMap((s) => s.asignaturas),
            ...(modulosIngles || []),
            ...(practicas || []),
        ];
        const hovered = allSubjects.find((s) => s.id === hoveredSubjectId);
        if (hovered?.prerrequisitos) {
            prerequisiteIds = hovered.prerrequisitos;
        }
    }

    return (
        <div className={styles.gridWrapper}>
            <div className={styles.scrollContainer}>
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
                                    isPrerequisite={prerequisiteIds.includes(subject.id)}
                                    isHovered={readOnly && hoveredSubjectId === subject.id}
                                    isDimmed={readOnly && hoveredSubjectId !== null && hoveredSubjectId !== subject.id && !prerequisiteIds.includes(subject.id)}
                                    onHover={setHoveredSubjectId}
                                    onHoverEnd={() => setHoveredSubjectId(null)}
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
                                            isPrerequisite={prerequisiteIds.includes(item.id)}
                                            isHovered={readOnly && hoveredSubjectId === item.id}
                                            isDimmed={readOnly && hoveredSubjectId !== null && hoveredSubjectId !== item.id && !prerequisiteIds.includes(item.id)}
                                            onHover={setHoveredSubjectId}
                                            onHoverEnd={() => setHoveredSubjectId(null)}
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
                                            isPrerequisite={prerequisiteIds.includes(item.id)}
                                            isHovered={readOnly && hoveredSubjectId === item.id}
                                            isDimmed={readOnly && hoveredSubjectId !== null && hoveredSubjectId !== item.id && !prerequisiteIds.includes(item.id)}
                                            onHover={setHoveredSubjectId}
                                            onHoverEnd={() => setHoveredSubjectId(null)}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}