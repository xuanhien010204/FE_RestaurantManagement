import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/app/hook";
import { loginUser } from "../../redux/actions/authActions";
import { useNavigate, useLocation, Link } from "react-router-dom";
import type { AxiosError } from "axios";
import { Alert, Typography, Card, Divider } from "antd";
import GoogleLoginButton from "../../components/auth/GoogleLoginButton";
import LoginForm from "../../components/auth/LoginForm";

const { Title, Text } = Typography;

interface LocationState {
    from?: {
        pathname?: string;
    };
}

const LoginPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const authState = useAppSelector(state => state.auth);
    const { loading, error } = authState as { loading: boolean; error: string | null };
    const navigate = useNavigate();
    const location = useLocation() as { state?: LocationState };

    const [localError, setLocalError] = useState<string | null>(null);

    const redirectPath = location.state?.from?.pathname ?? "/";

    const onLogin = async (values: { email: string; password: string }) => {
        try {
            console.log('[LoginPage] onLogin called with:', values);
            setLocalError(null);
            const result = await dispatch(loginUser(values));
            console.log('[LoginPage] Dispatch result:', result);

            // Check if login was successful
            if (loginUser.fulfilled.match(result)) {
                console.log('[LoginPage] Login fulfilled, navigating to:', redirectPath);
                navigate(redirectPath, { replace: true });
            } else if (loginUser.rejected.match(result)) {
                console.log('[LoginPage] Login rejected with payload:', result.payload);
                setLocalError(result.payload as string || 'Login failed');
            }
        } catch (err) {
            console.error('[LoginPage] Caught error:', err);
            const axiosError = err as AxiosError<{ message?: string }>;
            const errorMessage =
                axiosError.response?.data?.message ??
                axiosError.message ??
                "Login failed. Please try again.";
            setLocalError(errorMessage);
        }
    };

    const onGoogleLoginSuccess = async (idToken: string) => {
        try {
            console.log('[LoginPage] onGoogleLoginSuccess called with idToken');
            setLocalError(null);

            // Call API directly without Redux to avoid potential loading issues
            const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/google-login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ idToken }),
            });

            console.log('[LoginPage] Google login response status:', response.status);

            if (!response.ok) {
                const errorData = await response.json();
                const errorMessage = errorData.message || `HTTP Error ${response.status}`;
                console.error('[LoginPage] Google login API error:', errorMessage);
                setLocalError(errorMessage);
                return;
            }

            const data = await response.json();
            console.log('[LoginPage] Google login success, data:', { success: data.success, user: data.user?.email });

            if (data.success) {
                // Save token and user to localStorage and Redux
                localStorage.setItem('fe_restaurant_access_token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));

                // Update Redux store
                dispatch({ type: 'auth/setUser', payload: { user: data.user, token: data.token } });

                // Set axios token
                const { setAccessToken } = await import('../../utils/axios');
                setAccessToken(data.token);

                console.log('[LoginPage] Google login successful, navigating to:', redirectPath);
                navigate(redirectPath, { replace: true });
            } else {
                setLocalError(data.message || 'Google login failed');
            }
        } catch (err) {
            console.error('[LoginPage] Google login caught error:', err);
            const errorMessage = err instanceof Error ? err.message : 'Google login failed. Please try again.';
            setLocalError(errorMessage);
        }
    };

    const displayError = error || localError;

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
            <Card className="w-full max-w-md shadow-lg">
                <div className="text-center mb-6">
                    <Title level={3}>Sign in to your account</Title>
                    <Text type="secondary">Welcome to Restaurant Management System</Text>
                </div>

                {displayError && (
                    <Alert
                        message={displayError}
                        type="error"
                        showIcon
                        closable
                        className="mb-4"
                        onClose={() => setLocalError(null)}
                    />
                )}

                <LoginForm
                    onFinish={(v) => onLogin(v as { email: string; password: string })}
                    loading={loading}
                />

                <Divider>or</Divider>

                <GoogleLoginButton
                    onSuccess={onGoogleLoginSuccess}
                    onError={(err) => setLocalError(String(err ?? "Google login error"))}
                />

                <div className="mt-4 text-center">
                    <Link to="/register" className="text-blue-600 hover:underline">Don't have an account? Register</Link>
                </div>
            </Card>
        </div>
    );
};

export default LoginPage;
