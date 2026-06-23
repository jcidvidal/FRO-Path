import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { storage } from './storage';

export interface User {
    email: string;
    name: string;
    rut?: string;
    role: 'estudiante' | 'docente' | 'director' | 'admin';
}

export interface MockUser {
    email: string;
    password: string;
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
    getAllUsers: () => MockUser[];
    createUser: (data: Omit<MockUser, never>) => Promise<{ success: boolean; error?: string }>;
    updateUser: (email: string, data: Partial<Pick<MockUser, 'name' | 'rut' | 'role'>>) => Promise<{ success: boolean; error?: string }>;
    deleteUser: (email: string) => Promise<{ success: boolean; error?: string }>;
}

const STORAGE_KEY = 'auth_user';

const initialMockUsers: MockUser[] = [
    { email: 'estud@ufromail.cl', password: 'pass123', name: 'EstudiantePrueba', role: 'estudiante' },
    { email: 'docente@ufrontera.cl', password: 'pass123', name: 'DocentePrueba', role: 'docente' },
    { email: 'director@ufrontera.cl', password: 'pass123', name: 'DirectorPrueba', role: 'director' },
    { email: 'admin@ufrontera.cl', password: 'pass123', name: 'AdminPrueba', role: 'admin' },
];

let mockUsers = [...initialMockUsers];

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
    if (password.length < 6) return 'La contrasena debe tener al menos 6 caracteres';
    return null;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const saved = storage.get<User>(STORAGE_KEY);
        if (saved) {
            setUser(saved);
        }
        setIsLoading(false);
    }, []);

    const login = useCallback(
        async (email: string, password: string, remember?: boolean): Promise<{ success: boolean; error?: string }> => {
            const found = findUser(email, password);
            if (!found) {
                return { success: false, error: 'Contrasena incorrecta' };
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

    const getAllUsers = useCallback((): MockUser[] => {
        return [...mockUsers];
    }, []);

    const createUser = useCallback(
        async (data: MockUser): Promise<{ success: boolean; error?: string }> => {
            const normalizedEmail = data.email.toLowerCase();
            if (emailExists(normalizedEmail)) {
                return { success: false, error: 'El correo ya esta registrado' };
            }
            if (!data.password || data.password.length < 6) {
                return { success: false, error: 'La contrasena debe tener al menos 6 caracteres' };
            }
            mockUsers.push({ ...data, email: normalizedEmail });
            return { success: true };
        },
        [],
    );

    const updateUser = useCallback(
        async (email: string, data: Partial<Pick<MockUser, 'name' | 'rut' | 'role'>>): Promise<{ success: boolean; error?: string }> => {
            const index = mockUsers.findIndex((u) => u.email === email);
            if (index === -1) {
                return { success: false, error: 'Usuario no encontrado' };
            }
            mockUsers[index] = { ...mockUsers[index], ...data };
            if (user?.email === email) {
                setUser((prev) => prev ? { ...prev, ...data } : prev);
            }
            return { success: true };
        },
        [user],
    );

    const deleteUser = useCallback(
        async (email: string): Promise<{ success: boolean; error?: string }> => {
            if (user?.email === email) {
                return { success: false, error: 'No puedes eliminarte a ti mismo' };
            }
            const index = mockUsers.findIndex((u) => u.email === email);
            if (index === -1) {
                return { success: false, error: 'Usuario no encontrado' };
            }
            mockUsers.splice(index, 1);
            return { success: true };
        },
        [user],
    );

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: user !== null,
                isLoading,
                login,
                register,
                logout,
                getAllUsers,
                createUser,
                updateUser,
                deleteUser,
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