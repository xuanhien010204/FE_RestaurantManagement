import React, { useEffect, useState, useCallback } from "react";
import * as authService from "../services/auth.service";
import { AuthContext } from "./AuthContextBase";
import { useAppDispatch, useAppSelector } from "../redux/app/hook";
import { setUser } from "../redux/slices/authSlice";

interface AuthProviderProps {
    children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const dispatch = useAppDispatch();
    const reduxUser = useAppSelector(state => state.auth.user);
    const [loading, setLoading] = useState(true);

    // Initialize auth state on app start
    useEffect(() => {
        setLoading(false);
    }, []);

    const login = useCallback(async (email: string, password: string): Promise<void> => {
        setLoading(true);
        try {
            const loginResponse = await authService.login(email, password);
            dispatch(setUser({ user: loginResponse.user, token: loginResponse.token }));
        } finally {
            setLoading(false);
        }
    }, [dispatch]);

    const loginWithGoogle = useCallback(async (idToken: string): Promise<void> => {
        setLoading(true);
        try {
            const res = await authService.loginWithGoogle(idToken);
            dispatch(setUser({ user: res.user, token: res.token }));
        } finally {
            setLoading(false);
        }
    }, [dispatch]);

    const logout = useCallback(async (): Promise<void> => {
        try {
            await authService.logout();
        } finally {
            // logout action already handled in Redux
        }
    }, []);

    const contextValue = {
        user: reduxUser,
        isAuthenticated: !!reduxUser,
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