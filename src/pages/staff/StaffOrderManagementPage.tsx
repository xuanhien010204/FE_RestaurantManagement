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
} from 'antd';
import { EyeOutlined, EditOutlined, CheckCircleOutlined } from '@ant-design/icons';
import * as orderService from '../../services/order.service';
import type { Order, OrderStatus, OrderDetail } from '../../types/Order';

const { Title } = Typography;
const { Option } = Select;

const StaffOrderManagementPage: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(false);
    const [detailModalVisible, setDetailModalVisible] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [updating, setUpdating] = useState(false);

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
            <Title level={2}>Quản Lý Đơn Hàng</Title>

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
        </div>
    );
};

export default StaffOrderManagementPage;
