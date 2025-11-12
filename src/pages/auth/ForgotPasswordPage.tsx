import React, { useState } from 'react';
import { Card, Form, Input, Button, Alert, Typography, Space } from 'antd';
import { MailOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import * as authService from '../../services/auth.service';

const { Title, Text } = Typography;

const ForgotPasswordPage: React.FC = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string>('');

    const handleSubmit = async (values: { email: string }) => {
        setLoading(true);
        setError('');
        setSuccess(false);

        try {
            await authService.forgotPassword(values.email);
            setSuccess(true);
            form.resetFields();
        } catch (err) {
            const errorMessage = (err as { response?: { data?: { message?: string } } }).response?.data?.message || 'Không thể gửi email đặt lại mật khẩu. Vui lòng thử lại.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md shadow-lg">
                <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
                        <MailOutlined className="text-3xl text-orange-600" />
                    </div>
                    <Title level={2} className="mb-2">Quên Mật Khẩu?</Title>
                    <Text type="secondary">
                        Nhập email của bạn và chúng tôi sẽ gửi link đặt lại mật khẩu
                    </Text>
                </div>

                {success && (
                    <Alert
                        message="Email đã được gửi!"
                        description={
                            <div>
                                <p className="mb-2">Vui lòng kiểm tra email của bạn để nhận link đặt lại mật khẩu.</p>
                                <p className="mb-2"><strong>Lưu ý:</strong> Link chỉ có hiệu lực trong <strong>5 phút</strong> và chỉ sử dụng được <strong>1 lần</strong>.</p>
                                <p className="text-sm">Nếu không thấy email, hãy kiểm tra thư mục spam.</p>
                            </div>
                        }
                        type="success"
                        showIcon
                        className="mb-4"
                    />
                )}

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

                {!success && (
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleSubmit}
                        autoComplete="off"
                    >
                        <Form.Item
                            name="email"
                            label="Email"
                            rules={[
                                { required: true, message: 'Vui lòng nhập email!' },
                                { type: 'email', message: 'Email không hợp lệ!' }
                            ]}
                        >
                            <Input
                                prefix={<MailOutlined />}
                                placeholder="example@email.com"
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
                                {loading ? 'Đang gửi...' : 'Gửi Link Đặt Lại'}
                            </Button>
                        </Form.Item>
                    </Form>
                )}

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

export default ForgotPasswordPage;
