import { createBrowserRouter } from 'react-router-dom';
import { Login } from '@/pages/Login';
import { Register } from '@/pages/Register';
import { Dashboard } from '@/pages/Dashboard';
import { Transactions } from '@/pages/Transactions';
import { Profile } from '@/pages/Profile';
import { Budgets } from '@/pages/Budgets';
import { Goals } from '@/pages/Goals';
import { Bills } from '@/pages/Bills';
import { AppLayout } from '@/components/layout/AppLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export const router = createBrowserRouter([
    {
        path: '/login',
        element: <Login />,
    },
    {
        path: '/register',
        element: <Register />,
    },
    {
        element: <ProtectedRoute />,
        children: [
            {
                element: <AppLayout />,
                children: [
                    {
                        path: '/',
                        element: <Dashboard />,
                    },
                    {
                        path: '/dashboard',
                        element: <Dashboard />,
                    },
                    {
                        path: '/transactions',
                        element: <Transactions />,
                    },
                    {
                        path: '/budgets',
                        element: <Budgets />,
                    },
                    {
                        path: '/goals',
                        element: <Goals />,
                    },
                    {
                        path: '/bills',
                        element: <Bills />,
                    },
                    {
                        path: '/profile',
                        element: <Profile />,
                    },
                ],
            },
        ],
    },
]);
