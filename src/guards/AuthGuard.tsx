import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import type { UserRole } from "../types/User";

interface AuthGuardProps {
    children: React.ReactNode;
    allowedRoles?: UserRole[];
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children, allowedRoles }) => {
    const { isAuthenticated, user, loading } = useAuth();
    const location = useLocation();

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

    // Check role-based access if roles are specified
    if (allowedRoles && user) {
        // Normalize both sides to avoid mismatches due to casing, whitespace or numeric/string differences
        const normalizedUserRole = String(user.role ?? "").trim().toLowerCase();
        const hasRequiredRole = allowedRoles.some((r) => String(r ?? "").trim().toLowerCase() === normalizedUserRole);

        if (!hasRequiredRole) {
            // Helpful debug log to understand why a user with "Admin" role might be denied
            if (typeof console !== "undefined" && typeof console.warn === "function") {
                console.warn("AuthGuard: access denied - role mismatch", {
                    allowedRoles,
                    userRole: user.role,
                    normalizedUserRole,
                });
            }

            return <Navigate to="/unauthorized" replace />;
        }
    }

    return <>{children}</>;
};

export default AuthGuard;
