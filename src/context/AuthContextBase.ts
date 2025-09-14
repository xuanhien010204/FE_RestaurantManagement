import type { Context } from "react";
import { createContext } from "react";
import type { User } from "../types/User";

export type AuthContextType = {
    user: User | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    loginWithGoogle: (idToken: string) => Promise<void>;
    logout: () => Promise<void>;
    loading: boolean;
};

export const AuthContext: Context<AuthContextType | undefined> = createContext<AuthContextType | undefined>(undefined);
