import React, { useEffect, useState, memo } from "react";
import { Row, Col, Card, Button, Typography, Input, Select, message, Empty, Spin } from "antd";
import { SearchOutlined, PlusOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons";
import { useCart } from "../../context/CartContext";
import * as menuItemService from "../../services/menu-item.service";
import type { MenuItem } from "../../types/MenuItem";

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

interface MenuItemCardProps {
    item: MenuItem;
    currentIndex: number;
    onPrev: () => void;
    onNext: () => void;
    onAdd: () => void;
}

const MenuItemCard = memo<MenuItemCardProps>(({ item, currentIndex, onPrev, onNext, onAdd }) => {
    const images = item.images || [];
    return (
        <Card
            hoverable
            className="h-full flex flex-col"
            cover={
                <div className="relative h-40">
                    {images.length > 0 ? (
                        <>
                            <img
                                src={images[currentIndex]?.imageUrl || ""}
                                alt={item.name}
                                className="h-40 w-full object-cover"
                                loading="lazy"
                            />
                            {images.length > 1 && (
                                <>
                                    <Button
                                        type="primary"
                                        size="small"
                                        shape="circle"
                                        icon={<LeftOutlined />}
                                        className="absolute top-1/2 left-2 transform -translate-y-1/2 opacity-70"
                                        onClick={onPrev}
                                    />
                                    <Button
                                        type="primary"
                                        size="small"
                                        shape="circle"
                                        icon={<RightOutlined />}
                                        className="absolute top-1/2 right-2 transform -translate-y-1/2 opacity-70"
                                        onClick={onNext}
                                    />
                                </>
                            )}
                        </>
                    ) : (
                        <div className="bg-gradient-to-r from-orange-400 to-red-500 h-40 flex items-center justify-center text-3xl">
                            🍲
                        </div>
                    )}
                </div>
            }
        >
            <div className="flex-grow">
                <Title level={5} className="mb-1">{item.name}</Title>
                <Text type="secondary" className="text-xs block mb-1">{item.category || "Chưa có"}</Text>
                <Paragraph className="text-sm mb-2 line-clamp-2">{item.description}</Paragraph>
            </div>
            <div className="flex justify-between items-center pt-3 border-t">
                <Text strong className="text-lg text-orange-600">{item.price.toLocaleString('vi-VN')}đ</Text>
                <Button type="primary" size="small" icon={<PlusOutlined />} onClick={onAdd}>
                    Thêm
                </Button>
            </div>
        </Card>
    );
});

const PublicHomePage: React.FC = () => {
    const { addItem } = useCart();

    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [categories, setCategories] = useState<string[]>([]);
    const [imageIndexes, setImageIndexes] = useState<Record<number, number>>({});
    const [page, setPage] = useState(1);
    const itemsPerPage = 8;
    const [hasMore, setHasMore] = useState(true);

    const loadMenuItems = async (pageNumber: number) => {
        setLoading(true);
        try {
            // Lấy tất cả menu items (hoặc có thể filter search/category nếu backend hỗ trợ)
            const items = await menuItemService.getAllMenuItems();

            // Lazy load ảnh
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

            // Update categories
            const allCats = Array.from(new Set(itemsWithImages.map(i => i.category).filter(Boolean) as string[]));
            setCategories(allCats);

            // Filter + pagination
            const filtered = itemsWithImages
                .filter(i => i.status === 'Available')
                .filter(i => selectedCategory ? i.category === selectedCategory : true)
                .filter(i => searchKeyword
                    ? i.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                    i.description?.toLowerCase().includes(searchKeyword.toLowerCase())
                    : true
                );

            const paged = filtered.slice(0, pageNumber * itemsPerPage);
            setMenuItems(paged);

            // Kiểm tra còn món tiếp theo
            setHasMore(paged.length < filtered.length);
        } catch (err) {
            console.error(err);
            message.error("Không thể tải thực đơn");
        } finally {
            setLoading(false);
        }
    };

    // Load lần đầu + page
    useEffect(() => {
        loadMenuItems(page);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    // Khi search/category thay đổi → reset page
    useEffect(() => {
        setPage(1);
        loadMenuItems(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchKeyword, selectedCategory]);

    const handleAddToCart = (item: MenuItem) => {
        addItem(item, true);
        message.success(`${item.name} đã thêm vào giỏ hàng`);
    };

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

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12}>
                        <Input
                            placeholder="Tìm kiếm món ăn..."
                            prefix={<SearchOutlined />}
                            value={searchKeyword}
                            onChange={e => setSearchKeyword(e.target.value)}
                            size="large"
                        />
                    </Col>
                    <Col xs={24} sm={12}>
                        <Select
                            placeholder="Chọn danh mục"
                            value={selectedCategory || undefined}
                            onChange={val => setSelectedCategory(val || '')}
                            allowClear
                            size="large"
                            className="w-full"
                        >
                            {categories.map(cat => <Option key={cat} value={cat}>{cat}</Option>)}
                        </Select>
                    </Col>
                </Row>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {loading && page === 1 ? (
                    <div className="text-center py-12"><Spin tip="Đang tải thực đơn..." /></div>
                ) : menuItems.length === 0 ? (
                    <Empty description="Không có món nào phù hợp" />
                ) : (
                    <>
                        <Row gutter={[16, 16]}>
                            {menuItems.map(item => {
                                const currentIndex = imageIndexes[item.id] ?? 0;
                                return (
                                    <Col xs={24} sm={12} md={8} lg={6} key={item.id}>
                                        <MenuItemCard
                                            item={item}
                                            currentIndex={currentIndex}
                                            onPrev={() => handlePrevImage(item.id, item.images?.length ?? 0)}
                                            onNext={() => handleNextImage(item.id, item.images?.length ?? 0)}
                                            onAdd={() => handleAddToCart(item)}
                                        />
                                    </Col>
                                );
                            })}
                        </Row>
                        {hasMore && (
                            <div className="text-center mt-6">
                                <Button onClick={() => setPage(prev => prev + 1)} loading={loading}>Xem thêm</Button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default PublicHomePage;