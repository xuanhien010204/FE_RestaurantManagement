import React, { useState } from "react";
import { useAuth } from "../../context/useAuth";
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
    const { login, loginWithGoogle } = useAuth();
    const navigate = useNavigate();
    const location = useLocation() as { state?: LocationState };

    const [error, setError] = useState<string | null>(null);
    // Removed inline register toggle

    const redirectPath = location.state?.from?.pathname ?? "/";

    const onLogin = async (values: { email: string; password: string }) => {
        try {
            await login(values.email, values.password);
            navigate(redirectPath, { replace: true });
        } catch (err) {
            const axiosError = err as AxiosError<{ message?: string }>;
            const errorMessage =
                axiosError.response?.data?.message ??
                axiosError.message ??
                "Login failed. Please try again.";
            setError(errorMessage);
        }
    };

    // register handled on its own page

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
            <Card className="w-full max-w-md shadow-lg">
                <div className="text-center mb-6">
                    <Title level={3}>Sign in to your account</Title>
                    <Text type="secondary">Welcome to Restaurant Management System</Text>
                </div>

                {error && (
                    <Alert
                        message={error}
                        type="error"
                        showIcon
                        closable
                        className="mb-4"
                    />
                )}

                <LoginForm onFinish={(v) => onLogin(v as { email: string; password: string })} />

                <Divider>or</Divider>

                <GoogleLoginButton
                    onSuccess={async (idToken) => {
                        try {
                            await loginWithGoogle(idToken);
                            navigate(redirectPath, { replace: true });
                        } catch (err) {
                            const axiosError = err as AxiosError<{ message?: string }>;
                            const errorMessage = axiosError.response?.data?.message ?? axiosError.message ?? "Google login failed";
                            setError(errorMessage);
                        }
                    }}
                    onError={(err) => setError(String(err ?? "Google login error"))}
                />

                <div className="mt-4 text-center">
                    <Link to="/register" className="text-blue-600 hover:underline">Don't have an account? Register</Link>
                </div>
            </Card>
        </div>
    );
};

export default LoginPage;
