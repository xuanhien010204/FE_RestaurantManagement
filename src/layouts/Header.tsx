import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Badge, Avatar, Dropdown, Space, Drawer, List, InputNumber, Typography, message } from "antd";
import { useAppDispatch, useAppSelector } from "../redux/app/hook";
import { logout } from "../redux/slices/authSlice";
import { useCart } from "../context/CartContext";

// React Icons
import { FiShoppingCart, FiUser, FiPhone, FiClock, FiPlus, FiMinus, FiX } from "react-icons/fi";

const { Text } = Typography;

const Header: React.FC = () => {
    const dispatch = useAppDispatch();
    const authState = useAppSelector(state => state.auth);
    const { user, token } = authState as { user: { fullName: string; role: string } | null; token: string | null };
    const isAuthenticated = !!token && !!user;
    const navigate = useNavigate();

    const { items: cartItems, totalItems, totalPrice, drawerOpen, openDrawer, closeDrawer, updateQuantity, removeItem } = useCart();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const handleCheckout = () => {
        if (!isAuthenticated) {
            message.info("Vui lòng đăng nhập để đặt hàng");
            navigate("/login");
            return;
        }
        if (cartItems.length === 0) {
            message.warning("Giỏ hàng trống");
            return;
        }
        navigate("/orders", { state: { cartItems } });
    };

    return (
        <header className="shadow-md">
            {/* Top strip */}
            <div className="bg-red-600 text-white text-xs">
                <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-1">
                    <div className="flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-1"><FiClock /> 7:30 AM - 9:30 PM</div>
                        <div className="flex items-center gap-1"><FiPhone /> +880 1630 225 015</div>
                    </div>
                    <div>
                        {!isAuthenticated && <Link to="/register" className="uppercase font-semibold tracking-wide">REGISTER</Link>}
                    </div>
                </div>
            </div>

            {/* Main navbar */}
            <div className="bg-[#FFF8F3] border-b border-gray-200">
                <div className="max-w-7xl mx-auto flex items-center justify-between px-4 h-20">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                            <FiShoppingCart className="text-2xl text-orange-500" />
                        </div>
                        <span className="text-lg font-bold text-slate-900 hidden sm:inline">Thuyền Quán</span>
                    </Link>

                    {/* Center nav links */}
                    <nav className="hidden md:flex gap-8 font-semibold text-slate-700">
                        <Link to="/">HOME</Link>
                        {!isAuthenticated && <>
                            <Link to="/about">ABOUT</Link>
                            <Link to="/contact">CONTACT</Link>
                        </>}
                        {isAuthenticated && user?.role === 'Admin' && (
                            <Dropdown menu={{
                                items: [
                                    { key: 'admin-dashboard', label: 'Dashboard', onClick: () => navigate('/admin') },
                                    { key: 'admin-menu', label: 'Quản lý thực đơn', onClick: () => navigate('/admin/menu') },
                                ]
                            }}>
                                <a className="cursor-pointer">QUẢN LÝ</a>
                            </Dropdown>
                        )}
                        {isAuthenticated && user?.role === 'Customer' && (
                            <Dropdown menu={{
                                items: [
                                    { key: 'customer-orders', label: 'Đơn hàng của tôi', onClick: () => navigate('/customer/orders') },
                                ]
                            }}>
                                <a className="cursor-pointer">TÀI KHOẢN</a>
                            </Dropdown>
                        )}
                    </nav>

                    {/* Right side: cart & login/logout */}
                    <div className="flex items-center gap-4">
                        <Badge count={totalItems} size="small">
                            <Button shape="circle" size="large" className="bg-slate-100" onClick={openDrawer}>
                                <FiShoppingCart className="text-lg" />
                            </Button>
                        </Badge>

                        {isAuthenticated ? (
                            <Dropdown menu={{
                                items: [
                                    { key: 'profile', label: 'Thông tin cá nhân', onClick: () => navigate('/customer/profile') },
                                    { type: 'divider' as const },
                                    { key: 'logout', label: 'Đăng xuất', onClick: handleLogout }
                                ]
                            }}>
                                <Button type="text">
                                    <Space>
                                        <Avatar icon={<FiUser />} />
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

            {/* Drawer giỏ hàng */}
            <Drawer
                title="Giỏ hàng của bạn"
                placement="right"
                onClose={closeDrawer}
                open={drawerOpen}
                width={400}
            >
                {cartItems.length === 0 ? (
                    <Text>Giỏ hàng trống</Text>
                ) : (
                    <div>
                        <List
                            dataSource={cartItems}
                            renderItem={item => (
                                <List.Item
                                    key={item.id}
                                    actions={[
                                        <Button size="small" icon={<FiMinus />} onClick={() => updateQuantity(item.id, item.quantity - 1)} />,
                                        <InputNumber
                                            size="small"
                                            min={1}
                                            max={100}
                                            value={item.quantity}
                                            onChange={(val) => val && updateQuantity(item.id, val)}
                                        />,
                                        <Button size="small" icon={<FiPlus />} onClick={() => updateQuantity(item.id, item.quantity + 1)} />,
                                        <Button size="small" danger icon={<FiX />} onClick={() => removeItem(item.id)} />
                                    ]}
                                >
                                    <List.Item.Meta
                                        title={item.name}
                                        description={
                                            <div className="flex items-center gap-1">
                                                <span>{item.price.toLocaleString("vi-VN")}đ</span>
                                            </div>
                                        }
                                    />
                                    <Text>{(item.price * item.quantity).toLocaleString("vi-VN")}đ</Text>
                                </List.Item>
                            )}
                        />

                        <div className="mt-4">
                            <Text strong>Tổng cộng ({totalItems} món): {totalPrice.toLocaleString("vi-VN")}đ</Text>
                            <Button
                                type="primary"
                                size="large"
                                block
                                onClick={handleCheckout}
                                className="mt-2 bg-orange-500 border-orange-500"
                            >
                                {isAuthenticated ? "Thanh toán" : "Đăng nhập để đặt hàng"}
                            </Button>
                        </div>
                    </div>
                )}
            </Drawer>
        </header>
    );
};

export default Header;
