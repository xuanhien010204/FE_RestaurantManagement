import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Badge, Avatar, Dropdown, Space } from "antd";
import { ShoppingCartOutlined, UserOutlined } from "@ant-design/icons";
import { useAuth } from "../context/useAuth";

const Header: React.FC = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (err) {
            console.error('Logout failed', err);
        }
    };

    const topInfo = (
        <div className="bg-red-600 text-white text-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-1">
                <div className="flex items-center space-x-6">
                    <div className="flex items-center gap-2">
                        <span className="hidden sm:inline">⏰</span>
                        <span>9.00 AM - 12.00 PM</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="hidden sm:inline">📞</span>
                        <span>+039 2818 8285</span>
                    </div>
                </div>
                <div>
                    <a href="/register" className="text-white hover:underline text-sm">REGISTER</a>
                </div>
            </div>
        </div>
    );

    return (
        <header>
            {topInfo}
            <div className="bg-amber-50 border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        {/* Left: Logo */}
                        <div className="flex items-center gap-4">
                            <Link to="/" className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                                    <span className="text-2xl font-bold text-amber-600">🍽️</span>
                                </div>
                                <span className="text-xl font-bold text-slate-900 hidden sm:inline">Nhà Hàng Thuyền Quán</span>
                            </Link>
                        </div>

                        {/* Center: Nav links */}
                        <nav className="hidden md:flex space-x-8 font-medium text-slate-700">
                            <Link to="/">TRANG CHỦ</Link>
                            <Link to="/about">GIỚI THIỆU</Link>
                            <Link to="/items">MÓN ĂN</Link>
                            <Link to="/contact">LIÊN HỆ</Link>
                        </nav>

                        {/* Right: Delivery / Cart / Login */}
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-3">
                                <Badge count={2} size="small">
                                    <Button shape="circle" size="large" className="bg-slate-100">
                                        <ShoppingCartOutlined />
                                    </Button>
                                </Badge>
                                <div className="text-sm text-slate-700 hidden sm:block">
                                    <div>Giỏ Hàng</div>
                                    <div className="text-xs text-gray-500">{user?.phone}</div>
                                </div>
                            </div>

                            {isAuthenticated ? (
                                <Dropdown
                                    menu={{
                                        items: [
                                            { key: 'profile', label: 'Profile', onClick: () => navigate('/profile') },
                                            { key: 'logout', label: 'Logout', onClick: handleLogout }
                                        ]
                                    }}
                                >
                                    <Button type="text">
                                        <Space>
                                            <Avatar icon={<UserOutlined />} />
                                            <span className="hidden sm:inline">{user?.fullName ?? 'User'}</span>
                                        </Space>
                                    </Button>
                                </Dropdown>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Button className="bg-red-600" type="primary" onClick={() => navigate('/login')}>ĐĂNG NHẬP</Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
