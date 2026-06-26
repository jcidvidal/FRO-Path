import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Input } from './Input';

describe('Input', () => {
    it('renderiza un input por defecto', () => {
        render(<Input name="email" value="" onChange={() => {}} />);
        expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('renderiza el label cuando se proporciona', () => {
        render(<Input name="nombre" label="Nombre" value="" onChange={() => {}} />);
        expect(screen.getByText('Nombre')).toBeInTheDocument();
        // El asterisco está en un span separado con aria-hidden, no en el texto del label
    });

    it('muestra asterisco de required', () => {
        render(<Input name="email" label="Email" required value="" onChange={() => {}} />);
        expect(screen.getByText('*')).toBeInTheDocument();
    });

    it('asigna el placeholder', () => {
        render(<Input name="email" placeholder="tu@email.cl" value="" onChange={() => {}} />);
        expect(screen.getByPlaceholderText('tu@email.cl')).toBeInTheDocument();
    });

    it('ejecuta onChange al escribir', () => {
        const onChange = vi.fn();
        render(<Input name="nombre" value="" onChange={onChange} />);
        fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Juan' } });
        expect(onChange).toHaveBeenCalled();
    });

    it('ejecuta onBlur al perder foco', () => {
        const onBlur = vi.fn();
        render(<Input name="nombre" value="" onChange={() => {}} onBlur={onBlur} />);
        fireEvent.blur(screen.getByRole('textbox'));
        expect(onBlur).toHaveBeenCalledTimes(1);
    });

    it('muestra mensaje de error', () => {
        render(<Input name="email" error="Campo requerido" value="" onChange={() => {}} />);
        expect(screen.getByRole('alert')).toHaveTextContent('Campo requerido');
    });

    it('marca aria-invalid cuando hay error', () => {
        render(<Input name="email" error="Error" value="" onChange={() => {}} />);
        expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
    });

    it('deshabilita el input', () => {
        render(<Input name="email" disabled value="" onChange={() => {}} />);
        expect(screen.getByRole('textbox')).toBeDisabled();
    });

    it('renderiza como select cuando as="select"', () => {
        render(
            <Input
                name="carrera"
                as="select"
                value=""
                onChange={() => {}}
                options={[
                    { value: '', label: 'Seleccione' },
                    { value: 'icc', label: 'ICC' },
                ]}
            />,
        );
        expect(screen.getByRole('combobox')).toBeInTheDocument();
        expect(screen.getByText('ICC')).toBeInTheDocument();
    });
});
