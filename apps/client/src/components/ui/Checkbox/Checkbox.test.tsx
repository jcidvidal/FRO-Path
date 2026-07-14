import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Checkbox } from './Checkbox';

describe('Checkbox', () => {
    it('renderiza el label', () => {
        render(<Checkbox label="Acepto términos" name="acepto" checked={false} onChange={() => {}} />);
        expect(screen.getByText('Acepto términos')).toBeInTheDocument();
    });

    it('renderiza el checkbox no chequeado por defecto', () => {
        render(<Checkbox label="Opción" name="opcion" checked={false} onChange={() => {}} />);
        const input = screen.getByRole('checkbox');
        expect(input).not.toBeChecked();
    });

    it('renderiza el checkbox chequeado', () => {
        render(<Checkbox label="Opción" name="opcion" checked={true} onChange={() => {}} />);
        expect(screen.getByRole('checkbox')).toBeChecked();
    });

    it('ejecuta onChange al hacer clic', () => {
        const onChange = vi.fn();
        render(<Checkbox label="Opción" name="opcion" checked={false} onChange={onChange} />);
        fireEvent.click(screen.getByRole('checkbox'));
        expect(onChange).toHaveBeenCalledTimes(1);
    });

    it('tiene aria-checked sincronizado con checked', () => {
        const { rerender } = render(<Checkbox label="Opción" name="opcion" checked={false} onChange={() => {}} />);
        expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'false');

        rerender(<Checkbox label="Opción" name="opcion" checked={true} onChange={() => {}} />);
        expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'true');
    });
});
