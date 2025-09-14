import { lazy } from "react";
import type { RouteObject } from "react-router-dom";
import AuthGuard from "../guards/AuthGuard";
import { HomePage } from "../pages/home";
import { UnauthorizedPage, NotFoundPage } from "../pages/errors";

// Lazy load pages for better performance
const LoginPage = lazy(() => import("../pages/auth/LoginPage"));

// Route configuration following a senior-level pattern
export const routeConfig: RouteObject[] = [
    // Public routes
    {
        path: "/login",
        element: <LoginPage />,
    },
    {
        path: "/unauthorized",
        element: <UnauthorizedPage />,
    },

    // Protected routes
    {
        path: "/",
        element: (
            <AuthGuard>
                <HomePage />
            </AuthGuard>
        ),
    },

    // Admin routes
    {
        path: "/admin",
        element: (
            <AuthGuard allowedRoles={["Admin"]}>
                <div className="p-6">
                    <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
                    <p className="text-gray-600">Admin functionality coming soon...</p>
                </div>
            </AuthGuard>
        ),
    },

    // Staff routes
    {
        path: "/staff",
        element: (
            <AuthGuard allowedRoles={["Admin", "Staff"]}>
                <div className="p-6">
                    <h1 className="text-2xl font-bold mb-4">Staff Dashboard</h1>
                    <p className="text-gray-600">Staff functionality coming soon...</p>
                </div>
            </AuthGuard>
        ),
    },

    // Catch-all route for 404
    {
        path: "*",
        element: <NotFoundPage />,
    },
];

export default routeConfig;