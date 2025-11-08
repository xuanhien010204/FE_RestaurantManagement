import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "../redux/app/hook";
import type { UserRole } from "../types/User";

interface AuthGuardProps {
    children: React.ReactNode;
    allowedRoles?: UserRole[];
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children, allowedRoles }) => {
    const auth = useAppSelector(state => state.auth);
    const { user, token, loading } = auth as {
        user: { role: UserRole } | null;
        token: string | null;
        loading: boolean;
    };
    const location = useLocation();
    const isAuthenticated = !!token && !!user;

    // Show loading spinner while checking auth state
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // If no allowedRoles specified, default to Customer only (prevents Customer from accessing admin)
    const effectiveAllowedRoles = allowedRoles || ["Customer"];

    // Check role-based access
    if (user) {
        // Normalize both sides to avoid mismatches due to casing, whitespace or numeric/string differences
        const normalizedUserRole = String(user.role ?? "").trim().toLowerCase();
        const hasRequiredRole = effectiveAllowedRoles.some((r: UserRole) => String(r ?? "").trim().toLowerCase() === normalizedUserRole);

        if (!hasRequiredRole) {
            // Helpful debug log to understand why a user with role might be denied
            if (typeof console !== "undefined" && typeof console.warn === "function") {
                console.warn("AuthGuard: access denied - role mismatch", {
                    allowedRoles: effectiveAllowedRoles,
                    userRole: user.role,
                    normalizedUserRole,
                    currentPath: location.pathname
                });
            }

            return <Navigate to="/unauthorized" replace />;
        }
    }

    return <>{children}</>;
};

export default AuthGuard;
