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

    return (
        <header>
            {/* Top red strip */}
            <div className="bg-red-600 text-white text-xs">
                <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-1">
                    <div className="flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-2">
                            <span className="inline-block">⏰</span>
                            <span>7:30 AM - 9:30 PM</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="inline-block">📞</span>
                            <span>+880 1630 225 015</span>
                        </div>
                    </div>
                    <div>
                        <Link to="/register" className="uppercase font-semibold tracking-wide">REGISTER</Link>
                    </div>
                </div>
            </div>

            {/* Main navbar */}
            <div className="bg-[#FFF8F3] border-b border-gray-200">
                <div className="max-w-7xl mx-auto flex items-center justify-between px-4 h-20">
                    {/* Left: logo */}
                    <Link to="/" className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                            <span className="text-2xl">🍽️</span>
                        </div>
                        <span className="text-lg font-bold text-slate-900 hidden sm:inline">Thuyền Quán</span>
                    </Link>

                    {/* Center nav links */}
                    <nav className="hidden md:flex gap-8 font-semibold text-slate-700">
                        <Link to="/">HOME</Link>
                        <Link to="/about">ABOUT</Link>
                        <Link to="/items">ITEMS</Link>
                        <Link to="/pages">PAGES</Link>
                        <Link to="/contact">CONTACT</Link>
                    </nav>

                    {/* Right side: cart/delivery/login */}
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3">
                            <Badge count={2} size="small">
                                <Button shape="circle" size="large" className="bg-slate-100">
                                    <ShoppingCartOutlined />
                                </Button>
                            </Badge>
                            <div className="hidden sm:block text-xs text-slate-700">
                                <div className="font-semibold">Delivery Order</div>
                                <div className="text-gray-500">+880 1630 225 015</div>
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
                            <Button className="bg-red-600 font-semibold" type="primary" onClick={() => navigate('/login')}>LOGIN</Button>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
