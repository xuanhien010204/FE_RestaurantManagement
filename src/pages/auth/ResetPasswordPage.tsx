import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Alert, Typography, Space, Progress } from 'antd';
import { LockOutlined, ArrowLeftOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { Link, useParams, useNavigate } from 'react-router-dom';
import * as authService from '../../services/auth.service';

const { Title, Text } = Typography;

const ResetPasswordPage: React.FC = () => {
    const { token: tokenParam } = useParams<{ token: string }>();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string>('');
    const [token, setToken] = useState<string>('');
    const [passwordStrength, setPasswordStrength] = useState(0);

    useEffect(() => {
        if (!tokenParam) {
            setError('Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.');
        } else {
            setToken(tokenParam);
        }
    }, [tokenParam]);

    const calculatePasswordStrength = (password: string): number => {
        let strength = 0;
        if (password.length >= 6) strength += 25;
        if (password.length >= 8) strength += 25;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25;
        if (/\d/.test(password)) strength += 15;
        if (/[^a-zA-Z0-9]/.test(password)) strength += 10;
        return Math.min(strength, 100);
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const password = e.target.value;
        setPasswordStrength(calculatePasswordStrength(password));
    };

    const getPasswordStrengthColor = () => {
        if (passwordStrength < 40) return '#ff4d4f';
        if (passwordStrength < 70) return '#faad14';
        return '#52c41a';
    };

    const getPasswordStrengthText = () => {
        if (passwordStrength < 40) return 'Yếu';
        if (passwordStrength < 70) return 'Trung bình';
        return 'Mạnh';
    };

    const handleSubmit = async (values: { newPassword: string; confirmPassword: string }) => {
        if (!token) {
            setError('Token không hợp lệ');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await authService.resetPassword({
                newPassword: values.newPassword,
                confirmPassword: values.confirmPassword,
                token: token
            });

            setSuccess(true);

            // Redirect to login after 3 seconds
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err) {
            const errorMessage = (err as { response?: { data?: { message?: string } } }).response?.data?.message || 'Không thể đặt lại mật khẩu. Token có thể đã hết hạn.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    if (!token && !success) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
                <Card className="w-full max-w-md shadow-lg">
                    <div className="text-center">
                        <Alert
                            message="Link Không Hợp Lệ"
                            description="Link đặt lại mật khẩu này không hợp lệ hoặc đã hết hạn. Vui lòng yêu cầu link mới."
                            type="error"
                            showIcon
                            className="mb-4"
                        />
                        <Space direction="vertical" size="middle">
                            <Link to="/forgot-password">
                                <Button type="primary" size="large">
                                    Yêu Cầu Link Mới
                                </Button>
                            </Link>
                            <Link to="/login" className="text-orange-600 hover:text-orange-700">
                                <ArrowLeftOutlined /> Quay lại Đăng nhập
                            </Link>
                        </Space>
                    </div>
                </Card>
            </div>
        );
    }

    if (success) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
                <Card className="w-full max-w-md shadow-lg">
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                            <CheckCircleOutlined className="text-3xl text-green-600" />
                        </div>
                        <Title level={2} className="mb-2">Thành Công!</Title>
                        <Alert
                            message="Mật khẩu đã được đặt lại"
                            description="Mật khẩu của bạn đã được thay đổi thành công. Bạn sẽ được chuyển đến trang đăng nhập sau 3 giây..."
                            type="success"
                            showIcon
                            className="mb-4"
                        />
                        <Button type="primary" size="large" onClick={() => navigate('/login')}>
                            Đăng Nhập Ngay
                        </Button>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md shadow-lg">
                <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
                        <LockOutlined className="text-3xl text-orange-600" />
                    </div>
                    <Title level={2} className="mb-2">Đặt Lại Mật Khẩu</Title>
                    <Text type="secondary">
                        Nhập mật khẩu mới của bạn
                    </Text>
                </div>

                <Alert
                    message="Lưu ý"
                    description="Link đặt lại mật khẩu chỉ có hiệu lực trong 5 phút và chỉ sử dụng được 1 lần."
                    type="info"
                    showIcon
                    className="mb-4"
                />

                {error && (
                    <Alert
                        message="Lỗi"
                        description={error}
                        type="error"
                        showIcon
                        closable
                        onClose={() => setError('')}
                        className="mb-4"
                    />
                )}

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    autoComplete="off"
                >
                    <Form.Item
                        name="newPassword"
                        label="Mật khẩu mới"
                        rules={[
                            { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
                            { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="Nhập mật khẩu mới"
                            size="large"
                            disabled={loading}
                            onChange={handlePasswordChange}
                        />
                    </Form.Item>

                    {passwordStrength > 0 && (
                        <div className="mb-4">
                            <div className="flex justify-between mb-1">
                                <Text type="secondary" className="text-xs">Độ mạnh mật khẩu:</Text>
                                <Text className="text-xs" style={{ color: getPasswordStrengthColor() }}>
                                    {getPasswordStrengthText()}
                                </Text>
                            </div>
                            <Progress
                                percent={passwordStrength}
                                strokeColor={getPasswordStrengthColor()}
                                showInfo={false}
                                size="small"
                            />
                        </div>
                    )}

                    <Form.Item
                        name="confirmPassword"
                        label="Xác nhận mật khẩu"
                        dependencies={['newPassword']}
                        rules={[
                            { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('newPassword') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="Xác nhận mật khẩu mới"
                            size="large"
                            disabled={loading}
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            size="large"
                            block
                            loading={loading}
                        >
                            {loading ? 'Đang đặt lại...' : 'Đặt Lại Mật Khẩu'}
                        </Button>
                    </Form.Item>
                </Form>

                <div className="text-center mt-4">
                    <Space>
                        <ArrowLeftOutlined />
                        <Link to="/login" className="text-orange-600 hover:text-orange-700">
                            Quay lại Đăng nhập
                        </Link>
                    </Space>
                </div>
            </Card>
        </div>
    );
};

export default ResetPasswordPage;
