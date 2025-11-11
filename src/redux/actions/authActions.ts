import { createAsyncThunk } from '@reduxjs/toolkit';
import { setLoading, setUser, setError, clearError } from '../slices/authSlice';
import { setAccessToken } from '../../utils/axios';
import * as authApi from '../../utils/api/auth.api';
import type { AppDispatch } from '../store';

// Login async action
export const loginUser = createAsyncThunk(
    'auth/login',
    async (credentials: { email: string; password: string }, { dispatch, rejectWithValue }) => {
        try {
            console.log('[LoginUser] Starting login with:', credentials.email);
            dispatch(setLoading(true));
            dispatch(clearError());

            const response = await authApi.login(credentials);
            console.log('[LoginUser] API Response:', response.data);

            // Backend wraps response in { data: { token, user, success, message } }
            const loginData = response.data.data;

            if (loginData.success) {
                console.log('[LoginUser] Login successful, setting token');
                // Set token for axios requests
                setAccessToken(loginData.token);

                dispatch(setUser({
                    user: loginData.user,
                    token: loginData.token
                }));

                return {
                    user: loginData.user,
                    token: loginData.token
                };
            } else {
                console.log('[LoginUser] API returned success=false:', loginData.message);
                dispatch(setError(loginData.message || 'Login failed'));
                return rejectWithValue(loginData.message || 'Login failed');
            }
        } catch (error: unknown) {
            console.error('[LoginUser] Error:', error);
            const axiosError = error as { response?: { status?: number; data?: { message?: string } }; message?: string };
            console.log('[LoginUser] Error response:', axiosError.response);
            console.log('[LoginUser] Error status:', axiosError.response?.status);
            console.log('[LoginUser] Error data:', axiosError.response?.data);
            const errorMessage = axiosError.response?.data?.message || axiosError.message || 'Login failed';
            console.log('[LoginUser] Rejecting with:', errorMessage);
            dispatch(setError(errorMessage));
            return rejectWithValue(errorMessage);
        } finally {
            dispatch(setLoading(false));
        }
    }
);

// Google Login async action
export const loginWithGoogle = createAsyncThunk(
    'auth/loginWithGoogle',
    async (idToken: string, { dispatch, rejectWithValue }) => {
        try {
            console.log('[GoogleLogin] Starting Google login');
            dispatch(setLoading(true));
            dispatch(clearError());

            const response = await authApi.loginWithGoogle({ idToken });
            console.log('[GoogleLogin] API Response:', response.data);

            // Backend wraps response in { data: { token, user, success, message } }
            const loginData = response.data.data;

            if (loginData.success) {
                console.log('[GoogleLogin] Google login successful, setting token');
                // Set token for axios requests
                setAccessToken(loginData.token);

                dispatch(setUser({
                    user: loginData.user,
                    token: loginData.token
                }));

                return {
                    user: loginData.user,
                    token: loginData.token
                };
            } else {
                console.log('[GoogleLogin] API returned success=false:', loginData.message);
                dispatch(setError(loginData.message || 'Google login failed'));
                return rejectWithValue(loginData.message || 'Google login failed');
            }
        } catch (error: unknown) {
            console.error('[GoogleLogin] Error:', error);
            const axiosError = error as { response?: { status?: number; data?: { message?: string } }; message?: string };
            console.log('[GoogleLogin] Error response:', axiosError.response);
            const errorMessage = axiosError.response?.data?.message || axiosError.message || 'Google login failed';
            console.log('[GoogleLogin] Rejecting with:', errorMessage);
            dispatch(setError(errorMessage));
            return rejectWithValue(errorMessage);
        } finally {
            dispatch(setLoading(false));
        }
    }
);

// Register async action
export const registerUser = createAsyncThunk(
    'auth/register',
    async (userData: authApi.RegisterRequest, { dispatch, rejectWithValue }) => {
        try {
            dispatch(setLoading(true));
            dispatch(clearError());

            const response = await authApi.register(userData);

            // Backend wraps response in { data: { token, user, success, message } }
            const registerData = response.data.data;

            if (registerData.success) {
                // Set token for axios requests
                setAccessToken(registerData.token);

                dispatch(setUser({
                    user: registerData.user,
                    token: registerData.token
                }));
                return registerData;
            } else {
                dispatch(setError(registerData.message || 'Registration failed'));
                return rejectWithValue(registerData.message);
            }
        } catch (error: unknown) {
            const axiosError = error as { response?: { data?: { message?: string } } };
            const errorMessage = axiosError.response?.data?.message || 'Registration failed';
            dispatch(setError(errorMessage));
            return rejectWithValue(errorMessage);
        } finally {
            dispatch(setLoading(false));
        }
    }
);

// Get profile async action
export const getProfile = createAsyncThunk(
    'auth/getProfile',
    async (_, { dispatch, rejectWithValue }) => {
        try {
            dispatch(setLoading(true));
            dispatch(clearError());

            const response = await authApi.getProfile();

            if (response.data) {
                dispatch(setUser({
                    user: response.data,
                    token: localStorage.getItem('fe_restaurant_access_token') || ''
                }));
                return response.data;
            }
        } catch (error: unknown) {
            const axiosError = error as { response?: { data?: { message?: string } } };
            const errorMessage = axiosError.response?.data?.message || 'Failed to get profile';
            dispatch(setError(errorMessage));
            return rejectWithValue(errorMessage);
        } finally {
            dispatch(setLoading(false));
        }
    }
);

// Logout action (synchronous)
export const logoutUser = () => (dispatch: AppDispatch) => {
    dispatch({ type: 'auth/logout' });
};