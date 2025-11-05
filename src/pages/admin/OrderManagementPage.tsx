import React, { useState, useEffect } from 'react';
import { Table, Button, Card, Space, Input, Tag, Modal, message, Descriptions, Badge } from 'antd';
import { SearchOutlined, EyeOutlined, CloseOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { Order } from '../../types/Order';
import * as orderService from '../../services/order.service';
import dayjs from 'dayjs';

const { Search } = Input;

const OrderManagementPage: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        setLoading(true);
        try {
            const orderList = await orderService.getAllOrders();
            setOrders(orderList);
        } catch {
            message.error('Không thể tải danh sách đơn hàng');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (value: string) => {
        if (!value.trim()) {
            loadOrders();
            return;
        }

        setLoading(true);
        try {
            const orderList = await orderService.searchOrders(value);
            setOrders(orderList);
        } catch {
            message.error('Không thể tìm kiếm đơn hàng');
        } finally {
            setLoading(false);
        }
    };

    const handleViewOrder = (order: Order) => {
        setSelectedOrder(order);
        setIsModalVisible(true);
    };

    const handleCancelOrder = async (orderId: number) => {
        try {
            await orderService.cancelOrder(orderId);
            message.success('Hủy đơn hàng thành công');
            loadOrders();
        } catch {
            message.error('Không thể hủy đơn hàng');
        }
    };

    const getStatusColor = (status: Order['status']) => {
        switch (status) {
            case 'Pending': return 'gold';
            case 'InProgress': return 'blue';
            case 'Completed': return 'green';
            case 'Cancelled': return 'red';
            default: return 'default';
        }
    };

    const getStatusText = (status: Order['status']) => {
        switch (status) {
            case 'Pending': return 'Đang chờ';
            case 'InProgress': return 'Đang xử lý';
            case 'Completed': return 'Hoàn thành';
            case 'Cancelled': return 'Đã hủy';
            default: return status;
        }
    };

    const columns: ColumnsType<Order> = [
        {
            title: 'Mã đơn',
            dataIndex: 'id',
            key: 'id',
            width: 80,
            render: (id: number) => `#${id}`,
        },
        {
            title: 'Khách hàng',
            dataIndex: 'userId',
            key: 'userId',
            render: (userId: number) => `Khách hàng #${userId}`,
        },
        {
            title: 'Bàn số',
            dataIndex: 'tableId',
            key: 'tableId',
            render: (tableId: number) => <Tag color="cyan">Bàn {tableId}</Tag>,
        },
        {
            title: 'Thời gian đặt',
            dataIndex: 'orderTime',
            key: 'orderTime',
            render: (time: string) => dayjs(time).format('DD/MM/YYYY HH:mm'),
            sorter: (a, b) => dayjs(a.orderTime).unix() - dayjs(b.orderTime).unix(),
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'totalAmount',
            key: 'totalAmount',
            render: (amount: number) => `$${amount.toFixed(2)}`,
            sorter: (a, b) => a.totalAmount - b.totalAmount,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status: Order['status']) => (
                <Tag color={getStatusColor(status)}>
                    {getStatusText(status)}
                </Tag>
            ),
            filters: [
                { text: 'Đang chờ', value: 'Pending' },
                { text: 'Đang xử lý', value: 'InProgress' },
                { text: 'Hoàn thành', value: 'Completed' },
                { text: 'Đã hủy', value: 'Cancelled' },
            ],
            onFilter: (value, record) => record.status === value,
        },
        {
            title: 'Hành động',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button
                        type="text"
                        icon={<EyeOutlined />}
                        onClick={() => handleViewOrder(record)}
                        size="small"
                    >
                        Xem
                    </Button>
                    {record.status === 'Pending' && (
                        <Button
                            type="text"
                            danger
                            icon={<CloseOutlined />}
                            onClick={() => handleCancelOrder(record.id)}
                            size="small"
                        >
                            Hủy
                        </Button>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <div className="p-6">
            <Card title="Quản lý đơn hàng" className="mb-6">
                <div className="flex justify-between items-center mb-4">
                    <Search
                        placeholder="Tìm kiếm đơn hàng..."
                        allowClear
                        enterButton={<SearchOutlined />}
                        size="large"
                        onSearch={handleSearch}
                        style={{ width: 400 }}
                    />
                    <Button
                        type="primary"
                        onClick={loadOrders}
                    >
                        Làm mới
                    </Button>
                </div>

                <Table
                    columns={columns}
                    dataSource={orders}
                    loading={loading}
                    rowKey="id"
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total) => `Tổng ${total} đơn hàng`,
                    }}
                />
            </Card>

            <Modal
                title={`Chi tiết đơn hàng #${selectedOrder?.id}`}
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={[
                    <Button key="close" onClick={() => setIsModalVisible(false)}>
                        Đóng
                    </Button>
                ]}
                width={700}
            >
                {selectedOrder && (
                    <div>
                        <Descriptions title="Thông tin đơn hàng" bordered column={2}>
                            <Descriptions.Item label="Mã đơn">#{selectedOrder.id}</Descriptions.Item>
                            <Descriptions.Item label="Khách hàng">Khách hàng #{selectedOrder.userId}</Descriptions.Item>
                            <Descriptions.Item label="Bàn số">Bàn {selectedOrder.tableId}</Descriptions.Item>
                            <Descriptions.Item label="Thời gian">
                                {dayjs(selectedOrder.orderTime).format('DD/MM/YYYY HH:mm:ss')}
                            </Descriptions.Item>
                            <Descriptions.Item label="Trạng thái">
                                <Badge
                                    status={selectedOrder.status === 'Completed' ? 'success' : 'processing'}
                                    text={getStatusText(selectedOrder.status)}
                                />
                            </Descriptions.Item>
                            <Descriptions.Item label="Tổng tiền">
                                <span className="text-lg font-bold text-green-600">
                                    ${selectedOrder.totalAmount.toFixed(2)}
                                </span>
                            </Descriptions.Item>
                        </Descriptions>

                        <div className="mt-6">
                            <h3 className="text-lg font-semibold mb-4">Chi tiết món ăn</h3>
                            <Table
                                dataSource={selectedOrder.orderDetails}
                                rowKey="id"
                                pagination={false}
                                size="small"
                                columns={[
                                    {
                                        title: 'Món ăn',
                                        render: (_, record) => (
                                            <div>
                                                <div className="font-medium">
                                                    {record.menuItem?.name || `Món #${record.menuItemId}`}
                                                </div>
                                                {record.menuItem?.description && (
                                                    <div className="text-gray-500 text-sm">
                                                        {record.menuItem.description}
                                                    </div>
                                                )}
                                            </div>
                                        ),
                                    },
                                    {
                                        title: 'Số lượng',
                                        dataIndex: 'quantity',
                                        key: 'quantity',
                                        width: 100,
                                        align: 'center',
                                    },
                                    {
                                        title: 'Đơn giá',
                                        dataIndex: 'price',
                                        key: 'price',
                                        width: 120,
                                        render: (price: number) => `$${price.toFixed(2)}`,
                                    },
                                    {
                                        title: 'Thành tiền',
                                        key: 'total',
                                        width: 120,
                                        render: (_, record) => `$${(record.quantity * record.price).toFixed(2)}`,
                                    },
                                ]}
                            />
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default OrderManagementPage;