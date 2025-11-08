import React, { useState, useEffect } from "react";
import { Row, Col, Card, Button, Typography, Input, Select, Drawer, InputNumber, message, Empty } from "antd";
import {
    ShoppingCartOutlined,
    SearchOutlined,
    MinusOutlined,
    PlusOutlined,
    CloseOutlined
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import * as menuItemService from "../../services/menu-item.service";
import type { MenuItem } from "../../types/MenuItem";

const { Title, Text } = Typography;
const { Option } = Select;

interface CartItem extends MenuItem {
    quantity: number;
}

const PublicHomePage: React.FC = () => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    // State management
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [categories, setCategories] = useState<string[]>([]);

    // Load menu items on mount
    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                console.log('[PublicHomePage] Loading all menu items');
                const items = await menuItemService.getAllMenuItems();
                setMenuItems(items);

                // Extract unique categories
                const cats = Array.from(new Set(items.map(item => item.category).filter(Boolean))) as string[];
                setCategories(cats);
            } catch (error) {
                console.error('[PublicHomePage] Error loading menu items:', error);
                message.error('Không thể tải thực đơn');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    // Filter items when search or category changes
    useEffect(() => {
        let filtered = menuItems;

        // Filter by category
        if (selectedCategory) {
            filtered = filtered.filter(item => item.category === selectedCategory);
        }

        // Filter by search keyword
        if (searchKeyword) {
            filtered = filtered.filter(item =>
                item.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                item.description?.toLowerCase().includes(searchKeyword.toLowerCase())
            );
        }

        // Only show available items
        filtered = filtered.filter(item => item.status === 'Available');

        setFilteredItems(filtered);
    }, [menuItems, searchKeyword, selectedCategory]);

    const handleAddToCart = (item: MenuItem) => {
        const existingItem = cartItems.find(ci => ci.id === item.id);

        if (existingItem) {
            // Increase quantity
            setCartItems(cartItems.map(ci =>
                ci.id === item.id ? { ...ci, quantity: ci.quantity + 1 } : ci
            ));
        } else {
            // Add new item
            setCartItems([...cartItems, { ...item, quantity: 1 }]);
        }
        message.success(`${item.name} đã thêm vào giỏ hàng`);
    };

    const handleUpdateQuantity = (itemId: number, quantity: number) => {
        if (quantity <= 0) {
            handleRemoveFromCart(itemId);
        } else {
            setCartItems(cartItems.map(ci =>
                ci.id === itemId ? { ...ci, quantity } : ci
            ));
        }
    };

    const handleRemoveFromCart = (itemId: number) => {
        setCartItems(cartItems.filter(ci => ci.id !== itemId));
    };

    const handleCheckout = () => {
        if (!isAuthenticated) {
            message.info('Vui lòng đăng nhập để đặt hàng');
            navigate('/login');
            return;
        }

        if (cartItems.length === 0) {
            message.warning('Giỏ hàng trống');
            return;
        }

        // Navigate to order page with cart data
        navigate('/orders', { state: { cartItems } });
    };

    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white sticky top-0 z-10 shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <Row justify="space-between" align="middle">
                        <Col xs={24} sm={12}>
                            <Title level={2} className="text-white mb-0">
                                🍜 Nhà Hàng Thuyền Quán
                            </Title>
                            <Text className="text-orange-100">Đặt hàng trực tuyến - Giao hàng nhanh chóng</Text>
                        </Col>
                        <Col xs={24} sm={12} className="text-right">
                            <Button
                                type="primary"
                                icon={<ShoppingCartOutlined />}
                                size="large"
                                onClick={() => setCartDrawerOpen(true)}
                                className="bg-white text-orange-600 border-0"
                            >
                                Giỏ hàng ({totalItems})
                            </Button>
                        </Col>
                    </Row>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Search & Filter */}
                <Card className="mb-6">
                    <Row gutter={[16, 16]}>
                        <Col xs={24} sm={12}>
                            <Input
                                placeholder="Tìm kiếm món ăn..."
                                prefix={<SearchOutlined />}
                                value={searchKeyword}
                                onChange={(e) => setSearchKeyword(e.target.value)}
                                size="large"
                            />
                        </Col>
                        <Col xs={24} sm={12}>
                            <Select
                                placeholder="Chọn danh mục"
                                value={selectedCategory || undefined}
                                onChange={setSelectedCategory}
                                allowClear
                                size="large"
                                className="w-full"
                            >
                                {categories.map(cat => (
                                    <Option key={cat} value={cat}>{cat}</Option>
                                ))}
                            </Select>
                        </Col>
                    </Row>
                </Card>

                {/* Menu Items */}
                {loading ? (
                    <div className="text-center py-12">
                        <Text>Đang tải thực đơn...</Text>
                    </div>
                ) : filteredItems.length === 0 ? (
                    <Empty description="Không có món nào phù hợp" />
                ) : (
                    <Row gutter={[16, 16]}>
                        {filteredItems.map(item => (
                            <Col xs={24} sm={12} md={8} lg={6} key={item.id}>
                                <Card
                                    hoverable
                                    className="h-full flex flex-col"
                                    cover={
                                        <div className="bg-gradient-to-r from-orange-400 to-red-500 h-40 flex items-center justify-center text-3xl">
                                            🍲
                                        </div>
                                    }
                                >
                                    <div className="flex-grow">
                                        <Title level={5} className="mb-1">{item.name}</Title>
                                        <Text type="secondary" className="text-xs block mb-2">
                                            {item.category}
                                        </Text>
                                        <Text className="text-sm mb-3 block line-clamp-2">
                                            {item.description}
                                        </Text>
                                    </div>
                                    <div className="flex justify-between items-center pt-3 border-t">
                                        <Text strong className="text-lg text-orange-600">
                                            {item.price.toLocaleString('vi-VN')}đ
                                        </Text>
                                        <Button
                                            type="primary"
                                            size="small"
                                            icon={<PlusOutlined />}
                                            onClick={() => handleAddToCart(item)}
                                        >
                                            Thêm
                                        </Button>
                                    </div>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                )}
            </div>

            {/* Cart Drawer */}
            <Drawer
                title="Giỏ hàng của bạn"
                placement="right"
                onClose={() => setCartDrawerOpen(false)}
                open={cartDrawerOpen}
                width={400}
            >
                {cartItems.length === 0 ? (
                    <Empty description="Giỏ hàng trống" />
                ) : (
                    <div>
                        <div className="space-y-4 mb-6">
                            {cartItems.map(item => (
                                <Card key={item.id} size="small" className="relative">
                                    <Row justify="space-between" align="top">
                                        <Col xs={16}>
                                            <Title level={5} className="mb-1">{item.name}</Title>
                                            <Text type="secondary" className="text-sm">
                                                {item.price.toLocaleString('vi-VN')}đ × {item.quantity}
                                            </Text>
                                        </Col>
                                        <Col xs={8} className="text-right">
                                            <Text strong className="text-orange-600">
                                                {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                                            </Text>
                                        </Col>
                                    </Row>
                                    <Row gutter={8} className="mt-3">
                                        <Col>
                                            <Button
                                                size="small"
                                                icon={<MinusOutlined />}
                                                onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                            />
                                        </Col>
                                        <Col>
                                            <InputNumber
                                                size="small"
                                                value={item.quantity}
                                                onChange={(val) => val && handleUpdateQuantity(item.id, val)}
                                                min={1}
                                                max={100}
                                            />
                                        </Col>
                                        <Col>
                                            <Button
                                                size="small"
                                                icon={<PlusOutlined />}
                                                onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                            />
                                        </Col>
                                        <Col flex="auto" className="text-right">
                                            <Button
                                                size="small"
                                                danger
                                                icon={<CloseOutlined />}
                                                onClick={() => handleRemoveFromCart(item.id)}
                                            />
                                        </Col>
                                    </Row>
                                </Card>
                            ))}
                        </div>

                        {/* Cart Summary */}
                        <Card className="bg-orange-50 border-orange-200">
                            <Row justify="space-between" className="mb-3">
                                <Text>Tổng cộng ({totalItems} món):</Text>
                                <Text strong className="text-lg text-orange-600">
                                    {totalPrice.toLocaleString('vi-VN')}đ
                                </Text>
                            </Row>
                            <Button
                                type="primary"
                                size="large"
                                block
                                onClick={handleCheckout}
                                className="bg-orange-500 border-orange-500"
                            >
                                {isAuthenticated ? 'Thanh toán' : 'Đăng nhập để đặt hàng'}
                            </Button>
                        </Card>
                    </div>
                )}
            </Drawer>
        </div>
    );
};

export default PublicHomePage;