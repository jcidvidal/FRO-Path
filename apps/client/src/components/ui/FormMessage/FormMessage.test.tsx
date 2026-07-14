import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FormMessage } from './FormMessage';

describe('FormMessage', () => {
    it('renderiza el mensaje', () => {
        render(<FormMessage type="error" message="Ocurrió un error" />);
        expect(screen.getByRole('alert')).toHaveTextContent('Ocurrió un error');
    });

    it('muestra el icono de error para type="error"', () => {
        const { container } = render(<FormMessage type="error" message="Error" />);
        const iconWrapper = container.querySelector('[aria-hidden="true"]');
        expect(iconWrapper).toBeInTheDocument();
    });

    it('muestra el icono de éxito para type="success"', () => {
        render(<FormMessage type="success" message="Éxito" />);
        expect(screen.getByRole('alert')).toHaveTextContent('Éxito');
    });

    it('muestra el icono de info para type="info"', () => {
        render(<FormMessage type="info" message="Info" />);
        expect(screen.getByRole('alert')).toHaveTextContent('Info');
    });

    it('aplica la clase css correspondiente al type', () => {
        const { container } = render(<FormMessage type="success" message="OK" />);
        const div = container.firstChild as HTMLElement;
        expect(div.className).toContain('success');
    });
});
