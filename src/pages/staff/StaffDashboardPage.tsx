import React, { useState, useEffect } from 'react';
import { Card, Typography, Row, Col, Table, Tag, Button, Space, Statistic, message, Spin } from 'antd';
import {
    ShoppingCartOutlined,
    UserOutlined,
    TableOutlined,
    DollarOutlined,
    ClockCircleOutlined,
    CheckCircleOutlined,
    MenuOutlined
} from '@ant-design/icons';
import { useAppSelector } from '../../redux/app/hook';
import * as orderService from '../../services/order.service';
import * as paymentService from '../../services/payment.service';
import * as tableService from '../../services/restaurant-table.service';
import * as menuItemService from '../../services/menu-item.service';
import type { Order } from '../../types/Order';
import type { Payment } from '../../types/Payment';
import type { RestaurantTable } from '../../types/RestaurantTable';
import type { MenuItem } from '../../types/MenuItem';

const { Title, Text } = Typography;

const StaffDashboardPage: React.FC = () => {
    const user = useAppSelector(state => state.auth.user);

    const [loading, setLoading] = useState(true);
    const [orders, setOrders] = useState<Order[]>([]);
    const [payments, setPayments] = useState<Payment[]>([]);
    const [tables, setTables] = useState<RestaurantTable[]>([]);
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            try {
                const [ordersData, paymentsData, tablesData, menuData] = await Promise.all([
                    orderService.getAllOrders(),
                    paymentService.getAllPayments(),
                    tableService.getAllTables(),
                    menuItemService.getAllMenuItems(),
                ]);

                // Filter today's orders
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const todayOrders = ordersData.filter((o: Order) => {
                    const orderDate = new Date(o.orderTime);
                    return orderDate >= today;
                });

                setOrders(todayOrders);
                setPayments(paymentsData);
                setTables(tablesData);
                setMenuItems(menuData);
            } catch (error) {
                console.error('Error fetching staff dashboard data:', error);
                message.error('Không thể tải dữ liệu dashboard');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
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

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Spin size="large" tip="Đang tải dữ liệu..." />
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="mb-6">
                <Title level={2}>Staff Dashboard</Title>
                <Text type="secondary">Chào mừng trở lại, {user?.fullName}! Đây là tổng quan hoạt động của bạn.</Text>
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

            {/* Menu Section */}
            <Row gutter={[16, 16]} className="mt-6">
                <Col xs={24}>
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
                                onClick={() => handleQuickAction('View All Menu')}
                            >
                                Xem tất cả
                            </Button>
                        }
                    >
                        <Table
                            columns={menuColumns}
                            dataSource={menuItems}
                            rowKey="id"
                            pagination={{ pageSize: 10, size: 'small' }}
                            size="small"
                            scroll={{ x: 800 }}
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