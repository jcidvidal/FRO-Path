import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import React from 'react';
import { AuthProvider, useAuth } from './AuthContext';
import { storage } from './storage';

vi.mock('./storage', () => ({
    storage: {
        get: vi.fn().mockReturnValue(null),
        set: vi.fn(),
        remove: vi.fn(),
    },
}));

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
        it('debe iniciar sesion con credenciales correctas', async () => {
            const { result } = renderAuthHook();

            await act(async () => {
                const res = await result.current.login('estud@ufromail.cl', 'pass123');
                expect(res.success).toBe(true);
            });

            expect(result.current.isAuthenticated).toBe(true);
            expect(result.current.user).toEqual({
                email: 'estud@ufromail.cl',
                name: 'EstudiantePrueba',
                role: 'estudiante',
            });
        });

        it('debe fallar con email incorrecto', async () => {
            const { result } = renderAuthHook();

            await act(async () => {
                const res = await result.current.login('wrong@ufro.cl', 'pass123');
                expect(res.success).toBe(false);
                expect(res.error).toBe('Contraseña incorrecta');
            });
        });

        it('debe fallar con contrasena incorrecta', async () => {
            const { result } = renderAuthHook();

            await act(async () => {
                const res = await result.current.login('estud@ufromail.cl', 'wrongpassword');
                expect(res.success).toBe(false);
                expect(res.error).toBe('Contraseña incorrecta');
            });
        });

        it('debe guardar en storage si remember es true', async () => {
            const { result } = renderAuthHook();

            await act(async () => {
                await result.current.login('estud@ufromail.cl', 'pass123', true);
            });

            expect(storage.set).toHaveBeenCalledWith('auth_user', {
                email: 'estud@ufromail.cl',
                name: 'EstudiantePrueba',
                role: 'estudiante',
            });
        });

        it('no debe guardar en storage si remember es false', async () => {
            const { result } = renderAuthHook();

            await act(async () => {
                await result.current.login('estud@ufromail.cl', 'pass123', false);
            });

            expect(storage.set).not.toHaveBeenCalled();
        });
    });

    describe('register', () => {
        it('debe registrar un nuevo usuario exitosamente', async () => {
            const { result } = renderAuthHook();

            await act(async () => {
                const res = await result.current.register('Nuevo Usuario', '22.222.222-2', 'new@ufromail.cl', 'newpassword');
                expect(res.success).toBe(true);
            });
        });

        it('debe fallar al registrar un email existente', async () => {
            const { result } = renderAuthHook();

            await act(async () => {
                const res = await result.current.register('Otro Usuario', '22.222.222-2', 'estud@ufromail.cl', 'pass123');
                expect(res.success).toBe(false);
                expect(res.error).toBe('El correo ya esta registrado');
            });
        });

        it('debe fallar si la contrasena es muy corta', async () => {
            const { result } = renderAuthHook();

            await act(async () => {
                const res = await result.current.register('Nuevo Usuario', '33.333.333-3', 'new2@ufromail.cl', '12345');
                expect(res.success).toBe(false);
                expect(res.error).toBe('La contraseña debe tener al menos 6 caracteres');
            });
        });

        it('debe permitir login despues de registrar un nuevo usuario', async () => {
            const { result } = renderAuthHook();

            await act(async () => {
                const res = await result.current.register('Nuevo Usuario', '44.444.444-4', 'newuser@ufromail.cl', 'mypassword');
                expect(res.success).toBe(true);
            });

            await act(async () => {
                const res = await result.current.login('newuser@ufromail.cl', 'mypassword');
                expect(res.success).toBe(true);
            });

            expect(result.current.isAuthenticated).toBe(true);
        });
    });

    describe('logout', () => {
        it('debe cerrar sesion y limpiar el usuario', async () => {
            const { result } = renderAuthHook();

            await act(async () => {
                await result.current.login('estud@ufromail.cl', 'pass123');
            });
            expect(result.current.isAuthenticated).toBe(true);

            act(() => {
                result.current.logout();
            });

            expect(result.current.isAuthenticated).toBe(false);
            expect(result.current.user).toBeNull();
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