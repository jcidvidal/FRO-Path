import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { LoginPage } from '../pages/LoginPage/LoginPage';
import { RegisterPage } from '../pages/RegisterPage/RegisterPage';
import { DashboardPage } from '../pages/DashboardPage/DashboardPage';
import { DocentePage } from '../pages/DocentePage/DocentePage';
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
                <DocentePage />
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