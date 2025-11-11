import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Statistic, Table, Tag, message, Spin, Typography } from 'antd';
import {
    DollarOutlined,
    ShoppingCartOutlined,
    RiseOutlined,
    ClockCircleOutlined,
    UserOutlined,
} from '@ant-design/icons';
import * as orderService from '../../services/order.service';
import * as paymentService from '../../services/payment.service';
import * as customerService from '../../services/customer.service';
import type { Order, OrderStatus } from '../../types/Order';
import type { Payment } from '../../types/Payment';

const { Title } = Typography;

interface DashboardStats {
    totalRevenue: number;
    todayRevenue: number;
    totalOrders: number;
    todayOrders: number;
    totalCustomers: number;
    pendingOrders: number;
}

interface PopularItem {
    name: string;
    quantity: number;
    revenue: number;
}

const AdminDashboardPage: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<DashboardStats>({
        totalRevenue: 0,
        todayRevenue: 0,
        totalOrders: 0,
        todayOrders: 0,
        totalCustomers: 0,
        pendingOrders: 0,
    });
    const [recentOrders, setRecentOrders] = useState<Order[]>([]);
    const [popularItems, setPopularItems] = useState<PopularItem[]>([]);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const [orders, payments, customers] = await Promise.all([
                orderService.getAllOrders(),
                paymentService.getAllPayments(),
                customerService.getAllCustomers(),
            ]);

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const totalRevenue = payments
                .filter((p: Payment) => p.status === 'Completed')
                .reduce((sum: number, p: Payment) => sum + p.amount, 0);

            const todayRevenue = payments
                .filter((p: Payment) => {
                    const paymentDate = new Date(p.paymentDate);
                    return p.status === 'Completed' && paymentDate >= today;
                })
                .reduce((sum: number, p: Payment) => sum + p.amount, 0);

            const todayOrders = orders.filter((o: Order) => {
                const orderDate = new Date(o.orderTime);
                return orderDate >= today;
            }).length;

            const pendingOrders = orders.filter((o: Order) => o.status === 'Pending').length;

            setStats({
                totalRevenue,
                todayRevenue,
                totalOrders: orders.length,
                todayOrders,
                totalCustomers: customers.length,
                pendingOrders,
            });

            const sortedOrders = [...orders]
                .sort((a, b) => new Date(b.orderTime).getTime() - new Date(a.orderTime).getTime())
                .slice(0, 10);
            setRecentOrders(sortedOrders);

            const itemCounts = new Map<number, { name: string; quantity: number; revenue: number }>();
            orders.forEach((order: Order) => {
                order.orderDetails?.forEach((detail) => {
                    const existing = itemCounts.get(detail.menuItemId) || {
                        name: detail.menuItem?.name || 'Unknown',
                        quantity: 0,
                        revenue: 0,
                    };
                    existing.quantity += detail.quantity;
                    existing.revenue += detail.quantity * detail.price;
                    itemCounts.set(detail.menuItemId, existing);
                });
            });

            const popular = Array.from(itemCounts.values())
                .sort((a, b) => b.quantity - a.quantity)
                .slice(0, 5);
            setPopularItems(popular);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            message.error('Không thể tải dữ liệu dashboard');
        } finally {
            setLoading(false);
        }
    };

    const orderColumns = [
        {
            title: 'Mã ĐH',
            dataIndex: 'id',
            key: 'id',
            width: 80,
        },
        {
            title: 'Khách hàng',
            dataIndex: ['user', 'name'],
            key: 'customer',
            render: (name: string) => name || 'N/A',
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'totalAmount',
            key: 'totalAmount',
            render: (amount: number) => `${amount.toLocaleString('vi-VN')}đ`,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status: OrderStatus) => {
                const colors: Record<string, string> = {
                    Pending: 'orange',
                    Preparing: 'cyan',
                    Ready: 'purple',
                    Delivered: 'green',
                    Cancelled: 'red',
                };
                return <Tag color={colors[status] || 'default'}>{status}</Tag>;
            },
        },
        {
            title: 'Thời gian',
            dataIndex: 'orderTime',
            key: 'orderTime',
            render: (date: string) => new Date(date).toLocaleString('vi-VN'),
        },
    ];

    const popularItemColumns = [
        {
            title: 'Món ăn',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Số lượng bán',
            dataIndex: 'quantity',
            key: 'quantity',
            render: (quantity: number) => <Tag color="blue">{quantity}</Tag>,
        },
        {
            title: 'Doanh thu',
            dataIndex: 'revenue',
            key: 'revenue',
            render: (revenue: number) => `${revenue.toLocaleString('vi-VN')}đ`,
        },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Spin size="large" tip="Đang tải dữ liệu..." />
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <Title level={2} className="mb-6">
                Dashboard Quản Trị
            </Title>

            {/* Statistics Cards */}
            <Row gutter={[16, 16]} className="mb-6">
                <Col xs={24} sm={12} lg={6}>
                    <Card hoverable>
                        <Statistic
                            title="Doanh thu hôm nay"
                            value={stats.todayRevenue}
                            precision={0}
                            prefix={<DollarOutlined />}
                            suffix="đ"
                            valueStyle={{ color: '#3f8600' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card hoverable>
                        <Statistic
                            title="Tổng doanh thu"
                            value={stats.totalRevenue}
                            precision={0}
                            prefix={<RiseOutlined />}
                            suffix="đ"
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card hoverable>
                        <Statistic
                            title="Đơn hàng hôm nay"
                            value={stats.todayOrders}
                            prefix={<ShoppingCartOutlined />}
                            suffix={`/ ${stats.totalOrders}`}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card hoverable>
                        <Statistic
                            title="Tổng khách hàng"
                            value={stats.totalCustomers}
                            prefix={<UserOutlined />}
                            valueStyle={{ color: '#722ed1' }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Alert for pending orders */}
            {stats.pendingOrders > 0 && (
                <Row gutter={[16, 16]} className="mb-6">
                    <Col span={24}>
                        <Card style={{ backgroundColor: '#fff7e6', borderColor: '#ffa940' }}>
                            <Statistic
                                title="Đơn hàng chờ xử lý"
                                value={stats.pendingOrders}
                                prefix={<ClockCircleOutlined />}
                                valueStyle={{ color: '#fa8c16' }}
                            />
                        </Card>
                    </Col>
                </Row>
            )}

            {/* Tables */}
            <Row gutter={[16, 16]}>
                <Col xs={24} lg={14}>
                    <Card title="Đơn hàng gần đây" bordered={false}>
                        <Table
                            dataSource={recentOrders}
                            columns={orderColumns}
                            rowKey="id"
                            pagination={false}
                            scroll={{ x: 800 }}
                        />
                    </Card>
                </Col>
                <Col xs={24} lg={10}>
                    <Card title="Món ăn bán chạy" bordered={false}>
                        <Table
                            dataSource={popularItems}
                            columns={popularItemColumns}
                            rowKey="name"
                            pagination={false}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default AdminDashboardPage;
