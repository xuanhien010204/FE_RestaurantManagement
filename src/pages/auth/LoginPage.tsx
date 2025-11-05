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
                    onSuccess={async () => {
                        try {
                            // TODO: Implement Google login Redux action here
                            setLocalError("Google login not yet implemented with Redux");
                        } catch (err) {
                            const axiosError = err as AxiosError<{ message?: string }>;
                            const errorMessage = axiosError.response?.data?.message ?? axiosError.message ?? "Google login failed";
                            setLocalError(errorMessage);
                        }
                    }}
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
