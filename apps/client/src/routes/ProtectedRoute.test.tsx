import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('react-router-dom', () => ({
    Navigate: ({ to }: { to: string }) => <div data-testid="navigate" data-to={to} />,
    useLocation: () => ({ pathname: '/dashboard', state: null }),
}));

vi.mock('../services/AuthContext', () => ({
    useAuth: vi.fn(),
}));

import { ProtectedRoute } from './ProtectedRoute';
import { useAuth } from '../services/AuthContext';

describe('ProtectedRoute', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('debe redirigir a /login si no esta autenticado', () => {
        vi.mocked(useAuth).mockReturnValue({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            login: vi.fn(),
            register: vi.fn(),
            logout: vi.fn(),
        });

        render(
            <ProtectedRoute>
                <div data-testid="protected-content">Contenido</div>
            </ProtectedRoute>,
        );

        expect(screen.getByTestId('navigate')).toHaveAttribute('data-to', '/login');
        expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    });

    it('debe renderizar children si el usuario esta autenticado', () => {
        vi.mocked(useAuth).mockReturnValue({
            user: { id: 1, email: 'test@test.cl', name: 'Test', role: 'estudiante' },
            isAuthenticated: true,
            isLoading: false,
            login: vi.fn(),
            register: vi.fn(),
            logout: vi.fn(),
        });

        render(
            <ProtectedRoute>
                <div data-testid="protected-content">Contenido</div>
            </ProtectedRoute>,
        );

        expect(screen.getByTestId('protected-content')).toBeInTheDocument();
        expect(screen.queryByTestId('navigate')).not.toBeInTheDocument();
    });

    it('debe redirigir si el rol no esta permitido', () => {
        vi.mocked(useAuth).mockReturnValue({
            user: { id: 2, email: 'doc@test.cl', name: 'Doc', role: 'docente' },
            isAuthenticated: true,
            isLoading: false,
            login: vi.fn(),
            register: vi.fn(),
            logout: vi.fn(),
        });

        render(
            <ProtectedRoute allowedRoles={['estudiante']}>
                <div data-testid="protected-content">Contenido</div>
            </ProtectedRoute>,
        );

        expect(screen.getByTestId('navigate')).toBeInTheDocument();
        expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    });
});
