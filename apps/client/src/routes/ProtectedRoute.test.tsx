import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../services/AuthContext';
import { ProtectedRoute } from './ProtectedRoute';

describe('ProtectedRoute', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('debe redirigir a /login si no esta autenticado', async () => {
        render(
            <MemoryRouter initialEntries={['/dashboard']}>
                <AuthProvider>
                    <Routes>
                        <Route path="/login" element={<div>Login Page</div>} />
                        <Route
                            path="/dashboard"
                            element={
                                <ProtectedRoute>
                                    <div data-testid="protected-content">Contenido Protegido</div>
                                </ProtectedRoute>
                            }
                        />
                    </Routes>
                </AuthProvider>
            </MemoryRouter>,
        );

        await waitFor(() => {
            expect(screen.getByText('Login Page')).toBeInTheDocument();
        });
        expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    });
});