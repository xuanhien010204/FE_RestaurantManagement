import React, { useEffect, useState, memo } from "react";
import {
    Row, Col, Card, Button, Typography, Input, Select, message, Empty, Spin,
} from "antd";
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
                <Text strong className="text-lg text-orange-600">
                    {item.price.toLocaleString("vi-VN")}đ
                </Text>
                <Button type="primary" size="small" icon={<PlusOutlined />} onClick={onAdd}>
                    Thêm
                </Button>
            </div>
        </Card>
    );
});

const PublicHomePage: React.FC = () => {
    const { addItem } = useCart();

    const [allItems, setAllItems] = useState<MenuItem[]>([]);
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [categories, setCategories] = useState<string[]>([]);
    const [imageIndexes, setImageIndexes] = useState<Record<number, number>>({});
    const [page, setPage] = useState(1);
    const itemsPerPage = 8;

    // 🔹 Chỉ gọi API 1 lần duy nhất khi mount
    useEffect(() => {
        const fetchItems = async () => {
            setLoading(true);
            try {
                const items = await menuItemService.getAllMenuItems();
                // Backend đã trả về images trong MenuItem response
                const available = items.filter((i) => i.status === "Available");

                setCategories(
                    Array.from(new Set(available.map((i) => i.category).filter(Boolean) as string[]))
                );

                // Gắn placeholder trước
                const placeholderMenu = available.map(i => ({ ...i, images: [] }));
                setAllItems(placeholderMenu);
                setMenuItems(placeholderMenu.slice(0, itemsPerPage));

                // Preload ảnh - ĐỒNG BỘ theo thứ tự
                const loadImagesSequentially = async () => {
                    for (const item of available) {
                        try {
                            const images = await menuItemService.getMenuItemImageByMenuItemId(item.id);
                            setAllItems(prev => prev.map(i => i.id === item.id ? { ...i, images } : i));
                            setMenuItems(prev => prev.map(i => i.id === item.id ? { ...i, images } : i));
                        } catch (error) {
                            console.error(`Failed to load images for item ${item.id}:`, error);
                        }
                    }
                };
                loadImagesSequentially();
            } catch (err) {
                console.error(err);
                message.error("Không thể tải thực đơn");
            } finally {
                setLoading(false);
            }
        };
        fetchItems();
    }, []);

    // 🔹 Lọc theo search & category
    useEffect(() => {
        const filtered = allItems.filter((item) => {
            const matchCategory = selectedCategory ? item.category === selectedCategory : true;
            const matchKeyword = searchKeyword
                ? item.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                item.description?.toLowerCase().includes(searchKeyword.toLowerCase())
                : true;
            return matchCategory && matchKeyword;
        });

        setPage(1);
        setMenuItems(filtered.slice(0, itemsPerPage));
    }, [selectedCategory, searchKeyword, allItems]);

    const handleAddToCart = (item: MenuItem) => {
        addItem(item, true);
        message.success(`${item.name} đã thêm vào giỏ hàng`);
    };

    const handlePrevImage = (itemId: number, total: number) => {
        setImageIndexes((prev) => ({
            ...prev,
            [itemId]: (prev[itemId] ?? 0) === 0 ? total - 1 : (prev[itemId] ?? 0) - 1,
        }));
    };

    const handleNextImage = (itemId: number, total: number) => {
        setImageIndexes((prev) => ({
            ...prev,
            [itemId]: (prev[itemId] ?? 0) === total - 1 ? 0 : (prev[itemId] ?? 0) + 1,
        }));
    };

    const handleLoadMore = () => {
        const filtered = allItems.filter((item) => {
            const matchCategory = selectedCategory ? item.category === selectedCategory : true;
            const matchKeyword = searchKeyword
                ? item.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                item.description?.toLowerCase().includes(searchKeyword.toLowerCase())
                : true;
            return matchCategory && matchKeyword;
        });

        const nextPage = page + 1;
        setPage(nextPage);
        setMenuItems(filtered.slice(0, nextPage * itemsPerPage));
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
                            onChange={(e) => setSearchKeyword(e.target.value)}
                            size="large"
                        />
                    </Col>
                    <Col xs={24} sm={12}>
                        <Select
                            placeholder="Chọn danh mục"
                            value={selectedCategory || undefined}
                            onChange={(val) => setSelectedCategory(val || "")}
                            allowClear
                            size="large"
                            className="w-full"
                        >
                            {categories.map((cat) => (
                                <Option key={cat} value={cat}>
                                    {cat}
                                </Option>
                            ))}
                        </Select>
                    </Col>
                </Row>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {loading ? (
                    <div className="text-center py-12">
                        <Spin tip="Đang tải thực đơn..." />
                    </div>
                ) : menuItems.length === 0 ? (
                    <Empty description="Không có món nào phù hợp" />
                ) : (
                    <>
                        <Row gutter={[16, 16]}>
                            {menuItems.map((item) => {
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
                        {menuItems.length < allItems.length && (
                            <div className="text-center mt-6">
                                <Button onClick={handleLoadMore}>Xem thêm</Button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default PublicHomePage;
