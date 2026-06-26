import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { LoginPage } from '../pages/LoginPage/LoginPage';
import { RegisterPage } from '../pages/RegisterPage/RegisterPage';
import { DashboardPage } from '../pages/DashboardPage/DashboardPage';
import { DocenteDashboardPage } from '../pages/DocenteDashboardPage/DocenteDashboardPage';
import { DirectorDashboardPage } from '../pages/DirectorDashboardPage/DirectorDashboardPage';
import { AdminDashboardPage } from '../pages/AdminDashboardPage/AdminDashboardPage';
import { ProtectedRoute } from './ProtectedRoute';

const router = createBrowserRouter([
    {
        path: '/login',
        element: <LoginPage />,
    },
    {
        path: '/register',
        element: <RegisterPage />,
    },
    {
        path: '/dashboard',
        element: (
            <ProtectedRoute allowedRoles={['estudiante']}>
                <DashboardPage />
            </ProtectedRoute>
        ),
    },
    {
        path: '/dashboard/docente',
        element: (
            <ProtectedRoute allowedRoles={['docente']}>
                <DocenteDashboardPage />
            </ProtectedRoute>
        ),
    },
    {
        path: '/dashboard/director',
        element: (
            <ProtectedRoute allowedRoles={['director']}>
                <DirectorDashboardPage />
            </ProtectedRoute>
        ),
    },
    {
        path: '/dashboard/admin',
        element: (
            <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboardPage />
            </ProtectedRoute>
        ),
    },
    {
        path: '/',
        element: <Navigate to="/login" replace />,
    },
    {
        path: '*',
        element: <Navigate to="/login" replace />,
    },
]);

export const AppRoutes = () => <RouterProvider router={router} />;
