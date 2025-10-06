import { lazy } from "react";
import type { RouteObject } from "react-router-dom";
import AuthGuard from "../guards/AuthGuard";
import { AppLayout } from "../layouts";
import { HomePage } from "../pages/home";
import { UnauthorizedPage, NotFoundPage } from "../pages/errors";

// Lazy load pages for better performance
const LoginPage = lazy(() => import("../pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("../pages/auth/RegisterPage"));

// Route configuration following a senior-level pattern
export const routeConfig: RouteObject[] = [
    // Public routes without layout
    {
        path: "/login",
        element: <LoginPage />,
    },
    {
        path: "/unauthorized",
        element: <UnauthorizedPage />,
    },
    {
        path: "/register",
        element: <RegisterPage />,
    },
    // Public home page with layout
    {
        path: "/",
        element: (
            <AppLayout>
                <HomePage />
            </AppLayout>
        ),
    },

    // Admin routes
    {
        path: "/admin",
        element: (
            <AppLayout>
                <AuthGuard allowedRoles={["Admin"]}>
                    <div className="p-6">
                        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
                        <p className="text-gray-600">Admin functionality coming soon...</p>
                    </div>
                </AuthGuard>
            </AppLayout>
        ),
    },

    // Staff routes
    {
        path: "/staff",
        element: (
            <AppLayout>
                <AuthGuard allowedRoles={["Admin", "Staff"]}>
                    <div className="p-6">
                        <h1 className="text-2xl font-bold mb-4">Staff Dashboard</h1>
                        <p className="text-gray-600">Staff functionality coming soon...</p>
                    </div>
                </AuthGuard>
            </AppLayout>
        ),
    },

    // Protected user routes
    {
        path: "/reservations",
        element: (
            <AppLayout>
                <AuthGuard>
                    <div className="p-6">
                        <h1 className="text-2xl font-bold mb-4">Quản lý đặt bàn</h1>
                        <p className="text-gray-600">Reservation functionality coming soon...</p>
                    </div>
                </AuthGuard>
            </AppLayout>
        ),
    },
    {
        path: "/orders",
        element: (
            <AppLayout>
                <AuthGuard>
                    <div className="p-6">
                        <h1 className="text-2xl font-bold mb-4">Quản lý đơn hàng</h1>
                        <p className="text-gray-600">Order functionality coming soon...</p>
                    </div>
                </AuthGuard>
            </AppLayout>
        ),
    },

    // Catch-all route for 404
    {
        path: "*",
        element: <NotFoundPage />,
    },
];

export default routeConfig;