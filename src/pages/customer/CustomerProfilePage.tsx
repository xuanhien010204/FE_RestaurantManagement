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
        <div className="p-6">
            <Title level={2}>My Profile</Title>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Profile Information Card */}
                <Card
                    title={
                        <div className="flex items-center justify-between">
                            <span>Profile Information</span>
                            {!isEditing && (
                                <Button
                                    type="text"
                                    icon={<EditOutlined />}
                                    onClick={() => setIsEditing(true)}
                                >
                                    Edit
                                </Button>
                            )}
                        </div>
                    }
                >
                    <div className="mb-6 text-center">
                        <Avatar size={80} icon={<UserOutlined />} />
                        <div className="mt-2">
                            <Title level={4}>{user.fullName}</Title>
                            <Text type="secondary">{user.email}</Text>
                        </div>
                    </div>

                    <Form
                        form={profileForm}
                        layout="vertical"
                        onFinish={handleProfileUpdate}
                        disabled={!isEditing}
                    >
                        <Form.Item
                            label="Full Name"
                            name="fullName"
                            rules={[
                                { required: true, message: 'Please enter your full name' },
                            ]}
                        >
                            <Input prefix={<UserOutlined />} placeholder="Enter full name" />
                        </Form.Item>

                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[
                                { required: true, message: 'Please enter your email' },
                                { type: 'email', message: 'Please enter a valid email' },
                            ]}
                        >
                            <Input prefix={<MailOutlined />} placeholder="Enter email" />
                        </Form.Item>

                        <Form.Item
                            label="Phone Number"
                            name="phone"
                            rules={[
                                { pattern: /^[0-9+\-\s()]+$/, message: 'Please enter a valid phone number' },
                            ]}
                        >
                            <Input placeholder="Enter phone number" />
                        </Form.Item>

                        <Form.Item
                            label="Address"
                            name="address"
                        >
                            <Input.TextArea placeholder="Enter address" rows={3} />
                        </Form.Item>

                        {isEditing && (
                            <Form.Item>
                                <Space>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        loading={loading}
                                        icon={<SaveOutlined />}
                                    >
                                        Save Changes
                                    </Button>
                                    <Button onClick={handleCancelEdit}>
                                        Cancel
                                    </Button>
                                </Space>
                            </Form.Item>
                        )}
                    </Form>
                </Card>

                {/* Account Information & Password Change */}
                <div className="space-y-6">
                    {/* Account Information */}
                    <Card title="Account Information">
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <Text strong>User ID:</Text>
                                <Text>#{user.id}</Text>
                            </div>
                            <div className="flex justify-between">
                                <Text strong>Role:</Text>
                                <Text>{user.role}</Text>
                            </div>
                            <div className="flex justify-between">
                                <Text strong>Account Status:</Text>
                                <Text type="success">Active</Text>
                            </div>
                            <div className="flex justify-between">
                                <Text strong>Member Since:</Text>
                                <Text>{dayjs(user.createdAt || new Date()).format('MMM DD, YYYY')}</Text>
                            </div>
                        </div>
                    </Card>

                    {/* Password Change */}
                    <Card
                        title={
                            <div className="flex items-center justify-between">
                                <span>Security</span>
                                {!isChangingPassword && (
                                    <Button
                                        type="text"
                                        icon={<LockOutlined />}
                                        onClick={() => setIsChangingPassword(true)}
                                    >
                                        Change Password
                                    </Button>
                                )}
                            </div>
                        }
                    >
                        {!isChangingPassword ? (
                            <div>
                                <Text type="secondary">
                                    Keep your account secure by using a strong password and changing it regularly.
                                </Text>
                                <Divider />
                                <Text strong>Last Password Change: </Text>
                                <Text>Unknown</Text>
                            </div>
                        ) : (
                            <Form
                                form={passwordForm}
                                layout="vertical"
                                onFinish={handlePasswordChange}
                            >
                                <Form.Item
                                    label="Current Password"
                                    name="currentPassword"
                                    rules={[
                                        { required: true, message: 'Please enter your current password' },
                                    ]}
                                >
                                    <Input.Password prefix={<LockOutlined />} placeholder="Enter current password" />
                                </Form.Item>

                                <Form.Item
                                    label="New Password"
                                    name="newPassword"
                                    rules={[
                                        { required: true, message: 'Please enter your new password' },
                                        { min: 6, message: 'Password must be at least 6 characters' },
                                    ]}
                                >
                                    <Input.Password prefix={<LockOutlined />} placeholder="Enter new password" />
                                </Form.Item>

                                <Form.Item
                                    label="Confirm New Password"
                                    name="confirmPassword"
                                    rules={[
                                        { required: true, message: 'Please confirm your new password' },
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                if (!value || getFieldValue('newPassword') === value) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(new Error('Passwords do not match'));
                                            },
                                        }),
                                    ]}
                                >
                                    <Input.Password prefix={<LockOutlined />} placeholder="Confirm new password" />
                                </Form.Item>

                                <Form.Item>
                                    <Space>
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            loading={loading}
                                            icon={<SaveOutlined />}
                                        >
                                            Change Password
                                        </Button>
                                        <Button onClick={handleCancelPasswordChange}>
                                            Cancel
                                        </Button>
                                    </Space>
                                </Form.Item>
                            </Form>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default CustomerProfilePage;