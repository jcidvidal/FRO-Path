import { describe, it, expect} from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PasswordInput } from './passwordInput';

describe('PasswordInput', () => {
    it('renderiza un input de tipo password por defecto', () => {
        render(<PasswordInput name="password" value="" onChange={() => {}} />);
        const input = screen.getByDisplayValue('');
        expect(input).toBeInTheDocument();
        expect(input).toHaveAttribute('type', 'password');
    });

    it('renderiza el label cuando se proporciona', () => {
        render(<PasswordInput name="password" label="Contraseña" value="" onChange={() => {}} />);
        expect(screen.getByText('Contraseña')).toBeInTheDocument();
    });

    it('muestra asterisco de required', () => {
        render(<PasswordInput name="pass" label="Pass" required value="" onChange={() => {}} />);
        expect(screen.getByText('*')).toBeInTheDocument();
    });

    it('el input es de tipo password inicialmente', () => {
        render(<PasswordInput name="password" value="secreto" onChange={() => {}} />);
        const input = screen.getByDisplayValue('secreto');
        expect(input).toHaveAttribute('type', 'password');
    });

    it('alterna a text al hacer clic en el toggle', () => {
        render(<PasswordInput name="password" value="secreto" onChange={() => {}} />);
        const input = screen.getByDisplayValue('secreto');
        const toggleButton = screen.getByRole('button', { name: /mostrar contraseña/i });

        fireEvent.click(toggleButton);

        expect(input).toHaveAttribute('type', 'text');
        expect(screen.getByRole('button', { name: /ocultar contraseña/i })).toBeInTheDocument();
    });

    it('vuelve a password al hacer clic dos veces en el toggle', () => {
        render(<PasswordInput name="password" value="secreto" onChange={() => {}} />);
        const input = screen.getByDisplayValue('secreto');
        const toggleButton = screen.getByRole('button', { name: /mostrar contraseña/i });

        fireEvent.click(toggleButton);
        fireEvent.click(toggleButton);

        expect(input).toHaveAttribute('type', 'password');
    });

    it('muestra mensaje de error', () => {
        render(<PasswordInput name="password" error="Mínimo 6 caracteres" value="" onChange={() => {}} />);
        expect(screen.getByRole('alert')).toHaveTextContent('Mínimo 6 caracteres');
    });

    it('pasa el placeholder al input', () => {
        render(<PasswordInput name="password" placeholder="Tu contraseña" value="" onChange={() => {}} />);
        expect(screen.getByPlaceholderText('Tu contraseña')).toBeInTheDocument();
    });

    it('deshabilita el input', () => {
        render(<PasswordInput name="password" disabled value="" onChange={() => {}} />);
        const input = screen.getByDisplayValue('');
        expect(input).toBeDisabled();
    });

    it('usa el autoComplete proporcionado', () => {
        render(<PasswordInput name="password" autoComplete="new-password" value="" onChange={() => {}} />);
        const input = screen.getByDisplayValue('');
        expect(input).toHaveAttribute('autoComplete', 'new-password');
    });

    it('usa current-password como autoComplete por defecto', () => {
        render(<PasswordInput name="password" value="" onChange={() => {}} />);
        const input = screen.getByDisplayValue('');
        expect(input).toHaveAttribute('autoComplete', 'current-password');
    });
});
