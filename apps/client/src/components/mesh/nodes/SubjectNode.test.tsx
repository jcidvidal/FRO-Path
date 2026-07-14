import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { SubjectNode } from './SubjectNode';
import type { Subject, Semester } from '../../../types/malla';

const asignaturaBase: Subject = {
    id: 'ICC-001',
    nombre: 'Programación I',
    sct: 6,
    status: 'disponible',
    prerrequisitos: [],
};

const semestres: Semester[] = [
    { numero: 1, asignaturas: [asignaturaBase] },
];

describe('SubjectNode', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        Element.prototype.getBoundingClientRect = vi.fn(() => ({
            top: 100,
            bottom: 150,
            left: 50,
            right: 200,
            width: 150,
            height: 50,
            x: 50,
            y: 100,
            toJSON: () => ({}),
        }));
    });

    afterEach(() => {
        vi.useRealTimers();
        vi.restoreAllMocks();
    });

    it('renderiza el nombre de la asignatura', () => {
        render(<SubjectNode subject={asignaturaBase} semestres={semestres} />);
        expect(screen.getByText('Programación I')).toBeInTheDocument();
    });

    it('renderiza los SCT', () => {
        render(<SubjectNode subject={asignaturaBase} semestres={semestres} />);
        expect(screen.getByText('6 sct')).toBeInTheDocument();
    });

    it('muestra el icono de bloqueo cuando status es bloqueado', () => {
        const bloqueada = { ...asignaturaBase, status: 'bloqueado' as const };
        render(<SubjectNode subject={bloqueada} semestres={semestres} />);

        fireEvent.click(screen.getByText('Programación I').closest('div')!.parentElement!);
        expect(screen.queryByLabelText('aprobado')).not.toBeInTheDocument();
    });

    it('renderiza en modo readOnly con role button', () => {
        render(<SubjectNode subject={asignaturaBase} readOnly semestres={semestres} />);
        const node = screen.getByText('Programación I').closest('[role="button"]');
        expect(node).toBeInTheDocument();
        expect(node).toHaveAttribute('tabindex', '0');
    });

    it('tiene role button en modo editable', () => {
        render(<SubjectNode subject={asignaturaBase} semestres={semestres} />);
        const node = screen.getByText('Programación I').closest('[role="button"]');
        expect(node).toBeInTheDocument();
    });

    it('abre el menú de estados al hacer clic en modo editable', () => {
        render(<SubjectNode subject={asignaturaBase} semestres={semestres} />);
        const node = screen.getByText('Programación I').closest('[role="button"]')!;
        fireEvent.click(node);
        expect(screen.getByLabelText('aprobado')).toBeInTheDocument();
        expect(screen.getByLabelText('reprobado')).toBeInTheDocument();
        expect(screen.getByLabelText('cursando')).toBeInTheDocument();
        expect(screen.getByLabelText('disponible')).toBeInTheDocument();
    });

    it('cierra el menú al seleccionar un estado', () => {
        const onStatusChange = vi.fn();
        render(<SubjectNode subject={asignaturaBase} semestres={semestres} onStatusChange={onStatusChange} />);
        const node = screen.getByText('Programación I').closest('[role="button"]')!;
        fireEvent.click(node);
        fireEvent.click(screen.getByLabelText('aprobado'));
        expect(onStatusChange).toHaveBeenCalledWith('ICC-001', 'aprobado');
        expect(screen.queryByLabelText('reprobado')).not.toBeInTheDocument();
    });

    it('cierra el menú al hacer clic fuera', () => {
        render(<SubjectNode subject={asignaturaBase} semestres={semestres} />);
        const node = screen.getByText('Programación I').closest('[role="button"]')!;
        fireEvent.click(node);
        expect(screen.getByLabelText('aprobado')).toBeInTheDocument();
        fireEvent.mouseDown(document.body);
        expect(screen.queryByLabelText('aprobado')).not.toBeInTheDocument();
    });

    it('llama a onSubjectClick en readOnly cuando se hace clic', () => {
        const onSubjectClick = vi.fn();
        const { container } = render(
            <SubjectNode
                subject={asignaturaBase}
                readOnly
                onSubjectClick={onSubjectClick}
                semestres={semestres}
            />,
        );
        // En readOnly, el nodo principal tiene className que contiene "readOnly"
        const nodeDiv = container.firstChild?.firstChild as HTMLElement;
        fireEvent.click(nodeDiv);
        expect(onSubjectClick).toHaveBeenCalledWith('ICC-001');
    });

    it('llama a onHover al hacer mouse enter con el id de la asignatura', () => {
        const onHover = vi.fn();
        const { container } = render(<SubjectNode subject={asignaturaBase} semestres={semestres} onHover={onHover} />);
        const nodeDiv = container.firstChild?.firstChild as HTMLElement;
        fireEvent.mouseEnter(nodeDiv);
        expect(onHover).toHaveBeenCalledWith('ICC-001');
    });

    it('llama a onHoverEnd al hacer mouse leave', () => {
        const onHoverEnd = vi.fn();
        const { container } = render(<SubjectNode subject={asignaturaBase} semestres={semestres} onHoverEnd={onHoverEnd} />);
        const nodeDiv = container.firstChild?.firstChild as HTMLElement;
        fireEvent.mouseEnter(nodeDiv);
        fireEvent.mouseLeave(nodeDiv);
        expect(onHoverEnd).toHaveBeenCalled();
    });

    it('muestra el tooltip tras 500ms de hover', () => {
        const conPrereq = {
            ...asignaturaBase,
            prerrequisitos: [],
        };
        const { container } = render(
            <SubjectNode subject={conPrereq} semestres={semestres} />,
        );

        const nodeDiv = container.firstChild?.firstChild as HTMLElement;
        fireEvent.mouseEnter(nodeDiv);
        
        // El tooltip no debería estar visible inmediatamente
        expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
        
        // Avanzar 500ms
        act(() => {
            vi.advanceTimersByTime(500);
        });

        // El tooltip debería estar visible
        expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });

    it('no muestra tooltip tras mouse leave incluso después del delay', () => {
        render(<SubjectNode subject={asignaturaBase} semestres={semestres} />);
        
        const node = screen.getByText('Programación I').closest('div')!.parentElement!;
        fireEvent.mouseEnter(node);
        fireEvent.mouseLeave(node);
        
        act(() => {
            vi.advanceTimersByTime(500);
        });

        expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });
});
