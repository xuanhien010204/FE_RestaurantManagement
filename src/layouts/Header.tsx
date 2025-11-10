import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Badge, Avatar, Dropdown, Space, Drawer, message, Input } from "antd";
import { useAppDispatch, useAppSelector } from "../redux/app/hook";
import { logout } from "../redux/slices/authSlice";
import { useCart } from "../context/CartContext";
import * as promotionService from '../services/promotion.service';

// React Icons
import { FiShoppingCart, FiUser, FiPhone, FiClock, FiX, FiTrash2 } from "react-icons/fi";

// const { Text } = Typography;

const Header: React.FC = () => {
    const dispatch = useAppDispatch();
    const authState = useAppSelector(state => state.auth);
    const { user, token } = authState as { user: { fullName: string; role: string } | null; token: string | null };
    const isAuthenticated = !!token && !!user;
    const navigate = useNavigate();

    const { items: cartItems, totalItems, totalPrice, drawerOpen, openDrawer, closeDrawer, updateQuantity, removeItem, shippingFee, appliedPromotion, discountAmount, applyPromotion, removePromotion, taxRate, taxAmount, grandTotal } = useCart();

    // Currency helper and totals
    const formatVND = (value: number) => value.toLocaleString('vi-VN') + 'đ';
    const subtotal = totalPrice; // subtotal from cart

    const [promoCode, setPromoCode] = useState('');
    const [suggestions, setSuggestions] = useState<Array<{ id: number; code: string; description?: string; discount: number }>>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const suggestTimer = useRef<number | null>(null);

    const handleApplyPromo = async () => {
        if (!promoCode.trim()) return message.warning('Vui lòng nhập mã giảm giá');
        try {
            await applyPromotion(promoCode.trim());
            message.success('Áp dụng mã giảm giá thành công');
        } catch (err: any) {
            const errMsg = err?.message ?? 'Không thể áp dụng mã';
            message.error(errMsg);
        }
    };

    const fetchSuggestions = async (keyword: string) => {
        if (!keyword || keyword.length < 2) {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }
        try {
            const results = await promotionService.searchPromotions(keyword);
            // service returns Promotion[]
            setSuggestions(results.map(r => ({ id: r.id, code: r.code, description: r.description, discount: r.discount })));
            setShowSuggestions(true);
        } catch {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    useEffect(() => {
        // cleanup on unmount
        return () => {
            if (suggestTimer.current) window.clearTimeout(suggestTimer.current);
        };
    }, []);

    const onPromoInputChange = (value: string) => {
        setPromoCode(value);
        if (suggestTimer.current) window.clearTimeout(suggestTimer.current);
        // debounce
        suggestTimer.current = window.setTimeout(() => {
            fetchSuggestions(value.trim());
        }, 300) as unknown as number;
    };

    const handleRemovePromo = () => {
        removePromotion();
        setPromoCode('');
        message.info('Đã bỏ mã giảm giá');
    };

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

            {/* Drawer giỏ hàng (custom modern sidebar) */}
            <Drawer
                placement="right"
                onClose={closeDrawer}
                open={drawerOpen}
                width={420}
                closable={false}
                bodyStyle={{ padding: 0 }}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gray-100 rounded">
                                <FiShoppingCart className="text-xl text-orange-500" />
                            </div>
                            <div>
                                <div className="text-lg font-semibold">Giỏ hàng</div>
                                <div className="text-sm text-gray-500">{totalItems} sản phẩm</div>
                            </div>
                        </div>

                        <button onClick={closeDrawer} aria-label="Đóng" className="p-2 text-gray-600 hover:bg-gray-100 rounded">
                            <FiX />
                        </button>
                    </div>

                    <div className="border-b" />

                    {/* Item list (scrollable) */}
                    <div className="p-4 flex-1 overflow-y-auto">
                        {cartItems.length === 0 ? (
                            <div className="text-center text-gray-500">Giỏ hàng trống</div>
                        ) : (
                            cartItems.map(item => (
                                <div key={item.id} className="flex items-start gap-3 py-3 border-b last:border-b-0">
                                    {/* Thumbnail */}
                                    {item.images && item.images.length > 0 ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={item.images[0].imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded" />
                                    ) : (
                                        <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center text-sm text-gray-400">No image</div>
                                    )}

                                    {/* Info & quantity */}
                                    <div className="flex-1">
                                        <div className="font-medium">{item.name}</div>
                                        <div className="text-sm text-gray-600">{item.price.toLocaleString('vi-VN')}đ</div>

                                        <div className="mt-3 inline-flex items-center border rounded overflow-hidden">
                                            <button
                                                aria-label={`Giảm ${item.name}`}
                                                className="px-3 py-1 hover:bg-gray-100"
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            >
                                                -
                                            </button>
                                            <div className="px-4 bg-white">{item.quantity}</div>
                                            <button
                                                aria-label={`Tăng ${item.name}`}
                                                className="px-3 py-1 hover:bg-gray-100"
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>

                                    {/* Delete */}
                                    <button onClick={() => removeItem(item.id)} aria-label="Xóa" className="p-2 text-gray-500 hover:text-red-600">
                                        <FiTrash2 />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Promo input (above summary) */}
                    <div className="px-4 pb-4">
                        {appliedPromotion ? (
                            <div className="flex items-center justify-between bg-gray-50 p-3 rounded">
                                <div>
                                    <div className="text-sm font-medium">Đã áp mã</div>
                                    <div className="text-sm text-gray-600">{appliedPromotion.code} - {appliedPromotion.discount}%</div>
                                </div>
                                <button onClick={handleRemovePromo} className="text-sm text-red-600">Bỏ</button>
                            </div>
                        ) : (
                            <div className="relative w-full">
                                <div className="flex gap-2">
                                    <Input value={promoCode} onChange={e => onPromoInputChange(e.target.value)} placeholder="Mã giảm giá" />
                                    <Button type="primary" onClick={handleApplyPromo}>Áp dụng</Button>
                                </div>

                                {showSuggestions && suggestions.length > 0 && (
                                    <div className="absolute z-50 left-0 right-0 mt-1 bg-white border rounded shadow-md max-h-40 overflow-auto">
                                        {suggestions.map(s => (
                                            <div key={s.id} className="p-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between" onClick={() => { setPromoCode(s.code); setShowSuggestions(false); }}>
                                                <div>
                                                    <div className="font-medium">{s.code}</div>
                                                    {s.description && <div className="text-xs text-gray-500">{s.description}</div>}
                                                </div>
                                                <div className="text-sm text-green-600">-{s.discount}%</div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Summary & footer (fixed) */}
                    <div className="border-t p-4 bg-white">
                        <div className="flex justify-between mb-2">
                            <div className="text-sm text-gray-600">Tạm tính</div>
                            <div>{formatVND(subtotal)}</div>
                        </div>

                        <div className="flex justify-between mb-2">
                            <div className="text-sm text-gray-600">Phí vận chuyển</div>
                            <div>{formatVND(shippingFee)}</div>
                        </div>

                        <div className="flex justify-between mb-2">
                            <div className="text-sm text-gray-600">Phí (VAT {Math.round(taxRate * 100)}%)</div>
                            <div>{formatVND(taxAmount)}</div>
                        </div>

                        <div className="flex justify-between mb-4">
                            <div className="text-sm text-gray-600">Giảm giá</div>
                            <div className="text-sm">-{formatVND(discountAmount)}</div>
                        </div>

                        <div className="flex justify-between items-center mb-4">
                            <div className="text-lg font-semibold">Tổng cộng</div>
                            <div className="text-lg font-bold">{formatVND(grandTotal)}</div>
                        </div>

                        <button
                            onClick={handleCheckout}
                            className="w-full bg-slate-900 text-white py-3 rounded-lg hover:opacity-95"
                        >
                            {isAuthenticated ? 'Thanh toán' : 'Đăng nhập để đặt hàng'}
                        </button>
                    </div>
                </div>
            </Drawer>
        </header>
    );
};

export default Header;
