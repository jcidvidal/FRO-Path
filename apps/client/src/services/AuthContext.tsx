/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { apiClient, saveToken, removeToken } from './apiClient';
import { storage } from './storage';

export interface User {
    id: number;
    email: string;
    name: string;
    role: 'estudiante' | 'docente' | 'director' | 'admin';
}

export interface AuthContextValue {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string, remember?: boolean) => Promise<{ success: boolean; error?: string; role?: User['role'] }>;
    register: (name: string, rut: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
}

interface BackendUser {
    id: number;
    nombre: string;
    apellidoPaterno?: string;
    apellidoMaterno?: string;
    email: string;
    rol: string;
}

interface BackendAuthResponse {
    accessToken: string;
    user: BackendUser;
}

const USER_KEY = 'auth_user';

function mapRole(rol: string): User['role'] {
    return rol === 'profesor' ? 'docente' : rol as User['role'];
}

function mapUser(backendUser: BackendUser): User {
    return {
        id: backendUser.id,
        email: backendUser.email,
        name: [backendUser.nombre, backendUser.apellidoPaterno]
            .filter((s): s is string => Boolean(s))
            .join(' '),
        role: mapRole(backendUser.rol),
    };
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(() => storage.get<User>(USER_KEY));

    const login = useCallback(
        async (email: string, password: string): Promise<{ success: boolean; error?: string; role?: User['role'] }> => {
            try {
                const response = await apiClient.post<BackendAuthResponse>('/auth/login', { email, password });
                const userData = mapUser(response.user);

                saveToken(response.accessToken);
                storage.set(USER_KEY, userData);
                setUser(userData);

                return { success: true, role: userData.role };
            } catch (error) {
                return {
                    success: false,
                    error: error instanceof Error ? error.message : 'Error al iniciar sesión',
                };
            }
        },
        [],
    );

    const register = useCallback(
        async (name: string, _rut: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
            try {
                await apiClient.post<BackendAuthResponse>('/auth/register', { nombre: name, email, password });
                return { success: true };
            } catch (error) {
                return {
                    success: false,
                    error: error instanceof Error ? error.message : 'Error al registrar',
                };
            }
        },
        [],
    );

    const logout = useCallback(() => {
        setUser(null);
        removeToken();
        storage.remove(USER_KEY);
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: user !== null,
                isLoading: false,
                login,
                register,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextValue {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe usarse dentro de un AuthProvider');
    }
    return context;
}
