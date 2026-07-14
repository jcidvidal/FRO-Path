import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
    it('renderiza el children', () => {
        render(<Button>Guardar</Button>);
        expect(screen.getByRole('button', { name: 'Guardar' })).toBeInTheDocument();
    });

    it('aplica type submit cuando se especifica', () => {
        render(<Button type="submit">Enviar</Button>);
        expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
    });

    it('usa type button por defecto', () => {
        render(<Button>Click</Button>);
        expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
    });

    it('ejecuta onClick al hacer clic', () => {
        const onClick = vi.fn();
        render(<Button onClick={onClick}>Click</Button>);
        fireEvent.click(screen.getByRole('button'));
        expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('no ejecuta onClick cuando está deshabilitado', () => {
        const onClick = vi.fn();
        render(<Button disabled onClick={onClick}>Click</Button>);
        fireEvent.click(screen.getByRole('button'));
        expect(onClick).not.toHaveBeenCalled();
    });

    it('no ejecuta onClick cuando está en loading', () => {
        const onClick = vi.fn();
        render(<Button loading onClick={onClick}>Click</Button>);
        fireEvent.click(screen.getByRole('button'));
        expect(onClick).not.toHaveBeenCalled();
    });

    it('muestra "Cargando..." y aria-busy cuando loading=true', () => {
        render(<Button loading>Guardar</Button>);
        expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true');
        expect(screen.getByText('Cargando...')).toBeInTheDocument();
        expect(screen.queryByText('Guardar')).not.toBeInTheDocument();
    });

    it('aplica disabled cuando loading=true', () => {
        render(<Button loading>Guardar</Button>);
        expect(screen.getByRole('button')).toBeDisabled();
    });

    it('aplica fullWidth por defecto', () => {
        render(<Button>Full</Button>);
        const btn = screen.getByRole('button');
        expect(btn.className).toContain('fullWidth');
    });

    it('usa variant green por defecto', () => {
        render(<Button>Verde</Button>);
        const btn = screen.getByRole('button');
        expect(btn.className).not.toContain('cyan');
    });

    it('aplica variant cyan', () => {
        render(<Button variant="cyan">Cyan</Button>);
        const btn = screen.getByRole('button');
        expect(btn.className).toContain('cyan');
    });
});
