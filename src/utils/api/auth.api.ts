import axios from "../axios";

export type LoginRequest = { email: string; password: string };
export type LoginResponse = { accessToken: string; user: unknown };

export const login = (payload: LoginRequest) => axios.post<LoginResponse>("/auth/login", payload);
export const logout = () => axios.post("/auth/logout", {}, { withCredentials: true });
export const loginWithGoogle = (payload: { idToken: string }) => axios.post<LoginResponse>("/auth/google-login", payload, { withCredentials: true });
export const register = (payload: { fullName: string; email: string; password: string; confirmPassword: string; phone?: string; address?: string }) => axios.post("/auth/register", payload);