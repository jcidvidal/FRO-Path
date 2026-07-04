import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';
import type React from 'react';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: string[];
}
const roleRoutes: Record<string, string> = {
  estudiante: '/dashboard',
  docente: '/dashboard/docente',
  director: '/dashboard/director',
  admin: '/dashboard/admin',
};

export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
    const { isAuthenticated, isLoading, user } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return <div>Cargando...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        const redirectTo = roleRoutes[user.role] || '/dashboard';
        return <Navigate to={redirectTo} replace />;
    }

    return <>{children}</>;
};