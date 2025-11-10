// src/guards/PublicGuard.tsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "../redux/app/hook";

interface PublicGuardProps {
    children: React.ReactNode;
    redirectPath?: string;
}

const PublicGuard: React.FC<PublicGuardProps> = ({ children, redirectPath = "/" }) => {
    const authState = useAppSelector(state => state.auth);
    const { user, token } = authState as { user: any | null; token: string | null };
    const isAuthenticated = !!token && !!user;

    if (isAuthenticated) {
        return <Navigate to={redirectPath} replace />;
    }

    return <>{children}</>;
};

export default PublicGuard;
