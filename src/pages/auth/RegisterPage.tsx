import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, Typography, Form } from "antd";
import type { FormInstance } from "antd";
import RegisterForm from "../../components/auth/RegisterForm";
import * as authService from "../../services/auth.service";
import { message } from "antd";

const { Title } = Typography;

// Map backend validation field names to form field keys
const FIELD_MAP: Record<string, string> = {
    FullName: "fullName",
    Email: "email",
    Password: "password",
    ConfirmPassword: "confirmPassword",
    Phone: "phone",
    Address: "address",
};

const RegisterPage: React.FC = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();

    type ValidationResponse = { errors?: Record<string, string[]>, message?: string };

    const onRegister = async (values: Record<string, unknown>) => {
        try {
            const payload = {
                fullName: String(values.fullName ?? ""),
                email: String(values.email ?? ""),
                password: String(values.password ?? ""),
                confirmPassword: String(values.confirmPassword ?? ""),
                phone: String(values.phone ?? ""),
                address: String(values.address ?? ""),
            };

            await authService.register(payload);
            message.success("Registration successful. Please sign in.");
            navigate("/login", { replace: true });
        } catch (err) {
            // Try to map RFC 9110 style validation response to form fields
            const e = err as unknown as { response?: { data?: ValidationResponse }; message?: string };
            const data = e?.response?.data;
            if (data && data.errors && typeof data.errors === "object") {
                const fields = Object.entries(data.errors).map(([backendKey, messages]) => {
                    const name = FIELD_MAP[backendKey] ?? backendKey;
                    const errs: string[] = Array.isArray(messages) ? messages.map(String) : [String(messages)];
                    return {
                        name: [name],
                        errors: errs,
                    } as Parameters<FormInstance['setFields']>[0][0];
                });
                // Set errors on the form so they show inline
                form.setFields(fields as Parameters<FormInstance['setFields']>[0]);
                return;
            }

            const msg = data?.message ?? e?.message ?? "Registration failed";
            message.error(String(msg));
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
            <Card className="w-full max-w-md shadow-lg">
                <div className="text-center mb-6">
                    <Title level={3}>Create your account</Title>
                </div>
                <RegisterForm form={form} onFinish={(v) => onRegister(v as Record<string, unknown>)} />
            </Card>
        </div>
    );
};

export default RegisterPage;
