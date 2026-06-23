import type { Subject, Semester } from '../../../types/malla';
import { findSubjectById } from '../utils';
import styles from './SubjectTooltip.module.css';

interface SubjectTooltipProps {
    subject: Subject;
    semestres: Semester[];
    modulosIngles?: Subject[];
    practicas?: Subject[];
    position: DOMRect;
}

export function SubjectTooltip({ subject, semestres, modulosIngles, practicas, position }: SubjectTooltipProps) {
    const prereqs = subject.prerrequisitos?.map((id) => {
        const prereq = findSubjectById(semestres, modulosIngles, practicas, id);
        return prereq ? prereq.nombre : id;
    }) ?? [];

    const tooltipWidth = 280;

    const prereqCount = prereqs.length;
    const headerHeight = 36;
    const itemHeight = 22;
    const padding = 20;
    const estimatedHeight = headerHeight + prereqCount * itemHeight + padding;
    const tooltipHeight = Math.max(estimatedHeight, 80);

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const gap = 8;

    let top = position.bottom + gap;
    let left = position.left + position.width / 2 - tooltipWidth / 2;

    if (left < gap) left = gap;
    if (left + tooltipWidth > viewportWidth - gap) left = viewportWidth - tooltipWidth - gap;

    if (top + tooltipHeight > viewportHeight - gap) {
        top = position.top - tooltipHeight - gap;
        if (top < gap) top = gap;
    }

    return (
        <div className={styles.tooltip} role="tooltip" style={{ top: `${top}px`, left: `${left}px` }}>
            <div className={styles.tooltipHeader}>Prerrequisitos</div>
            {prereqs.length > 0 ? (
                <ul className={styles.tooltipList}>
                    {prereqs.map((name, i) => (
                        <li key={i}>{name}</li>
                    ))}
                </ul>
            ) : (
                <span className={styles.tooltipEmpty}>No tiene prerrequisitos</span>
            )}
        </div>
    );
}