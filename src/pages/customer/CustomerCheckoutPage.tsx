import React, { useEffect, useMemo, useState } from "react";
import {
    Card,
    List,
    Typography,
    InputNumber,
    Button,
    Divider,
    Select,
    Input,
    Space,
    message,
    Empty,
    Radio,
} from "antd";
import { DeleteOutlined, CreditCardOutlined, ShoppingOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAppSelector } from "../../redux/app/hook";
import * as orderService from "../../services/order.service";
import * as paymentService from "../../services/payment.service";
import type { PaymentDetailCreateRequest } from "../../services/payment.service";
import * as tableService from "../../services/restaurant-table.service";
import type { RestaurantTable } from "../../types/RestaurantTable";

const { Text } = Typography;
const { Option } = Select;
const TAKE_AWAY_TABLE_ID = 0;

const paymentMethodOptions = [
    { value: 3, label: "Stripe / E-Wallet" },
    { value: 1, label: "Credit Card" },
    { value: 0, label: "Cash" },
    { value: 2, label: "Bank Transfer" },
    { value: 4, label: "Voucher" },
];

type ServiceType = "takeAway" | "dineIn";

const CustomerCheckoutPage: React.FC = () => {
    const {
        items,
        totalPrice,
        discountAmount,
        shippingFee,
        taxAmount,
        grandTotal,
        updateQuantity,
        removeItem,
        clearCart,
    } = useCart();
    const navigate = useNavigate();
    const location = useLocation();
    const locationState = location.state as { note?: string } | undefined;
    const user = useAppSelector((state) => state.auth.user);

    const [serviceType, setServiceType] = useState<ServiceType>("takeAway");
    const [tableId, setTableId] = useState<number | null>(TAKE_AWAY_TABLE_ID);
    const [paymentMethod, setPaymentMethod] = useState<number>(paymentMethodOptions[0].value);
    const [transactionCode, setTransactionCode] = useState("");
    const [provider, setProvider] = useState("");
    const [note, setNote] = useState(locationState?.note ?? "");
    const [submitting, setSubmitting] = useState(false);
    const [tables, setTables] = useState<RestaurantTable[]>([]);
    const [tablesLoading, setTablesLoading] = useState(false);

    useEffect(() => {
        if (!items.length) {
            message.info("Cart is empty. Please add items before checking out.");
            navigate("/");
        }
    }, [items.length, navigate]);

    useEffect(() => {
        if (serviceType !== "dineIn") {
            setTableId(TAKE_AWAY_TABLE_ID);
            return;
        }

        let cancelled = false;
        const fetchTables = async () => {
            setTablesLoading(true);
            try {
                const availableTables = await tableService.getAllTablesAvailable();
                if (!cancelled) {
                    setTables(availableTables);
                }
            } catch (error) {
                console.error("Failed to load tables", error);
                if (!cancelled) {
                    setTables([]);
                }
            } finally {
                if (!cancelled) {
                    setTablesLoading(false);
                }
            }
        };

        fetchTables();

        return () => {
            cancelled = true;
        };
    }, [serviceType]);

    useEffect(() => {
        if (serviceType !== "dineIn") return;
        const needsTableSelection = tableId === null || tableId === TAKE_AWAY_TABLE_ID;
        if (needsTableSelection && tables.length > 0) {
            setTableId(tables[0].id);
        }
    }, [serviceType, tables, tableId]);

    const orderItems = useMemo(() => {
        return items.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            total: item.price * item.quantity,
            imageUrl: item.images && item.images.length > 0 ? item.images[0].imageUrl : undefined,
        }));
    }, [items]);

    const coerceToNumber = (value: unknown): number | null => {
        if (typeof value === "number" && !Number.isNaN(value)) {
            return value;
        }
        if (typeof value === "string") {
            const parsed = Number(value);
            if (!Number.isNaN(parsed)) {
                return parsed;
            }
        }
        return null;
    };

    const resolveOrderId = (raw: unknown): number => {
        const direct = coerceToNumber(raw);
        if (direct) return direct;

        if (raw && typeof raw === "object") {
            const data = raw as Record<string, unknown>;

            const topLevelId = coerceToNumber(data.id ?? data.orderId ?? null);
            if (topLevelId) return topLevelId;

            const fromOrder = coerceToNumber((data.order as Record<string, unknown> | undefined)?.id);
            if (fromOrder) return fromOrder;

            const fromData = coerceToNumber((data.data as Record<string, unknown> | undefined)?.id);
            if (fromData) return fromData;
        }

        return 0;
    };

    const resolveOrderTotalAmount = (raw: unknown, fallback: number): number => {
        const fallbackAmount = Number.isFinite(fallback) ? fallback : 0;

        const extractFromRecord = (record?: Record<string, unknown> | null): number | null => {
            if (!record) return null;
            return coerceToNumber(record.totalAmount ?? record.amount ?? null);
        };

        const direct = coerceToNumber(raw);
        if (direct !== null) return direct;

        if (raw && typeof raw === "object") {
            const data = raw as Record<string, unknown>;

            const topLevel = extractFromRecord(data);
            if (topLevel !== null) return topLevel;

            const nestedOrder = extractFromRecord(data.order as Record<string, unknown> | undefined);
            if (nestedOrder !== null) return nestedOrder;

            const nestedData = extractFromRecord(data.data as Record<string, unknown> | undefined);
            if (nestedData !== null) return nestedData;
        }

        return fallbackAmount;
    };

    const handleProceedToPayment = async () => {
        if (!items.length) {
            message.warning("Cart is empty. Nothing to checkout.");
            return;
        }

        if (serviceType === "dineIn" && (tableId === null || Number.isNaN(tableId))) {
            message.warning("Please choose a table or select take-away.");
            return;
        }

        setSubmitting(true);
        try {
            const resolvedTableId = serviceType === "dineIn"
                ? tableId ?? TAKE_AWAY_TABLE_ID
                : TAKE_AWAY_TABLE_ID;

            const orderPayload: orderService.OrderCreateRequest = {
                tableId: resolvedTableId,
                items: items.map((item) => ({
                    menuItemId: item.id,
                    quantity: item.quantity,
                })),
            };

            const createdOrder = await orderService.createOrder(orderPayload);
            const newOrderId = resolveOrderId(createdOrder);

            if (!newOrderId) {
                throw new Error("Unable to determine order ID from API response.");
            }

            const backendOrderTotal = resolveOrderTotalAmount(createdOrder, grandTotal);
            const paymentAmount = backendOrderTotal > 0 ? backendOrderTotal : Math.max(grandTotal, 0);

            const paymentDetail: PaymentDetailCreateRequest = {
                method: paymentMethod,
                amount: paymentAmount,
                transactionCode: transactionCode || undefined,
                provider: provider || undefined,
                extraInfo: note || undefined,
            };

            const paymentResponse = await paymentService.createPayment({
                orderId: newOrderId,
                amount: paymentAmount,
                paymentDetails: [paymentDetail],
            });

            message.success("Redirecting to the payment gateway...");
            clearCart();

            const redirectUrl =
                (paymentResponse as { checkoutUrl?: string; paymentUrl?: string }).checkoutUrl ??
                (paymentResponse as { checkoutUrl?: string; paymentUrl?: string }).paymentUrl;

            if (redirectUrl) {
                window.location.href = redirectUrl;
                return;
            }

            navigate("/customer/payments", { state: { highlightPaymentId: paymentResponse?.id ?? newOrderId } });
        } catch (error: any) {
            console.error("Checkout error", error);
            const msg =
                error?.response?.data?.message ??
                error?.message ??
                "Unable to process the payment. Please try again.";
            message.error(msg);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="bg-[#FFF8F3] min-h-screen py-10 px-4">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                    <Card
                        title={(
                            <Space align="center">
                                <ShoppingOutlined />
                                <span>Your cart</span>
                            </Space>
                        )}
                        bodyStyle={{ padding: orderItems.length ? 24 : 32 }}
                    >
                        {orderItems.length === 0 ? (
                            <Empty description="Your cart is empty" />
                        ) : (
                            <List
                                itemLayout="horizontal"
                                dataSource={orderItems}
                                renderItem={(item) => (
                                    <List.Item
                                        key={item.id}
                                        actions={[
                                            <InputNumber
                                                min={1}
                                                value={item.quantity}
                                                onChange={(qty) => updateQuantity(item.id, Number(qty))}
                                            />,
                                            <Button
                                                danger
                                                type="text"
                                                icon={<DeleteOutlined />}
                                                onClick={() => removeItem(item.id)}
                                            />,
                                        ]}
                                    >
                                        <List.Item.Meta
                                            avatar={
                                                item.imageUrl ? (
                                                    <img
                                                        src={item.imageUrl}
                                                        alt={item.name}
                                                        className="w-14 h-14 object-cover rounded"
                                                    />
                                                ) : (
                                                    <div className="w-14 h-14 rounded bg-gray-200 flex items-center justify-center text-gray-500">
                                                        {item.name.charAt(0)}
                                                    </div>
                                                )
                                            }
                                            title={<span className="font-semibold">{item.name}</span>}
                                            description={
                                                <span className="text-sm text-gray-500">
                                                    {item.price.toLocaleString("vi-VN")}đ each
                                                </span>
                                            }
                                        />
                                        <div className="text-right">
                                            <Text strong>
                                                {item.total.toLocaleString("vi-VN")}đ
                                            </Text>
                                        </div>
                                    </List.Item>
                                )}
                            />
                        )}
                    </Card>

                    <Card title="Service details">
                        <Space direction="vertical" size="middle" className="w-full">
                            <div>
                                <Text type="secondary">Customer</Text>
                                <div className="font-semibold text-base">
                                    {user?.fullName ?? "Guest"}
                                </div>
                                <div className="text-sm text-gray-500">
                                    {user?.email ?? "No email"} • {user?.phone ?? "No phone"}
                                </div>
                            </div>

                            <div>
                                <Text type="secondary">Service type</Text>
                                <Radio.Group
                                    className="mt-1"
                                    value={serviceType}
                                    onChange={(e) => setServiceType(e.target.value as ServiceType)}
                                >
                                    <Radio.Button value="takeAway">Take-away / Delivery</Radio.Button>
                                    <Radio.Button value="dineIn">Dine-in</Radio.Button>
                                </Radio.Group>
                            </div>

                            {serviceType === "dineIn" ? (
                                <div>
                                    <Text type="secondary">Choose table / area</Text>
                                    <Select
                                        value={tableId ?? undefined}
                                        onChange={(value) => setTableId(value)}
                                        className="w-full mt-1"
                                        loading={tablesLoading}
                                        placeholder="Select an available table"
                                    >
                                        {tables.map((table) => (
                                            <Option key={table.id} value={table.id}>
                                                Table #{table.tableNumber} • {table.seats} seats • {table.location}
                                            </Option>
                                        ))}
                                    </Select>
                                </div>
                            ) : (
                                <div className="p-3 bg-green-50 rounded border border-green-100">
                                    <Text type="secondary">No table needed for take-away orders.</Text>
                                </div>
                            )}

                            <div>
                                <Text type="secondary">Notes for the kitchen</Text>
                                <Input.TextArea
                                    rows={3}
                                    placeholder="e.g. less spicy, deliver at noon..."
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                />
                            </div>
                        </Space>
                    </Card>
                </div>

                <Card
                    title={(
                        <Space align="center">
                            <CreditCardOutlined />
                            <span>Payment</span>
                        </Space>
                    )}
                >
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <Text>Subtotal</Text>
                            <Text strong>{totalPrice.toLocaleString("vi-VN")}đ</Text>
                        </div>
                        <div className="flex justify-between">
                            <Text>Discount</Text>
                            <Text type="danger">- {discountAmount.toLocaleString("vi-VN")}đ</Text>
                        </div>
                        <div className="flex justify-between">
                            <Text>Shipping</Text>
                            <Text>{shippingFee === 0 ? "Free" : `${shippingFee.toLocaleString("vi-VN")}đ`}</Text>
                        </div>
                        <div className="flex justify-between">
                            <Text>VAT (10%)</Text>
                            <Text>{taxAmount.toLocaleString("vi-VN")}đ</Text>
                        </div>
                        <Divider className="my-3" />
                        <div className="flex justify-between text-lg">
                            <Text strong>Total</Text>
                            <Text strong className="text-orange-600">
                                {grandTotal.toLocaleString("vi-VN")}đ
                            </Text>
                        </div>
                    </div>

                    <Divider />

                    <div className="space-y-3">
                        <div>
                            <Text type="secondary">Payment method</Text>
                            <Select
                                className="w-full mt-1"
                                value={paymentMethod}
                                onChange={(value) => setPaymentMethod(value)}
                            >
                                {paymentMethodOptions.map((method) => (
                                    <Option key={method.value} value={method.value}>
                                        {method.label}
                                    </Option>
                                ))}
                            </Select>
                        </div>

                        <Input
                            placeholder="Transaction code (optional)"
                            value={transactionCode}
                            onChange={(e) => setTransactionCode(e.target.value)}
                        />
                        <Input
                            placeholder="Provider (Momo, Vietcombank, etc.)"
                            value={provider}
                            onChange={(e) => setProvider(e.target.value)}
                        />
                    </div>

                    <Divider />

                    <Space direction="vertical" className="w-full">
                        <Button
                            type="primary"
                            size="large"
                            block
                            className="bg-orange-500"
                            onClick={handleProceedToPayment}
                            disabled={!items.length}
                            loading={submitting}
                        >
                            Pay now
                        </Button>
                        <Button block onClick={() => navigate("/customer/payments")}>
                            View payment history
                        </Button>
                        
                    </Space>
                </Card>
            </div>
        </div>
    );
};

export default CustomerCheckoutPage;
