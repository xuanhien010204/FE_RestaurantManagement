import axios from "../axios";

export type LoginRequest = { email: string; password: string };
export type LoginResponse = { accessToken: string; user: unknown };
export type UpdateProfileRequest = { fullName: string; phone: string; address: string };
export type ChangePasswordRequest = { currentPassword: string; newPassword: string; confirmNewPassword: string };
export type ForgotPasswordRequest = { email: string };
export type ResetPasswordRequest = { newPassword: string; confirmPassword: string; token: string };

export const login = (payload: LoginRequest) => axios.post<LoginResponse>("/auth/login", payload);
export const logout = () => axios.post("/auth/logout", {}, { withCredentials: true });
export const loginWithGoogle = (payload: { idToken: string }) => axios.post<LoginResponse>("/auth/google-login", payload, { withCredentials: true });
export const register = (payload: { fullName: string; email: string; password: string; confirmPassword: string; phone?: string; address?: string }) => axios.post("/auth/register", payload);
export const getProfile = () => axios.get("/auth/profile");
export const updateProfile = (payload: UpdateProfileRequest) => axios.put("/auth/profile", payload);
export const changePassword = (payload: ChangePasswordRequest) => axios.post("/auth/change-password", payload);
export const forgotPassword = (payload: ForgotPasswordRequest) => axios.post("/auth/forgot-password", payload);
export const resetPassword = (payload: ResetPasswordRequest) => axios.post("/auth/reset-password", payload);

// User Management APIs (Admin only)
export const deleteUser = (id: number) => axios.delete(`/user/user/${id}`);
export const lockUser = (id: number) => axios.put(`/user/user/${id}/lock`);