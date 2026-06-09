import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';
import type React from 'react';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const { isAuthenticated, isLoading } = useAuth();
    const location = useLocation();

    if(isLoading){
        return <div>Cargando...</div>;
    }
    if(!isAuthenticated){
        return <Navigate to="/login" state={{from: location}} replace/>;
    }

    return <>{children}</>
}