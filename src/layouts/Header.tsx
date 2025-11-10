import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Badge, Avatar, Dropdown, Space } from "antd";
import { useAppDispatch, useAppSelector } from "../redux/app/hook";
import { logout } from "../redux/slices/authSlice";
import { useCart } from "../context/CartContext";
import {
    FiShoppingCart,
    FiUser,
    FiPhone,
    FiClock,
} from "react-icons/fi";
import banner from "../../public/images/banner.png"
import logo from "../../public/images/logo.png"
const Header: React.FC = () => {
    const dispatch = useAppDispatch();
    const authState = useAppSelector((state) => state.auth);
    const { user, token } = authState as {
        user: { fullName: string; role: string } | null;
        token: string | null;
    };
    const isAuthenticated = !!token && !!user;
    const navigate = useNavigate();

    const { totalItems, openDrawer } = useCart();

    const handleLogout = () => {
        dispatch(logout());
        navigate("/login");
    };

    return (
        <header className="shadow-md font-sans">
            {/* Thanh thông tin trên cùng */}
            <div className="bg-red-600 text-white text-xs">
                <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-1">
                    <div className="flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-1">
                            <FiClock /> 7:30 AM - 9:30 PM
                        </div>
                        <div className="flex items-center gap-1">
                            <FiPhone /> +880 1630 225 015
                        </div>
                    </div>
                    {!isAuthenticated && (
                        <Link
                            to="/register"
                            className="uppercase font-semibold tracking-wide"
                        >
                            REGISTER
                        </Link>
                    )}
                </div>
            </div>

            {/* Navbar chính */}
            <div className="bg-[#FFF8F3] border-b border-gray-200">
                <div className="max-w-7xl mx-auto flex items-center justify-between px-4 h-32">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3">
                        <img
                            src={logo}
                            alt="Logo"
                            className="w-24 h-24 rounded-full"
                        />
                        <span className="text-lg font-bold text-slate-900 hidden sm:inline">
                            Thuyền Quán
                        </span>
                    </Link>

                    {/* Menu giữa */}
                    <nav className="hidden md:flex gap-8 font-semibold text-slate-700">
                        <Link to="/">HOME</Link>
                        <Link to="/about">ABOUT</Link>
                        <Link to="/contact">CONTACT</Link>
                    </nav>

                    {/* Bên phải */}
                    <div className="flex items-center gap-4">
                        {/* Giỏ hàng */}
                        <Badge count={totalItems} size="small">
                            <Button
                                shape="circle"
                                size="large"
                                className="bg-slate-100"
                                onClick={openDrawer}
                            >
                                <FiShoppingCart className="text-lg" />
                            </Button>
                        </Badge>

                        {/* Đăng nhập / người dùng */}
                        {isAuthenticated ? (
                            <Dropdown
                                menu={{
                                    items: [
                                        {
                                            key: "profile",
                                            label: "Thông tin cá nhân",
                                            onClick: () => navigate("/customer/profile"),
                                        },
                                        { type: "divider" as const },
                                        { key: "logout", label: "Đăng xuất", onClick: handleLogout },
                                    ],
                                }}
                            >
                                <Button type="text">
                                    <Space>
                                        <Avatar icon={<FiUser />} />
                                        <span className="hidden sm:inline">
                                            {user?.fullName ?? "User"}
                                        </span>
                                    </Space>
                                </Button>
                            </Dropdown>
                        ) : (
                            <Button
                                className="bg-red-600 font-semibold"
                                type="primary"
                                onClick={() => navigate("/login")}
                            >
                                LOGIN
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {/* Banner giống hình */}
            <div
                className="relative h-64 bg-cover bg-center flex flex-col justify-center items-center text-white"
                style={{
                    backgroundImage: `url(${banner})`,
                }}
            >
            </div>
        </header>
    );
};

export default Header;
