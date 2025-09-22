import axios from "axios";
import type { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { API_URL } from "../constants/API_URL";

// Create axios instance with base configuration
const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
    timeout: 10000, // 10 seconds
});

// Token management
// Persist token in localStorage so it survives reloads (trade-off: XSS risk)
const TOKEN_STORAGE_KEY = "fe_restaurant_access_token";

let accessToken: string | null = null;

// initialize from localStorage if present
try {
    const stored = localStorage.getItem(TOKEN_STORAGE_KEY);
    accessToken = stored ?? null;
} catch {
    // localStorage may be unavailable in some environments (SSR or restrictive browsers)
    accessToken = null;
}

export const setAccessToken = (token: string | null | undefined): void => {
    accessToken = token ?? null;
    try {
        if (accessToken) localStorage.setItem(TOKEN_STORAGE_KEY, accessToken);
        else localStorage.removeItem(TOKEN_STORAGE_KEY);
    } catch {
        // ignore storage errors
    }
};

export const getAccessToken = (): string | null => {
    return accessToken;
};

// Request interceptor to add authorization header
axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    if (accessToken && config.headers) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
});
// Simple response interceptor: forward successful responses, reject errors.
axiosInstance.interceptors.response.use((response: AxiosResponse) => response, (error: AxiosError) => Promise.reject(error));

export default axiosInstance;
