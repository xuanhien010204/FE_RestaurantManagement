import React, { useState } from "react";
import { useAuth } from "../../context/useAuth";
import { useNavigate, useLocation } from "react-router-dom";
import type { AxiosError } from "axios";
import { Form, Input, Button, Alert, Typography, Card, Spin, Divider } from "antd";
import GoogleLoginButton from "../../components/GoogleLoginButton";

const { Title, Text } = Typography;

interface LocationState {
    from?: {
        pathname?: string;
    };
}

const LoginPage: React.FC = () => {
    const { login, loading, loginWithGoogle } = useAuth();
    const navigate = useNavigate();
    const location = useLocation() as { state?: LocationState };

    const [error, setError] = useState<string | null>(null);

    const redirectPath = location.state?.from?.pathname ?? "/";

    const onFinish = async (values: { email: string; password: string }) => {
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

                <Form
                    name="login"
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={{ email: "", password: "" }}
                >
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: "Please input your email!" },
                            { type: "email", message: "Email is not valid" },
                        ]}
                    >
                        <Input placeholder="Email address" disabled={loading} />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[{ required: true, message: "Please input your password!" }]}
                    >
                        <Input.Password placeholder="Password" disabled={loading} />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                            disabled={loading}
                            icon={loading ? <Spin size="small" /> : undefined}
                        >
                            {loading ? "Signing in..." : "Sign in"}
                        </Button>
                    </Form.Item>
                </Form>

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
            </Card>
        </div>
    );
};

export default LoginPage;
