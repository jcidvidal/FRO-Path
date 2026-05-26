/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { storage } from './storage';

export interface User {
    email: string;
    name: string;
    rut?: string;
    role: 'estudiante' | 'docente' | 'director' | 'admin';
}

export interface AuthContextValue {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string, remember?: boolean) => Promise<{ success: boolean; error?: string }>;
    register: (name: string, rut: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
}

interface MockUser {
    email: string;
    password: string;
    name: string;
    rut?: string;
    role: 'estudiante' | 'docente' | 'director' | 'admin';
}

const STORAGE_KEY = 'auth_user';

const initialMockUsers: MockUser[] = [
    { email: 'estud@ufromail.cl', password: 'pass123', name: 'EstudiantePrueba', role: 'estudiante' },
    { email: 'docente@ufrontera.cl', password: 'pass123', name: 'DocentePrueba', role: 'docente' },
    { email: 'director@ufrontera.cl', password: 'pass123', name: 'DirectorPrueba', role: 'director' },
    { email: 'admin@ufrontera.cl', password: 'pass123', name: 'AdminPrueba', role: 'admin' },
];

const mockUsers = [...initialMockUsers];

function findUser(email: string, password: string): MockUser | undefined {
    return mockUsers.find(
        (u) => u.email === email.toLowerCase() && u.password === password,
    );
}

function emailExists(email: string): boolean {
    return mockUsers.some((u) => u.email === email);
}

function validateRegister(email: string, password: string): string | null {
    if (emailExists(email)) return 'El correo ya esta registrado';
    if (password.length < 6) return 'La contraseña debe tener al menos 6 caracteres';
    return null;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(() => storage.get<User>(STORAGE_KEY));
    const isLoading = false;

    const login = useCallback(
        async (email: string, password: string, remember?: boolean): Promise<{ success: boolean; error?: string }> => {
            const found = findUser(email, password);

            if (!found) {
                return { success: false, error: 'Contraseña incorrecta' };
            }

            const userData: User = { email: found.email, name: found.name, role: found.role };
            setUser(userData);

            if (remember) {
                storage.set(STORAGE_KEY, userData);
            }

            return { success: true };
        },
        [],
    );

    const register = useCallback(
        async (name: string, rut: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
            const normalizedEmail = email.toLowerCase();
            const error = validateRegister(normalizedEmail, password);

            if (error) return { success: false, error };

            mockUsers.push({ email: normalizedEmail, password, name, rut, role: 'estudiante' });

            return { success: true };
        },
        [],
    );

    const logout = useCallback(() => {
        setUser(null);
        storage.remove(STORAGE_KEY);
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: user !== null,
                isLoading,
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
