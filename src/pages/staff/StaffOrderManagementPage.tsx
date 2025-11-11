import React, { useEffect, useState } from 'react';
import {
    Table,
    Button,
    Tag,
    Space,
    message,
    Modal,
    Select,
    Typography,
    Card,
    Row,
    Col,
    Descriptions,
    InputNumber,
    Divider,
    Empty,
    Spin,
} from 'antd';
import { EyeOutlined, EditOutlined, CheckCircleOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import * as orderService from '../../services/order.service';
import * as menuItemService from '../../services/menu-item.service';
import * as tableService from '../../services/restaurant-table.service';
import type { Order, OrderStatus, OrderDetail } from '../../types/Order';
import type { MenuItem } from '../../types/MenuItem';
import type { RestaurantTable } from '../../types/RestaurantTable';
import type { OrderCreateRequest } from '../../services/order.service';
const { Title } = Typography;
const { Option } = Select;
const StaffOrderManagementPage: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(false);
    const [detailModalVisible, setDetailModalVisible] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [updating, setUpdating] = useState(false);
    const [createModalVisible, setCreateModalVisible] = useState(false);
    const [createLoading, setCreateLoading] = useState(false);
    const [catalogLoading, setCatalogLoading] = useState(false);
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [tables, setTables] = useState<RestaurantTable[]>([]);
    const [selectedTableId, setSelectedTableId] = useState<number | null>(null);
    const [draftItems, setDraftItems] = useState<OrderCreateRequest["items"]>([]);
    const [selectedMenuItemId, setSelectedMenuItemId] = useState<number | null>(null);
    const [selectedQuantity, setSelectedQuantity] = useState<number>(1);
    useEffect(() => {
        fetchOrders();
    }, []);
    const fetchOrders = async () => {
        setLoading(true);
        try {
            const data = await orderService.getAllOrders();
            // Sort by order time descending
            const sortedData = data.sort(
                (a, b) => new Date(b.orderTime).getTime() - new Date(a.orderTime).getTime()
            );
            setOrders(sortedData);
        } catch {
            message.error('Không thể tải danh sách đơn hàng');
        } finally {
            setLoading(false);
        }
    };
    const loadCatalogData = async () => {
        setCatalogLoading(true);
        try {
            const [menuList, tableList] = await Promise.all([
                menuItemService.getAllMenuItems(),
                tableService.getAllTablesAvailable().catch(() => tableService.getAllTables()),
            ]);
            setMenuItems(menuList);
            setTables(tableList);
            setSelectedTableId(prev => prev ?? (tableList[0]?.id ?? null));
        } catch {
            message.error('Khong the tai du lieu tao don hang');
        } finally {
            setCatalogLoading(false);
        }
    };
    const resetCreateForm = () => {
        setSelectedTableId(null);
        setDraftItems([]);
        setSelectedMenuItemId(null);
        setSelectedQuantity(1);
    };
    const handleOpenCreateModal = () => {
        setCreateModalVisible(true);
        if (!menuItems.length || !tables.length) {
            void loadCatalogData();
        } else {
            setSelectedTableId(prev => prev ?? (tables[0]?.id ?? null));
        }
    };
    const handleCloseCreateModal = () => {
        setCreateModalVisible(false);
        resetCreateForm();
    };
    const handleAddDraftItem = () => {
        if (!selectedMenuItemId) {
            message.warning('Vui long chon mon');
            return;
        }
        if (!selectedQuantity || selectedQuantity <= 0) {
            message.warning('So luong phai lon hon 0');
            return;
        }
        setDraftItems(prev => {
            const existingIndex = prev.findIndex(item => item.menuItemId === selectedMenuItemId);
            if (existingIndex !== -1) {
                const updated = [...prev];
                updated[existingIndex] = {
                    ...updated[existingIndex],
                    quantity: updated[existingIndex].quantity + selectedQuantity,
                };
                return updated;
            }
            return [
                ...prev,
                {
                    menuItemId: selectedMenuItemId,
                    quantity: selectedQuantity,
                },
            ];
        });
        setSelectedMenuItemId(null);
        setSelectedQuantity(1);
    };
    const handleDraftQuantityChange = (menuItemId: number, quantity: number | null) => {
        if (!quantity || quantity <= 0) {
            return;
        }
        setDraftItems(prev =>
            prev.map(item =>
                item.menuItemId === menuItemId
                    ? {
                        ...item,
                        quantity,
                    }
                    : item
            )
        );
    };
    const handleRemoveDraftItem = (menuItemId: number) => {
        setDraftItems(prev => prev.filter(item => item.menuItemId !== menuItemId));
    };
    const handleCreateOrderSubmit = async () => {
        if (!selectedTableId) {
            message.warning('Vui long chon ban phu vu');
            return;
        }
        if (!draftItems.length) {
            message.warning('Vui long them it nhat mot mon');
            return;
        }
        setCreateLoading(true);
        try {
            await orderService.createOrder({
                tableId: selectedTableId,
                items: draftItems,
            });
            message.success('Tao don hang thanh cong');
            handleCloseCreateModal();
            fetchOrders();
        } catch {
            message.error('Khong the tao don hang');
        } finally {
            setCreateLoading(false);
        }
    };
    const getTableStatusText = (status: RestaurantTable["status"]) => {
        switch (status) {
            case 'Available':
                return 'Trong';
            case 'Occupied':
                return 'Dang su dung';
            case 'Reserved':
                return 'Da dat truoc';
            default:
                return status;
        }
    };
    const handleViewDetail = (order: Order) => {
        setSelectedOrder(order);
        setDetailModalVisible(true);
    };
    const handleStatusChange = async (orderId: number, newStatus: OrderStatus) => {
        setUpdating(true);
        try {
            await orderService.updateOrderStatus(orderId, newStatus);
            message.success('Cập nhật trạng thái thành công');
            fetchOrders();
            if (selectedOrder?.id === orderId) {
                setSelectedOrder({ ...selectedOrder, status: newStatus });
            }
        } catch {
            message.error('Không thể cập nhật trạng thái');
        } finally {
            setUpdating(false);
        }
    };
    const getStatusColor = (status: OrderStatus): string => {
        const colors: Record<string, string> = {
            Pending: 'orange',
            InProgress: 'blue',
            Completed: 'green',
            Cancelled: 'red',
        };
        return colors[status] || 'default';
    };
    const getNextStatus = (currentStatus: OrderStatus): OrderStatus | null => {
        const statusFlow: Record<OrderStatus, OrderStatus | null> = {
            Pending: 'InProgress',
            InProgress: 'Completed',
            Completed: null,
            Cancelled: null,
        };
        return statusFlow[currentStatus];
    };
    const columns = [
        {
            title: 'Mã ĐH',
            dataIndex: 'id',
            key: 'id',
            width: 80,
            fixed: 'left' as const,
        },
        {
            title: 'Khách hàng',
            dataIndex: ['user', 'fullName'],
            key: 'customer',
            render: (name: string) => name || 'N/A',
        },
        {
            title: 'Bàn',
            dataIndex: 'tableId',
            key: 'tableId',
            width: 80,
            render: (tableId: number) => `Bàn ${tableId}`,
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'totalAmount',
            key: 'totalAmount',
            width: 120,
            render: (amount: number) => (
                <strong style={{ color: '#1890ff' }}>{amount.toLocaleString('vi-VN')}đ</strong>
            ),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            width: 130,
            render: (status: OrderStatus) => <Tag color={getStatusColor(status)}>{status}</Tag>,
        },
        {
            title: 'Thời gian',
            dataIndex: 'orderTime',
            key: 'orderTime',
            width: 180,
            render: (date: string) => new Date(date).toLocaleString('vi-VN'),
        },
        {
            title: 'Thao tác',
            key: 'action',
            width: 200,
            fixed: 'right' as const,
            render: (_: unknown, record: Order) => {
                const nextStatus = getNextStatus(record.status);
                return (
                    <Space>
                        <Button
                            type="default"
                            icon={<EyeOutlined />}
                            onClick={() => handleViewDetail(record)}
                        >
                            Chi tiết
                        </Button>
                        {nextStatus && (
                            <Button
                                type="primary"
                                icon={<CheckCircleOutlined />}
                                onClick={() => handleStatusChange(record.id, nextStatus)}
                                loading={updating}
                            >
                                {nextStatus === 'InProgress' && 'Xác nhận'}
                                {nextStatus === 'Completed' && 'Hoàn thành'}
                            </Button>
                        )}
                    </Space>
                );
            },
        },
    ];
    const detailColumns = [
        {
            title: 'Món ăn',
            dataIndex: ['menuItem', 'name'],
            key: 'menuItem',
            render: (name: string) => name || 'N/A',
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            key: 'quantity',
            width: 100,
        },
        {
            title: 'Đơn giá',
            dataIndex: 'price',
            key: 'price',
            width: 120,
            render: (price: number) => `${price.toLocaleString('vi-VN')}đ`,
        },
        {
            title: 'Thành tiền',
            key: 'total',
            width: 130,
            render: (_: unknown, record: OrderDetail) => (
                <strong>{(record.quantity * record.price).toLocaleString('vi-VN')}đ</strong>
            ),
        },
    ];
    const draftTableData = draftItems.map(item => {
        const menuItem = menuItems.find(menu => menu.id === item.menuItemId);
        return {
            key: item.menuItemId,
            menuItemId: item.menuItemId,
            name: menuItem?.name || `Món #${item.menuItemId}`,
            quantity: item.quantity,
            price: menuItem?.price || 0,
        };
    });
    const draftColumns = [
        {
            title: 'Món',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            key: 'quantity',
            width: 140,
            render: (_: number, record: { menuItemId: number; quantity: number }) => (
                <InputNumber
                    min={1}
                    value={record.quantity}
                    onChange={(value) => handleDraftQuantityChange(record.menuItemId, value)}
                />
            ),
        },
        {
            title: 'Đơn giá',
            dataIndex: 'price',
            key: 'price',
            width: 120,
            render: (price: number) => `${price.toLocaleString('vi-VN')}đ`,
        },
        {
            title: 'Thành tiền',
            key: 'total',
            width: 140,
            render: (_: unknown, record: { price: number; quantity: number }) => (
                <strong>{(record.price * record.quantity).toLocaleString('vi-VN')}đ</strong>
            ),
        },
        {
            title: '',
            key: 'action',
            width: 60,
            render: (_: unknown, record: { menuItemId: number }) => (
                <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleRemoveDraftItem(record.menuItemId)}
                />
            ),
        },
    ];
    const draftTotal = draftTableData.reduce((sum, item) => sum + item.price * item.quantity, 0);
    // Count orders by status for summary
    const orderSummary = orders.reduce(
        (acc, order) => {
            acc[order.status] = (acc[order.status] || 0) + 1;
            return acc;
        },
        {} as Record<string, number>
    );
    return (
        <div className="p-6">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <Title level={2} className="!mb-0">Quản Lý Đơn Hàng</Title>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleOpenCreateModal}>
                    Tao don hang
                </Button>
            </div>
            {/* Summary Cards */}
            <Row gutter={[16, 16]} className="mb-6">
                <Col xs={12} sm={6}>
                    <Card>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-orange-500">
                                {orderSummary.Pending || 0}
                            </div>
                            <div className="text-gray-600">Chờ xử lý</div>
                        </div>
                    </Card>
                </Col>
                <Col xs={12} sm={6}>
                    <Card>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-blue-500">
                                {orderSummary.InProgress || 0}
                            </div>
                            <div className="text-gray-600">Đang xử lý</div>
                        </div>
                    </Card>
                </Col>
                <Col xs={12} sm={6}>
                    <Card>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-500">
                                {orderSummary.Completed || 0}
                            </div>
                            <div className="text-gray-600">Hoàn thành</div>
                        </div>
                    </Card>
                </Col>
                <Col xs={12} sm={6}>
                    <Card>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-red-500">
                                {orderSummary.Cancelled || 0}
                            </div>
                            <div className="text-gray-600">Đã hủy</div>
                        </div>
                    </Card>
                </Col>
            </Row>
            {/* Orders Table */}
            <Card>
                <Table
                    columns={columns}
                    dataSource={orders}
                    rowKey="id"
                    loading={loading}
                    scroll={{ x: 1200 }}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showTotal: (total) => `Tổng ${total} đơn hàng`,
                    }}
                />
            </Card>
            {/* Order Detail Modal */}
            <Modal
                title={`Chi tiết đơn hàng #${selectedOrder?.id}`}
                open={detailModalVisible}
                onCancel={() => setDetailModalVisible(false)}
                footer={[
                    <Button key="close" onClick={() => setDetailModalVisible(false)}>
                        Đóng
                    </Button>,
                    selectedOrder && getNextStatus(selectedOrder.status) && (
                        <Button
                            key="update"
                            type="primary"
                            icon={<EditOutlined />}
                            loading={updating}
                            onClick={() => {
                                const nextStatus = getNextStatus(selectedOrder.status);
                                if (nextStatus) {
                                    handleStatusChange(selectedOrder.id, nextStatus);
                                }
                            }}
                        >
                            Cập nhật trạng thái
                        </Button>
                    ),
                ]}
                width={800}
            >
                {selectedOrder && (
                    <div>
                        <Descriptions bordered column={2} className="mb-4">
                            <Descriptions.Item label="Mã đơn hàng">
                                #{selectedOrder.id}
                            </Descriptions.Item>
                            <Descriptions.Item label="Trạng thái">
                                <Tag color={getStatusColor(selectedOrder.status)}>
                                    {selectedOrder.status}
                                </Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Khách hàng">
                                {selectedOrder.user?.fullName || 'N/A'}
                            </Descriptions.Item>
                            <Descriptions.Item label="Bàn">Bàn {selectedOrder.tableId}</Descriptions.Item>
                            <Descriptions.Item label="Thời gian đặt">
                                {new Date(selectedOrder.orderTime).toLocaleString('vi-VN')}
                            </Descriptions.Item>
                            <Descriptions.Item label="Tổng tiền">
                                <strong style={{ color: '#1890ff', fontSize: '16px' }}>
                                    {selectedOrder.totalAmount.toLocaleString('vi-VN')}đ
                                </strong>
                            </Descriptions.Item>
                        </Descriptions>
                        {selectedOrder.status !== 'Completed' && selectedOrder.status !== 'Cancelled' && (
                            <div className="mb-4">
                                <label className="block mb-2 font-semibold">Cập nhật trạng thái:</label>
                                <Select
                                    value={selectedOrder.status}
                                    onChange={(value) => handleStatusChange(selectedOrder.id, value)}
                                    style={{ width: '100%' }}
                                    loading={updating}
                                >
                                    <Option value="Pending">Pending</Option>
                                    <Option value="InProgress">In Progress</Option>
                                    <Option value="Completed">Completed</Option>
                                    <Option value="Cancelled">Cancelled</Option>
                                </Select>
                            </div>
                        )}
                        <Title level={5}>Chi tiết món ăn:</Title>
                        <Table
                            dataSource={selectedOrder.orderDetails || []}
                            columns={detailColumns}
                            rowKey="id"
                            pagination={false}
                        />
                    </div>
                )}
            </Modal>
            <Modal
                title="Tao don hang moi"
                open={createModalVisible}
                onCancel={handleCloseCreateModal}
                onOk={handleCreateOrderSubmit}
                okText="Tao don hang"
                cancelText="Dong"
                confirmLoading={createLoading}
                okButtonProps={{ disabled: !draftItems.length || !selectedTableId }}
                width={800}
            >
                {catalogLoading ? (
                    <div className="flex items-center justify-center py-10">
                        <Spin />
                    </div>
                ) : (
                    <>
                        <div className="flex items-center justify-between gap-2 mb-2">
                            <span className="font-semibold">Chon ban phu vu</span>
                            <Button size="small" type="link" onClick={() => loadCatalogData()}>
                                Tai lai
                            </Button>
                        </div>
                        {tables.length ? (
                            <Select
                                value={selectedTableId ?? undefined}
                                placeholder="Chon ban"
                                onChange={(value: number) => setSelectedTableId(value)}
                                style={{ width: '100%' }}
                                disabled={!tables.length}
                            >
                                {tables.map(table => (
                                    <Option key={table.id} value={table.id}>
                                        Ban {table.tableNumber} - {table.seats} ghe ({getTableStatusText(table.status)})
                                    </Option>
                                ))}
                            </Select>
                        ) : (
                            <Empty description="Khong co ban san sang" />
                        )}
                        <Divider />
                        <div className="grid gap-3 md:grid-cols-[2fr_auto_auto] items-center">
                            <Select
                                showSearch
                                placeholder="Chon mon"
                                value={selectedMenuItemId ?? undefined}
                                onChange={(value: number) => setSelectedMenuItemId(value)}
                                optionFilterProp="children"
                                disabled={!menuItems.length}
                            >
                                {menuItems.map(item => (
                                    <Option key={item.id} value={item.id}>
                                        {item.name} - {item.price.toLocaleString('vi-VN')}đ
                                    </Option>
                                ))}
                            </Select>
                            <InputNumber
                                min={1}
                                value={selectedQuantity}
                                onChange={(value) => setSelectedQuantity(value ?? 1)}
                            />
                            <Button
                                type="dashed"
                                icon={<PlusOutlined />}
                                onClick={handleAddDraftItem}
                                disabled={!selectedMenuItemId}
                            >
                                Them mon
                            </Button>
                        </div>
                        <div className="mt-4">
                            {draftItems.length === 0 ? (
                                <Empty description="Chua co mon nao" />
                            ) : (
                                <Table
                                    dataSource={draftTableData}
                                    columns={draftColumns}
                                    rowKey="menuItemId"
                                    pagination={false}
                                    size="small"
                                />
                            )}
                        </div>
                        <div className="flex items-center justify-between mt-4">
                            <span className="font-semibold">Tong tam tinh:</span>
                            <span className="text-lg font-bold text-orange-600">
                                {draftTotal.toLocaleString('vi-VN')}đ
                            </span>
                        </div>
                    </>
                )}
            </Modal>
        </div>
    );
};
export default StaffOrderManagementPage;
