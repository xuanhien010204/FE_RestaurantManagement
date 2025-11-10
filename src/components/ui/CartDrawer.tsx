import React from "react";
import { Drawer, Button, List, InputNumber, Typography, Divider, Input, message } from "antd";
import { useCart } from "../../context/CartContext";
import { CloseOutlined, DeleteOutlined, GiftOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const CartDrawer: React.FC = () => {
    const {
        items,
        drawerOpen,
        closeDrawer,
        updateQuantity,
        removeItem,
        totalPrice,
        shippingFee,
        discountAmount,
        appliedPromotion,
        taxAmount,
        grandTotal,
        applyPromotion,
        removePromotion,
    } = useCart();

    const [promoCode, setPromoCode] = React.useState("");
    const [loadingPromo, setLoadingPromo] = React.useState(false);

    const handleApplyPromo = async () => {
        if (!promoCode) return message.warning("Vui lòng nhập mã giảm giá");
        setLoadingPromo(true);
        try {
            await applyPromotion(promoCode);
            message.success("Áp dụng mã giảm giá thành công!");
            setPromoCode("");
        } catch (err: any) {
            message.error(err.message || "Không thể áp dụng mã giảm giá");
        } finally {
            setLoadingPromo(false);
        }
    };

    return (
        <Drawer
            title={<span className="font-bold text-lg">Giỏ hàng của bạn</span>}
            placement="right"
            onClose={closeDrawer}
            open={drawerOpen}
            width={400}
            closeIcon={<CloseOutlined />}
        >
            <List
                itemLayout="horizontal"
                dataSource={items}
                locale={{ emptyText: "Chưa có món nào trong giỏ hàng" }}
                renderItem={item => (
                    <List.Item
                        actions={[
                            <InputNumber
                                min={1}
                                value={item.quantity}
                                onChange={qty => updateQuantity(item.id, Number(qty))}
                                size="small"
                            />,
                            <Button
                                type="text"
                                icon={<DeleteOutlined />}
                                danger
                                onClick={() => removeItem(item.id)}
                            />
                        ]}
                    >
                        <List.Item.Meta
                            avatar={item.images && item.images.length > 0 ? (
                                <img src={item.images[0].imageUrl} alt={item.name} className="w-12 h-12 object-cover rounded" />
                            ) : (
                                <div className="w-12 h-12 bg-gray-200 flex items-center justify-center rounded text-xl">🍽️</div>
                            )}
                            title={<span className="font-semibold">{item.name}</span>}
                            description={<span className="text-gray-500">{item.price.toLocaleString("vi-VN")}đ</span>}
                        />
                    </List.Item>
                )}
            />

            <Divider />

            {/* Promotion code */}
            <div className="mb-4">
                {appliedPromotion ? (
                    <div className="flex items-center justify-between bg-green-50 p-2 rounded">
                        <GiftOutlined className="text-green-600 mr-2" />
                        <Text className="font-semibold text-green-700">{appliedPromotion.code} - {appliedPromotion.discount}%</Text>
                        <Button type="link" danger onClick={removePromotion}>Bỏ mã</Button>
                    </div>
                ) : (
                    <div className="flex gap-2">
                        <Input
                            placeholder="Nhập mã giảm giá"
                            value={promoCode}
                            onChange={e => setPromoCode(e.target.value)}
                            size="small"
                        />
                        <Button
                            type="primary"
                            icon={<GiftOutlined />}
                            loading={loadingPromo}
                            onClick={handleApplyPromo}
                        >
                            Áp dụng
                        </Button>
                    </div>
                )}
            </div>

            <Divider />

            {/* Summary */}
            <div className="space-y-2">
                <div className="flex justify-between">
                    <Text>Tạm tính:</Text>
                    <Text strong>{totalPrice.toLocaleString("vi-VN")}đ</Text>
                </div>
                <div className="flex justify-between">
                    <Text>Giảm giá:</Text>
                    <Text type="danger">-{discountAmount.toLocaleString("vi-VN")}đ</Text>
                </div>
                <div className="flex justify-between">
                    <Text>Phí vận chuyển:</Text>
                    <Text>{shippingFee === 0 ? "Miễn phí" : `${shippingFee.toLocaleString("vi-VN")}đ`}</Text>
                </div>
                <div className="flex justify-between">
                    <Text>Thuế VAT (10%):</Text>
                    <Text>{taxAmount.toLocaleString("vi-VN")}đ</Text>
                </div>
                <Divider className="my-2" />
                <div className="flex justify-between text-lg">
                    <Text strong>Tổng cộng:</Text>
                    <Text strong className="text-orange-600">{grandTotal.toLocaleString("vi-VN")}đ</Text>
                </div>
            </div>

            <Button
                type="primary"
                block
                size="large"
                className="mt-6 bg-orange-500"
                disabled={items.length === 0}
            >
                Đặt hàng
            </Button>
        </Drawer>
    );
};

export default CartDrawer;
