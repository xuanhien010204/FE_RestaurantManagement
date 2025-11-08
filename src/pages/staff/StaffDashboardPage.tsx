import React, { useState, useEffect } from 'react';
import { Card, Typography, Row, Col, Table, Tag, Button, Space, Statistic, message } from 'antd';
import {
    ShoppingCartOutlined,
    UserOutlined,
    TableOutlined,
    DollarOutlined,
    ClockCircleOutlined,
    CheckCircleOutlined,
    CalendarOutlined,
    MenuOutlined
} from '@ant-design/icons';
import { useAppSelector } from '../../redux/app/hook';
import type { Order } from '../../types/Order';
import type { Payment } from '../../types/Payment';
import type { RestaurantTable } from '../../types/RestaurantTable';
import type { Reservation } from '../../types/Reservation';
import type { MenuItem } from '../../types/MenuItem';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const StaffDashboardPage: React.FC = () => {
    const user = useAppSelector(state => state.auth.user);

    // Mock data for demonstration - in real app, fetch from Redux store
    const [orders, setOrders] = useState<Order[]>([]);
    const [payments, setPayments] = useState<Payment[]>([]);
    const [tables, setTables] = useState<RestaurantTable[]>([]);
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

    useEffect(() => {
        // Initialize with mock data for demonstration
        setOrders([
            {
                id: 1,
                userId: 1,
                tableId: 1,
                orderTime: new Date().toISOString(),
                status: 'Pending',
                totalAmount: 85.50,
                orderDetails: []
            },
            {
                id: 2,
                userId: 2,
                tableId: 2,
                orderTime: new Date(Date.now() - 3600000).toISOString(),
                status: 'InProgress',
                totalAmount: 65.75,
                orderDetails: []
            }
        ]);

        setPayments([
            {
                id: 1,
                orderId: 1,
                amount: 85.50,
                paymentDate: new Date().toISOString(),
                status: 'Completed',
                paymentDetails: [{
                    id: 1,
                    paymentId: 1,
                    method: 'CreditCard',
                    amount: 85.50,
                    transactionCode: 'TXN001'
                }]
            }
        ]);

        setTables([
            { id: 1, tableNumber: 1, seats: 4, status: 'Available' },
            { id: 2, tableNumber: 2, seats: 2, status: 'Occupied' },
            { id: 3, tableNumber: 3, seats: 6, status: 'Reserved' }
        ]);

        // Mock reservations data
        setReservations([
            {
                id: 1,
                userId: 1,
                tableId: 1,
                reservationTime: dayjs().add(2, 'hours').toISOString(),
                numberOfGuests: 4,
                status: 'Pending',
            },
            {
                id: 2,
                userId: 2,
                tableId: 3,
                reservationTime: dayjs().add(5, 'hours').toISOString(),
                numberOfGuests: 6,
                status: 'Confirmed',
            },
            {
                id: 3,
                userId: 3,
                tableId: 2,
                reservationTime: dayjs().add(1, 'day').hour(19).minute(0).toISOString(),
                numberOfGuests: 2,
                status: 'Pending',
            }
        ]);

        // Mock menu items data
        setMenuItems([
            { id: 1, name: 'Phở Bò', description: 'Phở bò truyền thống', price: 65000, category: 'Món chính', status: 'Available' },
            { id: 2, name: 'Cơm Tấm', description: 'Cơm tấm sườn bì chả', price: 45000, category: 'Món chính', status: 'Available' },
            { id: 3, name: 'Bánh Mì', description: 'Bánh mì thịt nguội', price: 25000, category: 'Món phụ', status: 'Available' },
            { id: 4, name: 'Cà Phê Sữa', description: 'Cà phê sữa đá', price: 20000, category: 'Đồ uống', status: 'Available' },
        ]);
    }, []);

    const getOrderStatusColor = (status: string) => {
        switch (status) {
            case 'Pending': return 'orange';
            case 'InProgress': return 'blue';
            case 'Completed': return 'green';
            case 'Cancelled': return 'red';
            default: return 'default';
        }
    };

    const getTableStatusColor = (status: string) => {
        switch (status) {
            case 'Available': return 'green';
            case 'Occupied': return 'red';
            case 'Reserved': return 'orange';
            case 'OutOfService': return 'gray';
            default: return 'default';
        }
    };

    const handleQuickAction = (action: string) => {
        message.info(`${action} functionality would be implemented here`);
    };

    const orderColumns = [
        {
            title: 'Order ID',
            dataIndex: 'id',
            key: 'id',
            render: (id: number) => `#${id.toString().padStart(4, '0')}`,
        },
        {
            title: 'Time',
            dataIndex: 'orderTime',
            key: 'orderTime',
            render: (time: string) => new Date(time).toLocaleTimeString(),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => (
                <Tag color={getOrderStatusColor(status)}>{status}</Tag>
            ),
        },
        {
            title: 'Amount',
            dataIndex: 'totalAmount',
            key: 'totalAmount',
            render: (amount: number) => `$${amount.toFixed(2)}`,
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: unknown, record: Order) => (
                <Space>
                    <Button
                        size="small"
                        type="primary"
                        onClick={() => handleQuickAction(`View Order ${record.id}`)}
                    >
                        View
                    </Button>
                    {record.status === 'Pending' && (
                        <Button
                            size="small"
                            onClick={() => handleQuickAction(`Start Order ${record.id}`)}
                        >
                            Start
                        </Button>
                    )}
                    {record.status === 'InProgress' && (
                        <Button
                            size="small"
                            type="primary"
                            ghost
                            onClick={() => handleQuickAction(`Complete Order ${record.id}`)}
                        >
                            Complete
                        </Button>
                    )}
                </Space>
            ),
        },
    ];

    const tableColumns = [
        {
            title: 'Table',
            dataIndex: 'tableNumber',
            key: 'tableNumber',
            render: (num: number) => `Table ${num}`,
        },
        {
            title: 'Capacity',
            dataIndex: 'seats',
            key: 'seats',
            render: (seats: number) => `${seats} seats`,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => (
                <Tag color={getTableStatusColor(status)}>{status}</Tag>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: unknown, record: RestaurantTable) => (
                <Space>
                    {record.status === 'Available' && (
                        <Button
                            size="small"
                            onClick={() => handleQuickAction(`Reserve Table ${record.id}`)}
                        >
                            Reserve
                        </Button>
                    )}
                    {record.status === 'Occupied' && (
                        <Button
                            size="small"
                            type="primary"
                            onClick={() => handleQuickAction(`Clear Table ${record.id}`)}
                        >
                            Clear
                        </Button>
                    )}
                </Space>
            ),
        },
    ];

    // Reservation columns for staff to check reservations
    const reservationColumns = [
        {
            title: 'Mã',
            dataIndex: 'id',
            key: 'id',
            render: (id: number) => `#${id}`,
        },
        {
            title: 'Bàn',
            dataIndex: 'tableId',
            key: 'tableId',
            render: (tableId: number) => `Bàn ${tableId}`,
        },
        {
            title: 'Thời gian',
            dataIndex: 'reservationTime',
            key: 'reservationTime',
            render: (time: string) => (
                <Space direction="vertical" size={0}>
                    <span>{dayjs(time).format('DD/MM/YYYY')}</span>
                    <span className="text-gray-500">{dayjs(time).format('HH:mm')}</span>
                </Space>
            ),
        },
        {
            title: 'Số khách',
            dataIndex: 'numberOfGuests',
            key: 'numberOfGuests',
            render: (guests: number) => `${guests} người`,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status: Reservation['status']) => {
                const colorMap = { Pending: 'orange', Confirmed: 'green', Cancelled: 'red' };
                const textMap = { Pending: 'Chờ xác nhận', Confirmed: 'Đã xác nhận', Cancelled: 'Đã hủy' };
                return <Tag color={colorMap[status]}>{textMap[status]}</Tag>;
            },
        },
        {
            title: 'Hành động',
            key: 'actions',
            render: (_: unknown, record: Reservation) => (
                <Space>
                    {record.status === 'Pending' && (
                        <Button
                            size="small"
                            type="primary"
                            onClick={() => handleQuickAction(`Confirm Reservation ${record.id}`)}
                        >
                            Xác nhận
                        </Button>
                    )}
                    <Button
                        size="small"
                        onClick={() => handleQuickAction(`View Reservation ${record.id}`)}
                    >
                        Chi tiết
                    </Button>
                </Space>
            ),
        },
    ];

    // Menu columns for staff to check menu items
    const menuColumns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 60,
        },
        {
            title: 'Tên món',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            key: 'price',
            render: (price: number) => `${price.toLocaleString('vi-VN')}đ`,
        },
        {
            title: 'Danh mục',
            dataIndex: 'category',
            key: 'category',
            render: (category: string) => <Tag color="blue">{category}</Tag>,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => (
                <Tag color={status === 'Available' ? 'green' : 'red'}>
                    {status === 'Available' ? 'Còn món' : 'Hết món'}
                </Tag>
            ),
        },
    ];

    // Calculate statistics
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status === 'Pending').length;
    const inProgressOrders = orders.filter(o => o.status === 'InProgress').length;
    const completedOrders = orders.filter(o => o.status === 'Completed').length;
    const todayRevenue = payments
        .filter(p => new Date(p.paymentDate).toDateString() === new Date().toDateString())
        .reduce((sum, p) => sum + p.amount, 0);
    const availableTables = tables.filter(t => t.status === 'Available').length;

    return (
        <div className="p-6">
            <div className="mb-6">
                <Title level={2}>Staff Dashboard</Title>
                <Text type="secondary">Welcome back, {user?.fullName}! Here's your operational overview.</Text>
            </div>

            {/* Quick Stats */}
            <Row gutter={[16, 16]} className="mb-6">
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Total Orders Today"
                            value={totalOrders}
                            prefix={<ShoppingCartOutlined />}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Pending Orders"
                            value={pendingOrders}
                            prefix={<ClockCircleOutlined />}
                            valueStyle={{ color: '#faad14' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Today's Revenue"
                            value={todayRevenue}
                            precision={2}
                            prefix={<DollarOutlined />}
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Available Tables"
                            value={availableTables}
                            suffix={`/ ${tables.length}`}
                            prefix={<TableOutlined />}
                            valueStyle={{ color: availableTables > 0 ? '#52c41a' : '#ff4d4f' }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Order Status Overview */}
            <Row gutter={[16, 16]} className="mb-6">
                <Col xs={24} sm={8}>
                    <Card>
                        <div className="text-center">
                            <ClockCircleOutlined className="text-4xl text-orange-500 mb-2" />
                            <div className="text-2xl font-bold text-orange-600">{pendingOrders}</div>
                            <div className="text-gray-600">Pending Orders</div>
                        </div>
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card>
                        <div className="text-center">
                            <UserOutlined className="text-4xl text-blue-500 mb-2" />
                            <div className="text-2xl font-bold text-blue-600">{inProgressOrders}</div>
                            <div className="text-gray-600">In Progress</div>
                        </div>
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card>
                        <div className="text-center">
                            <CheckCircleOutlined className="text-4xl text-green-500 mb-2" />
                            <div className="text-2xl font-bold text-green-600">{completedOrders}</div>
                            <div className="text-gray-600">Completed</div>
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* Active Orders & Tables */}
            <Row gutter={[16, 16]}>
                <Col xs={24} lg={14}>
                    <Card
                        title="Active Orders"
                        extra={
                            <Button
                                type="primary"
                                onClick={() => handleQuickAction('View All Orders')}
                            >
                                View All
                            </Button>
                        }
                    >
                        <Table
                            columns={orderColumns}
                            dataSource={orders.filter(o => o.status !== 'Completed')}
                            rowKey="id"
                            pagination={false}
                            size="small"
                            scroll={{ x: 400 }}
                        />
                    </Card>
                </Col>

                <Col xs={24} lg={10}>
                    <Card
                        title="Table Status"
                        extra={
                            <Button
                                type="primary"
                                onClick={() => handleQuickAction('Manage Tables')}
                            >
                                Manage
                            </Button>
                        }
                    >
                        <Table
                            columns={tableColumns}
                            dataSource={tables}
                            rowKey="id"
                            pagination={false}
                            size="small"
                        />
                    </Card>
                </Col>
            </Row>

            {/* Reservations & Menu Section */}
            <Row gutter={[16, 16]} className="mt-6">
                <Col xs={24} lg={14}>
                    <Card
                        title={
                            <Space>
                                <CalendarOutlined />
                                <span>Đặt bàn hôm nay</span>
                            </Space>
                        }
                        extra={
                            <Button
                                type="link"
                                onClick={() => handleQuickAction('View All Reservations')}
                            >
                                Xem tất cả
                            </Button>
                        }
                    >
                        <Table
                            columns={reservationColumns}
                            dataSource={reservations.filter(r =>
                                dayjs(r.reservationTime).isSame(dayjs(), 'day')
                            )}
                            rowKey="id"
                            pagination={false}
                            size="small"
                            scroll={{ x: 600 }}
                        />
                    </Card>
                </Col>

                <Col xs={24} lg={10}>
                    <Card
                        title={
                            <Space>
                                <MenuOutlined />
                                <span>Thực đơn hiện tại</span>
                            </Space>
                        }
                        extra={
                            <Button
                                type="link"
                                onClick={() => handleQuickAction('Manage Menu')}
                            >
                                Quản lý
                            </Button>
                        }
                    >
                        <Table
                            columns={menuColumns}
                            dataSource={menuItems}
                            rowKey="id"
                            pagination={{ pageSize: 5, size: 'small' }}
                            size="small"
                            scroll={{ x: 400 }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Quick Actions */}
            <Card title="Quick Actions" className="mt-6">
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12} md={6}>
                        <Button
                            type="primary"
                            block
                            icon={<ShoppingCartOutlined />}
                            onClick={() => handleQuickAction('New Order')}
                        >
                            Create New Order
                        </Button>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Button
                            block
                            icon={<TableOutlined />}
                            onClick={() => handleQuickAction('Table Management')}
                        >
                            Manage Tables
                        </Button>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Button
                            block
                            icon={<DollarOutlined />}
                            onClick={() => handleQuickAction('Payment Processing')}
                        >
                            Process Payment
                        </Button>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Button
                            block
                            icon={<UserOutlined />}
                            onClick={() => handleQuickAction('Customer Service')}
                        >
                            Customer Service
                        </Button>
                    </Col>
                </Row>
            </Card>
        </div>
    );
};

export default StaffDashboardPage;