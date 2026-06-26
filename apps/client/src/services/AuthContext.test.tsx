import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import React from 'react';
import { AuthProvider, useAuth } from './AuthContext';
import { storage } from './storage';
import * as apiClientModule from './apiClient';

vi.mock('./storage', () => ({
    storage: {
        get: vi.fn().mockReturnValue(null),
        set: vi.fn(),
        remove: vi.fn(),
    },
}));

vi.mock('./apiClient', () => ({
    apiClient: { post: vi.fn() },
    saveToken: vi.fn(),
    removeToken: vi.fn(),
    getToken: vi.fn().mockReturnValue(null),
}));

const mockBackendResponse = {
    accessToken: 'mock-jwt-token',
    tokenType: 'Bearer',
    expiresIn: '1h',
    user: {
        id: 1,
        nombre: 'Estudiante',
        apellidoPaterno: 'Demo',
        apellidoMaterno: 'FROPath',
        email: 'estudiante@fro-path.local',
        rol: 'estudiante',
        idCarrera: 'ii',
        nombreCarrera: 'Ingenieria Informatica',
    },
};

function renderAuthHook() {
    return renderHook(() => useAuth(), {
        wrapper: ({ children }: { children: React.ReactNode }) => (
            <AuthProvider>{children}</AuthProvider>
        ),
    });
}

describe('AuthContext', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('login', () => {
        it('debe iniciar sesion cuando la API responde correctamente', async () => {
            vi.mocked(apiClientModule.apiClient.post).mockResolvedValue(mockBackendResponse);
            const { result } = renderAuthHook();

            await act(async () => {
                const res = await result.current.login('estudiante@fro-path.local', 'Pass1234');
                expect(res.success).toBe(true);
            });

            expect(result.current.isAuthenticated).toBe(true);
            expect(result.current.user).toEqual({
                id: 1,
                email: 'estudiante@fro-path.local',
                name: 'Estudiante Demo',
                role: 'estudiante',
                idCarrera: 'ii',
                nombreCarrera: 'Ingenieria Informatica',
            });
        });

        it('debe mapear el rol profesor a docente', async () => {
            vi.mocked(apiClientModule.apiClient.post).mockResolvedValue({
                ...mockBackendResponse,
                user: { ...mockBackendResponse.user, rol: 'profesor' },
            });
            const { result } = renderAuthHook();

            await act(async () => {
                await result.current.login('profesor@fro-path.local', 'Pass1234');
            });

            expect(result.current.user?.role).toBe('docente');
        });

        it('debe fallar y retornar el mensaje de error de la API', async () => {
            vi.mocked(apiClientModule.apiClient.post).mockRejectedValue(
                new Error('Credenciales invalidas.'),
            );
            const { result } = renderAuthHook();

            await act(async () => {
                const res = await result.current.login('nadie@test.cl', 'wrongpassword');
                expect(res.success).toBe(false);
                expect(res.error).toBe('Credenciales invalidas.');
            });

            expect(result.current.isAuthenticated).toBe(false);
        });

        it('debe guardar el token y el usuario en storage tras login exitoso', async () => {
            vi.mocked(apiClientModule.apiClient.post).mockResolvedValue(mockBackendResponse);
            const { result } = renderAuthHook();

            await act(async () => {
                await result.current.login('estudiante@fro-path.local', 'Pass1234');
            });

            expect(apiClientModule.saveToken).toHaveBeenCalledWith('mock-jwt-token');
            expect(storage.set).toHaveBeenCalledWith('auth_user', {
                id: 1,
                email: 'estudiante@fro-path.local',
                name: 'Estudiante Demo',
                role: 'estudiante',
                idCarrera: 'ii',
                nombreCarrera: 'Ingenieria Informatica',
            });
        });

        it('debe retornar error generico si la API falla de forma inesperada', async () => {
            vi.mocked(apiClientModule.apiClient.post).mockRejectedValue('error no esperado');
            const { result } = renderAuthHook();

            await act(async () => {
                const res = await result.current.login('test@test.cl', 'password');
                expect(res.success).toBe(false);
                expect(res.error).toBe('Error al iniciar sesión');
            });
        });
    });

    describe('register', () => {
        it('debe registrar un nuevo usuario exitosamente', async () => {
            vi.mocked(apiClientModule.apiClient.post).mockResolvedValue(mockBackendResponse);
            const { result } = renderAuthHook();

            await act(async () => {
                const res = await result.current.register('Nuevo', '22.222.222-2', 'nuevo@test.cl', 'password123', 'ii');
                expect(res.success).toBe(true);
            });
        });

        it('debe fallar si la API indica que el correo ya existe', async () => {
            vi.mocked(apiClientModule.apiClient.post).mockRejectedValue(
                new Error('El correo ya esta registrado.'),
            );
            const { result } = renderAuthHook();

            await act(async () => {
                const res = await result.current.register('Otro', '33.333.333-3', 'existente@test.cl', 'password123', 'ii');
                expect(res.success).toBe(false);
                expect(res.error).toBe('El correo ya esta registrado.');
            });
        });

        it('no debe setear el usuario en estado tras registrar', async () => {
            vi.mocked(apiClientModule.apiClient.post).mockResolvedValue(mockBackendResponse);
            const { result } = renderAuthHook();

            await act(async () => {
                await result.current.register('Nuevo', '44.444.444-4', 'nuevo@test.cl', 'password123', 'ii');
            });

            expect(result.current.isAuthenticated).toBe(false);
        });
    });

    describe('logout', () => {
        it('debe limpiar usuario, token y storage al cerrar sesion', async () => {
            vi.mocked(apiClientModule.apiClient.post).mockResolvedValue(mockBackendResponse);
            const { result } = renderAuthHook();

            await act(async () => {
                await result.current.login('estudiante@fro-path.local', 'Pass1234');
            });
            expect(result.current.isAuthenticated).toBe(true);

            act(() => {
                result.current.logout();
            });

            expect(result.current.isAuthenticated).toBe(false);
            expect(result.current.user).toBeNull();
            expect(apiClientModule.removeToken).toHaveBeenCalled();
            expect(storage.remove).toHaveBeenCalledWith('auth_user');
        });
    });

    describe('useAuth error', () => {
        it('debe lanzar error si se usa fuera de AuthProvider', () => {
            expect(() => {
                renderHook(() => useAuth());
            }).toThrow('useAuth debe usarse dentro de un AuthProvider');
        });
    });
});
