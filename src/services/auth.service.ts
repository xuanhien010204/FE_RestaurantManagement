import * as authApi from "../utils/api/auth.api";
import { setAccessToken } from "../utils/axios";
import type { User } from "../types/User";

// Map backend numeric enums to frontend string unions
const UserRoleMap: Record<number, User["role"]> = {
    0: "Admin",
    1: "Staff",
    2: "Customer"
};

const UserStatusMap: Record<number, User["status"]> = {
    0: "Active",
    1: "Inactive",
    2: "Suspended"
};

export interface LoginResponse {
    accessToken: string;
    user: User;
}

export const login = async (email: string, password: string): Promise<LoginResponse> => {
    try {
        const response = await authApi.login({ email, password });
        const { accessToken, user: rawUser } = response.data;

        // Set access token in memory
        setAccessToken(accessToken);

        // Map backend user to frontend user
        const user = mapBackendUserToFrontend(rawUser);

        return { accessToken, user };
    } catch (error) {
        setAccessToken(null);
        throw error;
    }
};

export const loginWithGoogle = async (idToken: string): Promise<LoginResponse> => {
    try {
        const response = await authApi.loginWithGoogle({ idToken });
        const { accessToken, user: rawUser } = response.data;

        setAccessToken(accessToken);

        const user = mapBackendUserToFrontend(rawUser);
        return { accessToken, user };
    } catch (error) {
        setAccessToken(null);
        throw error;
    }
};

export const logout = async (): Promise<void> => {
    try {
        await authApi.logout();
    } finally {
        // Always cleanup local state
        setAccessToken(null);
    }
};

// Map backend user DTO to frontend User type
const mapBackendUserToFrontend = (raw: unknown): User => {
    const backendUser = raw as Record<string, unknown>;

    return {
        id: Number(backendUser.id ?? 0),
        fullName: String(backendUser.fullName ?? ""),
        email: String(backendUser.email ?? ""),
        passwordHash: String(backendUser.passwordHash ?? ""),
        phone: backendUser.phone as string | undefined,
        address: backendUser.address as string | undefined,
        role: UserRoleMap[Number(backendUser.role ?? 2)] ?? "Customer",
        status: UserStatusMap[Number(backendUser.status ?? 0)] ?? "Active",
        createdAt: String(backendUser.createdAt ?? new Date().toISOString()),
        updatedAt: backendUser.updatedAt as string | undefined,
        isDeleted: Boolean(backendUser.isDeleted ?? false),
    };
};