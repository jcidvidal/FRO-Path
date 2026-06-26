import { useState, useRef, useEffect } from 'react';
import type { SubjectStatus, Subject, Semester } from '../../../types/malla';
import styles from './SubjectNode.module.css';
import { SubjectTooltip } from '../SubjectTooltip/SubjectTooltip';
import { LockIcon } from '../../icons/Icons';

interface SubjectNodeProps {
    subject: Subject;
    onStatusChange?: (subjectId: string, newStatus: SubjectStatus) => void;
    readOnly?: boolean;
    onSubjectClick?: (subjectId: string) => void;
    isSelected?: boolean;
    semestres?: Semester[];
    modulosIngles?: Subject[];
    practicas?: Subject[];
    isPrerequisite?: boolean;
    isHovered?: boolean;
    isDimmed?: boolean;
    onHover?: (subjectId: string) => void;
    onHoverEnd?: () => void;
}

const STATUS_OPTIONS: SubjectStatus[] = ['aprobado', 'reprobado', 'cursando', 'disponible'];

function Indicator({ status }: { status: SubjectStatus }) {
    if (status === 'bloqueado') {
        return <LockIcon className={styles.lockIcon} />;
    }

    return <div className={styles.indicator} />;
}

export function SubjectNode({ subject, onStatusChange, readOnly, onSubjectClick, isSelected, semestres, modulosIngles, practicas, isPrerequisite, isHovered, isDimmed, onHover, onHoverEnd }: SubjectNodeProps) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);
    const [tooltipPosition, setTooltipPosition] = useState<DOMRect | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const tooltipTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
    const nodeRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!showTooltip) return;

        function handleScroll() {
            setShowTooltip(false);
        }

        window.addEventListener('scroll', handleScroll, { passive: true, capture: true });
        return () => window.removeEventListener('scroll', handleScroll, true);
    }, [showTooltip]);

    useEffect(() => {
        if (!menuOpen) return;

        function handleClickOutside(e: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setMenuOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [menuOpen]);

    function handleCardClick() {
        if (readOnly) {
            if (onSubjectClick) {
                onSubjectClick(subject.id);
            }
            return;
        }

        if (showTooltip) {
            if (tooltipTimeoutRef.current) clearTimeout(tooltipTimeoutRef.current);
            setShowTooltip(false);
        }

        if (subject.status !== 'bloqueado') {
            setMenuOpen((prev) => !prev);
        }
    }

    function handleStatusSelect(newStatus: SubjectStatus) {
        onStatusChange?.(subject.id, newStatus);
        setMenuOpen(false);
    }

    function handleMouseEnter(e: React.MouseEvent) {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        setTooltipPosition(rect);
        tooltipTimeoutRef.current = setTimeout(() => setShowTooltip(true), 500);
        onHover?.(subject.id);
    }

    function handleMouseLeave() {
        if (tooltipTimeoutRef.current) clearTimeout(tooltipTimeoutRef.current);
        setShowTooltip(false);
        onHoverEnd?.();
    }

    return (
        <div className={styles.wrapper} ref={nodeRef}>
            <div
                className={`${styles.node} ${styles[subject.status]} ${readOnly ? styles.readOnly : ''} ${isSelected ? styles.selected : ''} ${readOnly && onSubjectClick ? styles.clickable : ''} ${isPrerequisite ? styles.prerequisite : ''} ${isHovered ? styles.hovered : ''} ${isDimmed ? styles.dimmed : ''}`}
                onClick={handleCardClick}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                role={readOnly ? undefined : 'button'}
                tabIndex={readOnly ? undefined : 0}
                onKeyDown={(e) => {
                    if (!readOnly && (e.key === 'Enter' || e.key === ' ')) handleCardClick();
                }}
            >
                <div className={styles.indicatorWrapper}>
                    <Indicator status={subject.status} />
                </div>
                <p className={styles.nombre}>{subject.nombre}</p>
                <span className={styles.sct}>{subject.sct} sct</span>
            </div>

            {menuOpen && (
                <div
                    className={styles.menu}
                    ref={menuRef}
                >
                    {STATUS_OPTIONS.map((status) => (
                        <button
                            key={status}
                            className={`${styles.menuCircle} ${styles[`menuCircle_${status}`]} ${subject.status === status ? styles.menuCircleActive : ''}`}
                            onClick={() => handleStatusSelect(status)}
                            aria-label={status}
                            title={status}
                        />
                    ))}
                </div>
            )}

            {semestres && showTooltip && tooltipPosition && (
                <SubjectTooltip
                    subject={subject}
                    semestres={semestres}
                    modulosIngles={modulosIngles}
                    practicas={practicas}
                    position={tooltipPosition}
                />
            )}
        </div>
    );
}