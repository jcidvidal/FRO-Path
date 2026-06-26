import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SubjectTooltip } from './SubjectTooltip';
import type { Subject, Semester } from '../../../types/malla';
import * as utils from '../utils';

vi.mock('../utils', () => ({
    findSubjectById: vi.fn(),
}));

describe('SubjectTooltip', () => {
    const posicionBase: DOMRect = {
        top: 200,
        bottom: 250,
        left: 100,
        right: 200,
        width: 100,
        height: 50,
        x: 100,
        y: 200,
        toJSON: () => ({}),
    };

    const materia: Subject = {
        id: 'ICC-002',
        nombre: 'Programación II',
        sct: 6,
        status: 'bloqueado',
        prerrequisitos: ['ICC-001'],
    };

    const semestres: Semester[] = [
        {
            numero: 1,
            asignaturas: [
                { id: 'ICC-001', nombre: 'Programación I', sct: 6, status: 'aprobado', prerrequisitos: [] },
            ],
        },
    ];

    beforeEach(() => {
        vi.mocked(utils.findSubjectById).mockReset();
        Object.defineProperty(window, 'innerWidth', { value: 1024, configurable: true });
        Object.defineProperty(window, 'innerHeight', { value: 768, configurable: true });
    });

    it('renderiza el título "Prerrequisitos"', () => {
        vi.mocked(utils.findSubjectById).mockReturnValue(null);
        render(
            <SubjectTooltip
                subject={materia}
                semestres={semestres}
                position={posicionBase}
            />,
        );
        expect(screen.getByText('Prerrequisitos')).toBeInTheDocument();
    });

    it('muestra los nombres de los prerrequisitos resueltos', () => {
        vi.mocked(utils.findSubjectById).mockReturnValue(
            { id: 'ICC-001', nombre: 'Programación I', sct: 6, status: 'aprobado', prerrequisitos: [] },
        );
        render(
            <SubjectTooltip
                subject={materia}
                semestres={semestres}
                position={posicionBase}
            />,
        );
        expect(screen.getByText('Programación I')).toBeInTheDocument();
    });

    it('muestra el id del prerequisito si no se encuentra en la malla', () => {
        vi.mocked(utils.findSubjectById).mockReturnValue(null);
        render(
            <SubjectTooltip
                subject={materia}
                semestres={semestres}
                position={posicionBase}
            />,
        );
        expect(screen.getByText('ICC-001')).toBeInTheDocument();
    });

    it('muestra "No tiene prerrequisitos" si el array está vacío', () => {
        const sinPrereq = { ...materia, prerrequisitos: [] };
        render(
            <SubjectTooltip
                subject={sinPrereq}
                semestres={semestres}
                position={posicionBase}
            />,
        );
        expect(screen.getByText('No tiene prerrequisitos')).toBeInTheDocument();
    });

    it('muestra "No tiene prerrequisitos" si prerrequisitos es undefined', () => {
        const sinPrereq = { ...materia, prerrequisitos: undefined };
        render(
            <SubjectTooltip
                subject={sinPrereq}
                semestres={semestres}
                position={posicionBase}
            />,
        );
        expect(screen.getByText('No tiene prerrequisitos')).toBeInTheDocument();
    });

    it('no renderiza el tooltip si position no se proporciona', () => {
        vi.mocked(utils.findSubjectById).mockReturnValue(null);
        const { container } = render(
            <SubjectTooltip
                subject={materia}
                semestres={semestres}
                position={posicionBase}
            />,
        );
        expect(container.querySelector('[role="tooltip"]')).toBeInTheDocument();
    });
});
