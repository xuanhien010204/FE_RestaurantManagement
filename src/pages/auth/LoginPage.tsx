import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import type { AxiosError } from "axios";
import { Alert, Typography, Card, Divider } from "antd";
import GoogleLoginButton from "../../components/auth/GoogleLoginButton";
import LoginForm from "../../components/auth/LoginForm";
import { useAuth } from "../../context/useAuth";

const { Title, Text } = Typography;

interface LocationState {
    from?: {
        pathname?: string;
    };
}

const LoginPage: React.FC = () => {
    const { login, loginWithGoogle, loading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation() as { state?: LocationState };

    const [localError, setLocalError] = useState<string | null>(null);

    const redirectPath = location.state?.from?.pathname ?? "/";

    const onLogin = async (values: { email: string; password: string }) => {
        try {
            console.log('[LoginPage] onLogin called with:', values);
            setLocalError(null);

            await login(values.email, values.password);

            console.log('[LoginPage] Login successful, navigating to:', redirectPath);
            navigate(redirectPath, { replace: true });
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

            await loginWithGoogle(idToken);

            console.log('[LoginPage] Google login successful, navigating to:', redirectPath);
            navigate(redirectPath, { replace: true });
        } catch (err) {
            console.error('[LoginPage] Google login caught error:', err);
            const errorMessage = err instanceof Error ? err.message : 'Google login failed. Please try again.';
            setLocalError(errorMessage);
        }
    };

    const displayError = localError;

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
