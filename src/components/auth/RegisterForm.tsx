import { Form, Input, Button } from "antd";
import type { FormInstance } from "antd";
import { LockOutlined, UserOutlined, MailOutlined } from "@ant-design/icons";

const RegisterForm = ({
    onFinish,
    form,
}: {
    onFinish: (values: unknown) => Promise<void> | void;
    form?: FormInstance;
}) => {
    return (
        <Form
            form={form}
            name="register"
            layout="vertical"
            onFinish={onFinish}
            style={{ maxWidth: 400, margin: "0 auto" }}
        >
            <Form.Item
                label="Full Name"
                name="fullName"
                rules={[{ required: true, message: "Please enter your full name!" }]}
            >
                <Input prefix={<UserOutlined />} placeholder="Nguyen Van A" />
            </Form.Item>

            <Form.Item
                label="Phone"
                name="phone"
                rules={[
                    { required: false },
                    { pattern: /^\+?[0-9\s-]{7,15}$/, message: "Invalid phone number" },
                ]}
            >
                <Input placeholder="e.g. +84901234567" />
            </Form.Item>

            <Form.Item
                label="Address"
                name="address"
                rules={[{ required: false }]}
            >
                <Input placeholder="Street, City, Country" />
            </Form.Item>

            <Form.Item
                label="Email"
                name="email"
                rules={[
                    { required: true, message: "Please enter your email!" },
                    { type: "email", message: "Invalid email format!" },
                ]}
            >
                <Input prefix={<MailOutlined />} placeholder="abc@gmail.com" />
            </Form.Item>

            <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: "Please enter your password!" }]}
                hasFeedback
            >
                <Input.Password prefix={<LockOutlined />} placeholder="********" />
            </Form.Item>

            <Form.Item
                label="Confirm Password"
                name="confirmPassword"
                dependencies={["password"]}
                hasFeedback
                rules={[
                    { required: true, message: "Please confirm your password!" },
                    ({ getFieldValue }) => ({
                        validator(_, value) {
                            if (!value || getFieldValue("password") === value) {
                                return Promise.resolve();
                            }
                            return Promise.reject(new Error("Passwords do not match!"));
                        },
                    }),
                ]}
            >
                <Input.Password prefix={<LockOutlined />} placeholder="********" />
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit" block>
                    Register
                </Button>
            </Form.Item>
        </Form>
    );
};

export default RegisterForm;
