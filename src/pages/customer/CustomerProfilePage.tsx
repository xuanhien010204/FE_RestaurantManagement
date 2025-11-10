import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Typography, message, Space, Divider, Avatar } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined, EditOutlined, SaveOutlined } from '@ant-design/icons';
import { useAppSelector } from '../../redux/app/hook';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

interface ProfileFormData {
    fullName: string;
    email: string;
    phone: string;
    address: string;
}

interface PasswordFormData {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

const CustomerProfilePage: React.FC = () => {
    const [profileForm] = Form.useForm<ProfileFormData>();
    const [passwordForm] = Form.useForm<PasswordFormData>();
    const [isEditing, setIsEditing] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const { user } = useAppSelector(state => state.auth);

    useEffect(() => {
        if (user) {
            profileForm.setFieldsValue({
                fullName: user.fullName || '',
                email: user.email,
                phone: user.phone || '',
                address: user.address || '',
            });
        }
    }, [user, profileForm]);

    const handleProfileUpdate = async (values: ProfileFormData) => {
        if (!user?.id) return;

        setLoading(true);
        try {
            // This would normally call the API to update profile
            message.info('Profile update functionality would be implemented here');
            console.log('Updating profile for user:', user.id, values);

            message.success('Profile updated successfully');
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating profile:', error);
            message.error('Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async (values: PasswordFormData) => {
        if (!user?.id) return;

        if (values.newPassword !== values.confirmPassword) {
            message.error('New passwords do not match');
            return;
        }

        setLoading(true);
        try {
            // This would normally call the API to change password
            message.info('Password change functionality would be implemented here');
            console.log('Changing password for user:', user.id);

            message.success('Password changed successfully');
            setIsChangingPassword(false);
            passwordForm.resetFields();
        } catch (error) {
            console.error('Error changing password:', error);
            message.error('Failed to change password');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        if (user) {
            profileForm.setFieldsValue({
                fullName: user.fullName || '',
                email: user.email,
                phone: user.phone || '',
                address: user.address || '',
            });
        }
    };

    const handleCancelPasswordChange = () => {
        setIsChangingPassword(false);
        passwordForm.resetFields();
    };

    if (!user) {
        return (
            <div className="p-6">
                <Title level={2}>Profile</Title>
                <Text type="secondary">Please log in to view your profile.</Text>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="mb-8 text-center">
                    <Title level={2} className="!mb-2 !text-3xl">Thông tin tài khoản</Title>
                    <Text type="secondary" className="text-lg">Quản lý thông tin cá nhân và bảo mật của bạn</Text>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Profile Card */}
                    <div className="lg:col-span-1">
                        <Card className="shadow-md hover:shadow-lg transition-shadow">
                            <div className="text-center">
                                <div className="relative inline-block">
                                    <Avatar 
                                        size={120} 
                                        icon={<UserOutlined />} 
                                        className="bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg"
                                    />
                                    {!isEditing && (
                                        <Button
                                            type="primary"
                                            shape="circle"
                                            icon={<EditOutlined />}
                                            size="small"
                                            className="absolute bottom-0 right-0 shadow-md"
                                            onClick={() => setIsEditing(true)}
                                        />
                                    )}
                                </div>
                                <Title level={3} className="!mt-4 !mb-1">{user.fullName}</Title>
                                <Text type="secondary" className="block text-lg">{user.email}</Text>
                                <div className="mt-4 pt-4 border-t">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="text-center">
                                            <Text type="secondary">Trạng thái</Text>
                                            <div className="font-medium text-green-600">Active</div>
                                        </div>
                                        <div className="text-center">
                                            <Text type="secondary">Vai trò</Text>
                                            <div className="font-medium">{user.role}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Account Information Card */}
                        <Card title="Thông tin tài khoản" className="mt-6 shadow-md">
                            <div className="space-y-4">
                                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                    <Text strong>Mã người dùng:</Text>
                                    <Text className="text-gray-600">#{user.id}</Text>
                                </div>
                                <div className="flex justify-between items-center p-2">
                                    <Text strong>Ngày tham gia:</Text>
                                    <Text className="text-gray-600">{dayjs(user.createdAt || new Date()).format('DD/MM/YYYY')}</Text>
                                </div>
                                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                    <Text strong>Trạng thái:</Text>
                                    <Text className="text-green-600 font-medium">Active</Text>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Right Column - Forms */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Profile Form Card */}
                        <Card 
                            title={
                                <div className="flex items-center space-x-2">
                                    <UserOutlined className="text-blue-500" />
                                    <span>Chỉnh sửa thông tin</span>
                                </div>
                            }
                            className="shadow-md"
                        >
                            <Form
                                form={profileForm}
                                layout="vertical"
                                onFinish={handleProfileUpdate}
                                disabled={!isEditing}
                                className="max-w-2xl"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Form.Item
                                        label="Họ và tên"
                                        name="fullName"
                                        rules={[
                                            { required: true, message: 'Vui lòng nhập họ tên' },
                                        ]}
                                    >
                                        <Input 
                                            prefix={<UserOutlined className="text-gray-400" />} 
                                            placeholder="Nhập họ tên"
                                            className="rounded-lg" 
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        label="Email"
                                        name="email"
                                        rules={[
                                            { required: true, message: 'Vui lòng nhập email' },
                                            { type: 'email', message: 'Email không hợp lệ' },
                                        ]}
                                    >
                                        <Input 
                                            prefix={<MailOutlined className="text-gray-400" />} 
                                            placeholder="Nhập email"
                                            className="rounded-lg"
                                        />
                                    </Form.Item>
                                </div>

                                <Form.Item
                                    label="Số điện thoại"
                                    name="phone"
                                    rules={[
                                        { pattern: /^[0-9+\-\s()]+$/, message: 'Số điện thoại không hợp lệ' },
                                    ]}
                                >
                                    <Input 
                                        placeholder="Nhập số điện thoại" 
                                        className="rounded-lg"
                                    />
                                </Form.Item>

                                <Form.Item
                                    label="Địa chỉ"
                                    name="address"
                                >
                                    <Input.TextArea 
                                        placeholder="Nhập địa chỉ" 
                                        rows={3}
                                        className="rounded-lg"
                                    />
                                </Form.Item>

                                {isEditing && (
                                    <Form.Item>
                                        <Space className="w-full justify-end">
                                            <Button onClick={handleCancelEdit}>
                                                Hủy
                                            </Button>
                                            <Button
                                                type="primary"
                                                htmlType="submit"
                                                loading={loading}
                                                icon={<SaveOutlined />}
                                                className="bg-blue-500"
                                            >
                                                Lưu thay đổi
                                            </Button>
                                        </Space>
                                    </Form.Item>
                                )}
                            </Form>
                        </Card>

                        {/* Password Change Card */}
                        <Card 
                            title={
                                <div className="flex items-center space-x-2">
                                    <LockOutlined className="text-blue-500" />
                                    <span>Bảo mật</span>
                                </div>
                            }
                            className="shadow-md"
                        >
                            {!isChangingPassword ? (
                                <div className="space-y-4">
                                    <div className="bg-blue-50 p-4 rounded-lg">
                                        <Text className="text-blue-800">
                                            Bảo vệ tài khoản của bạn bằng mật khẩu mạnh và thay đổi định kỳ.
                                        </Text>
                                    </div>
                                    <Divider className="my-4" />
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <Text strong className="block mb-1">Thay đổi mật khẩu lần cuối:</Text>
                                            <Text type="secondary">Chưa có thông tin</Text>
                                        </div>
                                        <Button
                                            type="primary"
                                            icon={<LockOutlined />}
                                            onClick={() => setIsChangingPassword(true)}
                                            className="bg-blue-500"
                                        >
                                            Đổi mật khẩu
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <Form
                                    form={passwordForm}
                                    layout="vertical"
                                    onFinish={handlePasswordChange}
                                    className="max-w-2xl"
                                >
                                    <Form.Item
                                        label="Mật khẩu hiện tại"
                                        name="currentPassword"
                                        rules={[
                                            { required: true, message: 'Vui lòng nhập mật khẩu hiện tại' },
                                        ]}
                                    >
                                        <Input.Password 
                                            prefix={<LockOutlined className="text-gray-400" />}
                                            placeholder="Nhập mật khẩu hiện tại"
                                            className="rounded-lg"
                                        />
                                    </Form.Item>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <Form.Item
                                            label="Mật khẩu mới"
                                            name="newPassword"
                                            rules={[
                                                { required: true, message: 'Vui lòng nhập mật khẩu mới' },
                                                { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' },
                                            ]}
                                        >
                                            <Input.Password 
                                                prefix={<LockOutlined className="text-gray-400" />}
                                                placeholder="Nhập mật khẩu mới"
                                                className="rounded-lg"
                                            />
                                        </Form.Item>

                                        <Form.Item
                                            label="Xác nhận mật khẩu mới"
                                            name="confirmPassword"
                                            rules={[
                                                { required: true, message: 'Vui lòng xác nhận mật khẩu mới' },
                                                ({ getFieldValue }) => ({
                                                    validator(_, value) {
                                                        if (!value || getFieldValue('newPassword') === value) {
                                                            return Promise.resolve();
                                                        }
                                                        return Promise.reject(new Error('Mật khẩu không khớp'));
                                                    },
                                                }),
                                            ]}
                                        >
                                            <Input.Password 
                                                prefix={<LockOutlined className="text-gray-400" />}
                                                placeholder="Xác nhận mật khẩu mới"
                                                className="rounded-lg"
                                            />
                                        </Form.Item>
                                    </div>

                                    <Form.Item>
                                        <Space className="w-full justify-end">
                                            <Button onClick={handleCancelPasswordChange}>
                                                Hủy
                                            </Button>
                                            <Button
                                                type="primary"
                                                htmlType="submit"
                                                loading={loading}
                                                icon={<SaveOutlined />}
                                                className="bg-blue-500"
                                            >
                                                Cập nhật mật khẩu
                                            </Button>
                                        </Space>
                                    </Form.Item>
                                </Form>
                            )}
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerProfilePage;