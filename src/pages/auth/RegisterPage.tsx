import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, Typography } from "antd";
import RegisterForm from "../../components/auth/RegisterForm";
import * as authService from "../../services/auth.service";
import { message } from "antd";

const { Title } = Typography;

const RegisterPage: React.FC = () => {
    const navigate = useNavigate();

    const onRegister = async (values: Record<string, unknown>) => {
        try {
            const payload = {
                name: String(values.fullName ?? ""),
                email: String(values.email ?? ""),
                password: String(values.password ?? ""),
                phone: values.phone as string | undefined,
                address: values.address as string | undefined,
            };

            await authService.register(payload);
            message.success("Registration successful. Please sign in.");
            navigate("/login", { replace: true });
        } catch (err) {
            const e = err as unknown as { response?: { data?: { message?: string } }; message?: string };
            const msg = e?.response?.data?.message ?? e?.message ?? "Registration failed";
            message.error(String(msg));
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
            <Card className="w-full max-w-md shadow-lg">
                <div className="text-center mb-6">
                    <Title level={3}>Create your account</Title>
                </div>
                <RegisterForm onFinish={(v) => onRegister(v as Record<string, unknown>)} />
            </Card>
        </div>
    );
};

export default RegisterPage;
