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
let accessToken: string | null = null;

export const setAccessToken = (token: string | null | undefined): void => {
    accessToken = token ?? null;
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
