import React, { useEffect, useState } from "react";
import { Row, Col, Card, Button, Typography, Input, Select, message, Empty, Spin } from "antd";
import { SearchOutlined, PlusOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons";
import * as menuItemService from "../../services/menu-item.service";
import { useCart } from "../../context/CartContext";
import type { MenuItem } from "../../types/MenuItem";

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

interface MenuItemCardProps {
    item: MenuItem;
    currentIndex: number;
    onPrev: () => void;
    onNext: () => void;
    onAdd: (item: MenuItem) => void;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, currentIndex, onPrev, onNext, onAdd }) => {
    const images = item.images || [];
    return (
        <Card hoverable className="h-full flex flex-col shadow-md hover:shadow-lg transition-shadow">
            <div className="relative h-48">
                {images.length > 0 ? (
                    <>
                        <img
                            src={images[currentIndex]?.imageUrl || ""}
                            alt={item.name}
                            className="h-48 w-full object-cover"
                            loading="lazy"
                        />
                        {images.length > 1 && (
                            <>
                                <Button
                                    type="primary"
                                    size="small"
                                    shape="circle"
                                    icon={<LeftOutlined />}
                                    className="absolute top-1/2 left-2 transform -translate-y-1/2 opacity-70 hover:opacity-100"
                                    onClick={onPrev}
                                />
                                <Button
                                    type="primary"
                                    size="small"
                                    shape="circle"
                                    icon={<RightOutlined />}
                                    className="absolute top-1/2 right-2 transform -translate-y-1/2 opacity-70 hover:opacity-100"
                                    onClick={onNext}
                                />
                            </>
                        )}
                    </>
                ) : (
                    <div className="bg-gradient-to-r from-orange-400 to-red-500 h-48 flex items-center justify-center text-3xl">
                        🍲
                    </div>
                )}
            </div>

            <div className="flex-grow p-4">
                <Title level={5} className="mb-1 text-lg font-medium">{item.name}</Title>
                <Text type="secondary" className="text-xs block mb-2">{item.category || "Chưa phân loại"}</Text>
                <Paragraph className="text-sm mb-3 line-clamp-2 text-gray-600">{item.description}</Paragraph>
            </div>

            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-b-lg">
                <Text strong className="text-lg text-orange-600">{item.price.toLocaleString("vi-VN")}đ</Text>
                <Button 
                    type="primary" 
                    size="middle" 
                    icon={<PlusOutlined />} 
                    onClick={() => onAdd(item)}
                    className="hover:scale-105 transition-transform"
                >
                    Thêm
                </Button>
            </div>
        </Card>
    );
};

const CustomerHomePage: React.FC = () => {
    const { addItem } = useCart();
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [categories, setCategories] = useState<string[]>([]);
    const [imageIndexes, setImageIndexes] = useState<Record<number, number>>({});

    useEffect(() => {
        const loadItems = async () => {
            setLoading(true);
            try {
                const items = await menuItemService.getAllMenuItems();
                // Load images for items
                const itemsWithImages = await Promise.all(
                    items.map(async item => {
                        if (!item.images || item.images.length === 0) {
                            try {
                                const images = await menuItemService.getMenuItemImageByMenuItemId(item.id);
                                return { ...item, images };
                            } catch {
                                return { ...item, images: [] };
                            }
                        }
                        return item;
                    })
                );

                // Extract unique categories
                const allCategories = Array.from(new Set(
                    itemsWithImages
                        .map(item => item.category)
                        .filter(Boolean) as string[]
                ));
                setCategories(allCategories);

                // Filter available items
                const availableItems = itemsWithImages.filter(i => i.status === "Available");
                setMenuItems(availableItems);
            } catch (err) {
                console.error(err);
                message.error("Không thể tải danh sách món ăn");
            } finally {
                setLoading(false);
            }
        };
        loadItems();
    }, []);

    const handleAddToCart = (item: MenuItem) => {
        addItem(item, true); // mở Drawer khi thêm
        message.success(`${item.name} đã thêm vào giỏ hàng`);
    };

    // Handle image navigation
    const handlePrevImage = (itemId: number, imagesLength: number) => {
        setImageIndexes(prev => ({
            ...prev,
            [itemId]: (prev[itemId] ?? 0) === 0 ? imagesLength - 1 : (prev[itemId] ?? 0) - 1
        }));
    };

    const handleNextImage = (itemId: number, imagesLength: number) => {
        setImageIndexes(prev => ({
            ...prev,
            [itemId]: (prev[itemId] ?? 0) === imagesLength - 1 ? 0 : (prev[itemId] ?? 0) + 1
        }));
    };

    // Filter menu items
    const filteredItems = menuItems.filter(item => {
        const matchesSearch = searchKeyword
            ? item.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
              item.description?.toLowerCase().includes(searchKeyword.toLowerCase())
            : true;
        
        const matchesCategory = selectedCategory
            ? item.category === selectedCategory
            : true;

        return matchesSearch && matchesCategory;
    });

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Banner */}
            <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-8 mb-6">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-4xl font-bold mb-2">Xin chào, khách hàng!</h1>
                    <p className="text-orange-100 text-lg">Chào mừng bạn đến với Thuyền Quán 🍜</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Search and Filter Section */}
                <div className="mb-8">
                    <Row gutter={[16, 16]}>
                        <Col xs={24} sm={12}>
                            <Input
                                placeholder="Tìm kiếm món ăn..."
                                prefix={<SearchOutlined className="text-gray-400" />}
                                value={searchKeyword}
                                onChange={e => setSearchKeyword(e.target.value)}
                                size="large"
                                className="w-full"
                            />
                        </Col>
                        <Col xs={24} sm={12}>
                            <Select
                                placeholder="Chọn danh mục"
                                value={selectedCategory || undefined}
                                onChange={value => setSelectedCategory(value || '')}
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
                </div>

                {/* Menu Items Grid */}
                <div className="pb-12">
                    {loading ? (
                        <div className="text-center py-12">
                            <Spin size="large" tip="Đang tải thực đơn..." />
                        </div>
                    ) : filteredItems.length === 0 ? (
                        <Empty
                            description="Không tìm thấy món ăn nào"
                            className="py-12"
                        />
                    ) : (
                        <Row gutter={[16, 24]}>
                            {filteredItems.map(item => {
                                const currentIndex = imageIndexes[item.id] ?? 0;
                                return (
                                    <Col xs={24} sm={12} md={8} lg={6} key={item.id}>
                                        <MenuItemCard
                                            item={item}
                                            currentIndex={currentIndex}
                                            onPrev={() => handlePrevImage(item.id, item.images?.length ?? 0)}
                                            onNext={() => handleNextImage(item.id, item.images?.length ?? 0)}
                                            onAdd={handleAddToCart}
                                        />
                                    </Col>
                                );
                            })}
                        </Row>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CustomerHomePage;
