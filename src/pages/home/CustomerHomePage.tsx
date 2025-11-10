import React, { useEffect, useState, memo, useCallback } from "react";
import {
    Row,
    Col,
    Card,
    Button,
    Typography,
    Input,
    Select,
    message,
    Empty,
    Spin,
} from "antd";
import {
    SearchOutlined,
    PlusOutlined,
    LeftOutlined,
    RightOutlined,
} from "@ant-design/icons";
import { useCart } from "../../context/CartContext";
import * as menuItemService from "../../services/menu-item.service";
import type { MenuItem } from "../../types/MenuItem";

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

// -------------------- MENU ITEM CARD --------------------
const MenuItemCard = memo(({ item, onAdd }: { item: MenuItem; onAdd: () => void }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const images = item.images || [];

    const prev = () =>
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    const next = () =>
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));

    return (
        <Card
            hoverable
            className="h-full flex flex-col shadow-sm hover:shadow-md transition-shadow"
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
                                        onClick={prev}
                                    />
                                    <Button
                                        type="primary"
                                        size="small"
                                        shape="circle"
                                        icon={<RightOutlined />}
                                        className="absolute top-1/2 right-2 transform -translate-y-1/2 opacity-70"
                                        onClick={next}
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
                <Title level={5} className="mb-1">
                    {item.name}
                </Title>
                <Text type="secondary" className="text-xs block mb-1">
                    {item.category || "Chưa có"}
                </Text>
                <Paragraph className="text-sm mb-2 line-clamp-2">
                    {item.description}
                </Paragraph>
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

// -------------------- MAIN PAGE --------------------
const CustomerHomePage: React.FC = () => {
    const { addItem } = useCart();

    const [allItems, setAllItems] = useState<MenuItem[]>([]);
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [categories, setCategories] = useState<string[]>([]);
    const [page, setPage] = useState(1);
    const itemsPerPage = 8;

    // ✅ Gọi API duy nhất 1 lần
    useEffect(() => {
        const fetchItems = async () => {
            setLoading(true);
            try {
                const items = await menuItemService.getAllMenuItems();
                const available = items.filter((i) => i.status === "Available");

                const uniqueCats = Array.from(
                    new Set(available.map((i) => i.category).filter(Boolean) as string[])
                );

                setCategories(uniqueCats);
                setAllItems(available);

                const firstBatch = available.slice(0, itemsPerPage);
                await loadImagesFor(firstBatch, true);
            } catch (err) {
                console.error(err);
                message.error("Không thể tải thực đơn");
            } finally {
                setLoading(false);
            }
        };
        fetchItems();
    }, []);

    // ✅ Lọc món theo từ khóa & danh mục
    useEffect(() => {
        const filtered = allItems.filter((item) => {
            const matchCategory = selectedCategory
                ? item.category === selectedCategory
                : true;
            const matchKeyword = searchKeyword
                ? item.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                item.description?.toLowerCase().includes(searchKeyword.toLowerCase())
                : true;
            return matchCategory && matchKeyword;
        });

        setPage(1);
        loadImagesFor(filtered.slice(0, itemsPerPage), true);
    }, [selectedCategory, searchKeyword, allItems]);

    // ✅ Lazy load ảnh
    const loadImagesFor = async (items: MenuItem[], reset: boolean = false) => {
        setLoading(true);
        try {
            const withImages = await Promise.all(
                items.map(async (item) => {
                    try {
                        const images = await menuItemService.getMenuItemImageByMenuItemId(item.id);
                        return { ...item, images };
                    } catch {
                        return { ...item, images: [] };
                    }
                })
            );
            setMenuItems((prev) => (reset ? withImages : [...prev, ...withImages]));
        } finally {
            setLoading(false);
        }
    };

    // ✅ Khi nhấn “Xem thêm”
    const handleLoadMore = async () => {
        const filtered = allItems.filter((item) => {
            const matchCategory = selectedCategory ? item.category === selectedCategory : true;
            const matchKeyword = searchKeyword
                ? item.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                item.description?.toLowerCase().includes(searchKeyword.toLowerCase())
                : true;
            return matchCategory && matchKeyword;
        });

        const nextPage = page + 1;
        const nextItems = filtered.slice(page * itemsPerPage, nextPage * itemsPerPage);
        await loadImagesFor(nextItems);
        setPage(nextPage);
    };

    const handleAddToCart = useCallback(
        (item: MenuItem) => {
            addItem(item, true);
            message.success(`${item.name} đã thêm vào giỏ hàng`);
        },
        [addItem]
    );

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Search + Filter */}
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

            {/* Menu list */}
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
                            {menuItems.map((item) => (
                                <Col xs={24} sm={12} md={8} lg={6} key={item.id}>
                                    <MenuItemCard item={item} onAdd={() => handleAddToCart(item)} />
                                </Col>
                            ))}
                        </Row>

                        {/* Nút xem thêm */}
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

export default CustomerHomePage;
