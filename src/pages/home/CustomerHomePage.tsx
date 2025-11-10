import React, { useEffect, useState } from "react";
import { Row, Col, Card, Button, Typography, message, Empty } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import * as menuItemService from "../../services/menu-item.service";
import { useCart } from "../../context/CartContext";
import type { MenuItem } from "../../types/MenuItem";

const { Title, Text } = Typography;

interface CardItemProps {
    item: MenuItem;
    onAdd: (item: MenuItem) => void;
}

const CardItem: React.FC<CardItemProps> = ({ item, onAdd }) => (
    <Card hoverable className="h-full flex flex-col">
        <div className="flex-grow">
            <Title level={5}>{item.name}</Title>
            <Text type="secondary" className="text-xs">{item.category}</Text>
            <Text className="text-sm block line-clamp-2">{item.description}</Text>
        </div>
        <div className="flex justify-between items-center pt-3 border-t">
            <Text strong className="text-lg text-orange-600">{item.price.toLocaleString("vi-VN")}đ</Text>
            <Button type="primary" size="small" icon={<PlusOutlined />} onClick={() => onAdd(item)}>
                Thêm
            </Button>
        </div>
    </Card>
);

const CustomerHomePage: React.FC = () => {
    const { addItem } = useCart();
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadItems = async () => {
            setLoading(true);
            try {
                const items = await menuItemService.getAllMenuItems();
                setMenuItems(items.filter(i => i.status === "Available"));
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

    return (
        <div className="p-6">
            {/* Banner */}
            <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-8 rounded-lg mb-6 shadow-lg">
                <h1 className="text-3xl font-bold mb-2">Xin chào, khách hàng!</h1>
                <p className="text-orange-100">Chào mừng bạn đến với Thuyền Quán 🍜</p>
            </div>

            {/* Thực đơn */}
            <div className="max-w-7xl mx-auto">
                <Row gutter={[16, 16]}>
                    {loading ? (
                        <div className="w-full text-center py-10"><Text>Đang tải thực đơn...</Text></div>
                    ) : menuItems.length === 0 ? (
                        <Empty description="Không có món nào khả dụng" />
                    ) : (
                        menuItems.map(item => (
                            <Col xs={24} sm={12} md={8} lg={6} key={item.id}>
                                <CardItem item={item} onAdd={handleAddToCart} />
                            </Col>
                        ))
                    )}
                </Row>

            </div>
        </div>
    );
};

export default CustomerHomePage;
