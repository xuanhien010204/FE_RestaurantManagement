import React from "react";
import { Layout, Menu, Button, Avatar, Dropdown, Space, Badge } from "antd";
import {
    UserOutlined,
    LogoutOutlined,
    SettingOutlined,
    BellOutlined,
    MenuOutlined,
    HomeOutlined,
    CalendarOutlined,
    ShoppingCartOutlined,
    TeamOutlined
} from "@ant-design/icons";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import type { MenuProps } from "antd";

const { Header: AntHeader } = Layout;

const Header: React.FC = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        try {
            await logout();
            navigate("/login");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    // Menu items for authenticated users
    const userMenuItems: MenuProps['items'] = [
        {
            key: 'profile',
            icon: <UserOutlined />,
            label: 'Hồ sơ cá nhân',
            onClick: () => navigate('/profile')
        },
        {
            key: 'settings',
            icon: <SettingOutlined />,
            label: 'Cài đặt',
            onClick: () => navigate('/settings')
        },
        {
            type: 'divider',
        },
        {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: 'Đăng xuất',
            onClick: handleLogout
        }
    ];

    // Main navigation items
    const getNavItems = (): MenuProps['items'] => {
        const publicItems = [
            {
                key: '/',
                icon: <HomeOutlined />,
                label: <Link to="/">Trang chủ</Link>
            }
        ];

        if (!isAuthenticated) {
            return publicItems;
        }

        const authenticatedItems = [
            ...publicItems,
            {
                key: '/reservations',
                icon: <CalendarOutlined />,
                label: <Link to="/reservations">Đặt bàn</Link>
            },
            {
                key: '/orders',
                icon: <ShoppingCartOutlined />,
                label: <Link to="/orders">Đơn hàng</Link>
            }
        ];

        // Add admin/staff items based on role
        if (user?.role === 'Admin') {
            authenticatedItems.push({
                key: '/admin',
                icon: <TeamOutlined />,
                label: <Link to="/admin">Quản trị</Link>
            });
        }

        if (user?.role === 'Admin' || user?.role === 'Staff') {
            authenticatedItems.push({
                key: '/staff',
                icon: <TeamOutlined />,
                label: <Link to="/staff">Nhân viên</Link>
            });
        }

        return authenticatedItems;
    };

    return (
        <AntHeader className="bg-white shadow-sm border-b border-gray-200 px-0">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-lg">R</span>
                            </div>
                            <span className="text-xl font-bold text-gray-900 hidden sm:block">
                                Restaurant ABC
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:block">
                        <Menu
                            mode="horizontal"
                            selectedKeys={[location.pathname]}
                            items={getNavItems()}
                            className="border-none bg-transparent"
                        />
                    </div>

                    {/* Right Section */}
                    <div className="flex items-center space-x-4">
                        {/* Notifications (for authenticated users) */}
                        {isAuthenticated && (
                            <Badge count={0} size="small">
                                <Button
                                    type="text"
                                    icon={<BellOutlined />}
                                    size="large"
                                    className="text-gray-600 hover:text-gray-900"
                                />
                            </Badge>
                        )}

                        {/* User Section */}
                        {isAuthenticated ? (
                            <Dropdown
                                menu={{ items: userMenuItems }}
                                placement="bottomRight"
                                trigger={['click']}
                            >
                                <Button type="text" className="h-auto p-2">
                                    <Space>
                                        <Avatar
                                            size="small"
                                            icon={<UserOutlined />}
                                            className="bg-blue-500"
                                        />
                                        <span className="hidden sm:inline text-gray-700">
                                            {user?.fullName || 'User'}
                                        </span>
                                    </Space>
                                </Button>
                            </Dropdown>
                        ) : (
                            <Space>
                                <Button type="text">
                                    <Link to="/login">Đăng nhập</Link>
                                </Button>
                                <Button type="primary">
                                    <Link to="/register">Đăng ký</Link>
                                </Button>
                            </Space>
                        )}

                        {/* Mobile Menu Toggle */}
                        <div className="md:hidden">
                            <Button
                                type="text"
                                icon={<MenuOutlined />}
                                size="large"
                                className="text-gray-600 hover:text-gray-900"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AntHeader>
    );
};

export default Header;
