import axios from "../axios";

export type LoginRequest = { email: string; password: string };
export type LoginResponse = { accessToken: string; user: unknown };

export const login = (payload: LoginRequest) => axios.post<LoginResponse>("/Auth/login", payload);
export const logout = () => axios.post("/Auth/logout", {}, { withCredentials: true });
export const loginWithGoogle = (payload: { idToken: string }) => axios.post<LoginResponse>("/Auth/google-login", payload, { withCredentials: true });
