import React, { useState, useEffect, useCallback } from 'react';
import { Table, Button, Input, DatePicker, Select, Tag, Modal, Typography, Space, Pagination, message } from 'antd';
import { EyeOutlined, StopOutlined, SearchOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { Order } from '../../types/Order';
import * as orderService from '../../services/order.service';
import { useAppSelector } from '../../redux/app/hook';
import dayjs from 'dayjs';

const { Title } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

const CustomerOrderPage: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('');
    const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [detailModalVisible, setDetailModalVisible] = useState(false);

    const user = useAppSelector(state => state.auth.user);

    const fetchOrders = useCallback(async () => {
        if (!user?.id) return;

        setLoading(true);
        try {
            // Since we only have getAllOrders, we'll filter on frontend for now
            const allOrders = await orderService.getAllOrders();

            // Filter orders by current user
            let userOrders = allOrders.filter(order => order.userId === user.id);

            // Apply search filter
            if (searchKeyword) {
                userOrders = userOrders.filter(order =>
                    order.id.toString().includes(searchKeyword) ||
                    order.status.toLowerCase().includes(searchKeyword.toLowerCase())
                );
            }

            // Apply status filter
            if (statusFilter) {
                userOrders = userOrders.filter(order => order.status === statusFilter);
            }

            // Apply date range filter
            if (dateRange) {
                userOrders = userOrders.filter(order => {
                    const orderDate = dayjs(order.orderTime);
                    return orderDate.isAfter(dateRange[0].startOf('day')) &&
                        orderDate.isBefore(dateRange[1].endOf('day'));
                });
            }

            // Apply pagination
            const startIndex = (currentPage - 1) * pageSize;
            const paginatedOrders = userOrders.slice(startIndex, startIndex + pageSize);

            setOrders(paginatedOrders);
            setTotal(userOrders.length);
        } catch (error) {
            console.error('Error fetching orders:', error);
            message.error('Failed to load orders');
        } finally {
            setLoading(false);
        }
    }, [user?.id, currentPage, searchKeyword, statusFilter, dateRange, pageSize]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const handleCancelOrder = async (orderId: number) => {
        try {
            await orderService.cancelOrder(orderId);
            message.success('Order cancelled successfully');
            fetchOrders(); // Refresh the list
        } catch (error) {
            console.error('Error cancelling order:', error);
            message.error('Failed to cancel order');
        }
    };

    const handleViewDetails = (order: Order) => {
        setSelectedOrder(order);
        setDetailModalVisible(true);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Pending': return 'orange';
            case 'InProgress': return 'blue';
            case 'Completed': return 'green';
            case 'Cancelled': return 'red';
            default: return 'default';
        }
    };

    const columns: ColumnsType<Order> = [
        {
            title: 'Order ID',
            dataIndex: 'id',
            key: 'id',
            width: 100,
            render: (id: number) => `#${id.toString().slice(-6)}`,
        },
        {
            title: 'Date',
            dataIndex: 'orderTime',
            key: 'orderTime',
            width: 120,
            render: (date: string) => dayjs(date).format('MMM DD, YYYY'),
            sorter: (a, b) => dayjs(a.orderTime).unix() - dayjs(b.orderTime).unix(),
        },
        {
            title: 'Table',
            dataIndex: 'tableId',
            key: 'tableId',
            width: 80,
            render: (tableId: number) => `Table ${tableId}`,
        },
        {
            title: 'Items',
            dataIndex: 'orderDetails',
            key: 'orderDetails',
            width: 100,
            render: (orderDetails: Order['orderDetails']) => `${orderDetails?.length || 0} items`,
        },
        {
            title: 'Total Amount',
            dataIndex: 'totalAmount',
            key: 'totalAmount',
            width: 120,
            render: (amount: number) => `$${amount?.toFixed(2) || '0.00'}`,
            sorter: (a, b) => (a.totalAmount || 0) - (b.totalAmount || 0),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 100,
            render: (status: string) => (
                <Tag color={getStatusColor(status)}>{status}</Tag>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 150,
            render: (_, record) => (
                <Space>
                    <Button
                        type="text"
                        icon={<EyeOutlined />}
                        onClick={() => handleViewDetails(record)}
                        title="View Details"
                    />
                    {record.status === 'Pending' && (
                        <Button
                            type="text"
                            danger
                            icon={<StopOutlined />}
                            onClick={() => handleCancelOrder(record.id)}
                            title="Cancel Order"
                        />
                    )}
                </Space>
            ),
        },
    ];

    const handleDateRangeChange = (dates: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null) => {
        if (dates && dates[0] && dates[1]) {
            setDateRange([dates[0], dates[1]]);
        } else {
            setDateRange(null);
        }
    };

    return (
        <div className="p-6">
            <Title level={2}>My Orders</Title>

            {/* Filters */}
            <div className="mb-6 bg-white p-4 rounded-lg shadow">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Input
                        placeholder="Search orders..."
                        prefix={<SearchOutlined />}
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                        allowClear
                    />

                    <Select
                        placeholder="Filter by status"
                        value={statusFilter}
                        onChange={setStatusFilter}
                        allowClear
                        style={{ width: '100%' }}
                    >
                        <Option value="">All Status</Option>
                        <Option value="Pending">Pending</Option>
                        <Option value="InProgress">In Progress</Option>
                        <Option value="Completed">Completed</Option>
                        <Option value="Cancelled">Cancelled</Option>
                    </Select>

                    <RangePicker
                        value={dateRange}
                        onChange={handleDateRangeChange}
                        style={{ width: '100%' }}
                        placeholder={['Start Date', 'End Date']}
                    />

                    <Button type="primary" onClick={fetchOrders}>
                        Search
                    </Button>
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-lg shadow">
                <Table
                    columns={columns}
                    dataSource={orders}
                    loading={loading}
                    rowKey="id"
                    pagination={false}
                    scroll={{ x: 800 }}
                />

                <div className="p-4 border-t">
                    <Pagination
                        current={currentPage}
                        pageSize={pageSize}
                        total={total}
                        onChange={setCurrentPage}
                        showSizeChanger={false}
                        showQuickJumper
                        showTotal={(total, range) =>
                            `${range[0]}-${range[1]} of ${total} orders`
                        }
                    />
                </div>
            </div>

            {/* Order Details Modal */}
            <Modal
                title={`Order Details - #${selectedOrder?.id?.toString().slice(-6)}`}
                open={detailModalVisible}
                onCancel={() => setDetailModalVisible(false)}
                footer={null}
                width={600}
            >
                {selectedOrder && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <strong>Order Date:</strong>
                                <div>{dayjs(selectedOrder.orderTime).format('MMM DD, YYYY HH:mm')}</div>
                            </div>
                            <div>
                                <strong>Status:</strong>
                                <div>
                                    <Tag color={getStatusColor(selectedOrder.status)}>
                                        {selectedOrder.status}
                                    </Tag>
                                </div>
                            </div>
                            <div>
                                <strong>Table:</strong>
                                <div>Table {selectedOrder.tableId}</div>
                            </div>
                            <div>
                                <strong>Total Amount:</strong>
                                <div className="text-lg font-semibold text-green-600">
                                    ${selectedOrder.totalAmount?.toFixed(2)}
                                </div>
                            </div>
                        </div>

                        {/* Order Items */}
                        <div>
                            <strong>Order Items:</strong>
                            <div className="mt-2 border rounded">
                                <Table
                                    columns={[
                                        {
                                            title: 'Item',
                                            dataIndex: 'menuItem',
                                            key: 'menuItem',
                                            render: (menuItem) => menuItem?.name || 'Unknown Item',
                                        },
                                        {
                                            title: 'Quantity',
                                            dataIndex: 'quantity',
                                            key: 'quantity',
                                            width: 80,
                                        },
                                        {
                                            title: 'Price',
                                            dataIndex: 'price',
                                            key: 'price',
                                            width: 100,
                                            render: (price: number) => `$${price?.toFixed(2)}`,
                                        },
                                        {
                                            title: 'Subtotal',
                                            key: 'subtotal',
                                            width: 100,
                                            render: (_, record) =>
                                                `$${((record.quantity || 0) * (record.price || 0)).toFixed(2)}`,
                                        },
                                    ]}
                                    dataSource={selectedOrder.orderDetails || []}
                                    pagination={false}
                                    size="small"
                                    rowKey="id"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default CustomerOrderPage;