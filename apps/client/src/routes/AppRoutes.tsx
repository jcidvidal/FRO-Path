import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { LoginPage } from '../pages/LoginPage/LoginPage';
import { RegisterPage } from '../pages/RegisterPage/RegisterPage';

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
        path: '/',
        element: <Navigate to="/login" replace />,
    },
    {
        path: '*',
        element: <Navigate to="/login" replace />,
    },
]);

export const AppRoutes = ()=> <RouterProvider router={router}/>;