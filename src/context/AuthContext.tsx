import React, { useEffect, useState, useCallback } from "react";
import * as authService from "../services/auth.service";
import { AuthContext } from "./AuthContextBase";
import type { User } from "../types/User";

interface AuthProviderProps {
    children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Initialize auth state on app start
    useEffect(() => {
        // Do not clear persisted token on startup - allow token from localStorage to be used
        setUser(null);
        setLoading(false);
    }, []);

    const login = useCallback(async (email: string, password: string): Promise<void> => {
        setLoading(true);
        try {
            const loginResponse = await authService.login(email, password);
            setUser(loginResponse.user);
        } catch (error) {
            setUser(null);
            throw error; // Re-throw so LoginPage can handle the error
        } finally {
            setLoading(false);
        }
    }, []);

    const loginWithGoogle = useCallback(async (idToken: string): Promise<void> => {
        setLoading(true);
        try {
            const res = await authService.loginWithGoogle(idToken);
            setUser(res.user);
        } catch (error) {
            setUser(null);
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    const logout = useCallback(async (): Promise<void> => {
        try {
            await authService.logout();
        } finally {
            setUser(null);
        }
    }, []);

    const contextValue = {
        user,
        isAuthenticated: !!user,
        login,
        loginWithGoogle,
        logout,
        loading,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};