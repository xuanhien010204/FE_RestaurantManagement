import React from 'react';
import { Card, Row, Col, Button, Timeline } from 'antd';
import {
    ShoppingOutlined,
    DollarOutlined,
    TableOutlined,
    ClockCircleOutlined,
    CheckCircleOutlined,
    FileTextOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../redux/app/hook';
import { StatCard, QuickActionCard } from '../../components/dashboard';

// Staff homepage with operational dashboard
const StaffHomePage: React.FC = () => {
    const navigate = useNavigate();
    const user = useAppSelector(state => state.auth.user);

    return (
        <div className="p-6">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8 rounded-lg mb-6 shadow-lg">
                <h1 className="text-3xl font-bold mb-2">Xin chào, {user?.fullName}!</h1>
                <p className="text-blue-100">Nhân viên điều hành - Bảng làm việc hôm nay</p>
            </div>

            {/* Today's Statistics */}
            <Row gutter={[16, 16]} className="mb-6">
                <Col xs={24} sm={12} lg={6}>
                    <StatCard
                        title="Đơn hôm nay"
                        value={45}
                        icon={<ShoppingOutlined />}
                        iconColor="text-blue-600"
                    />
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <StatCard
                        title="Đang xử lý"
                        value={12}
                        icon={<ClockCircleOutlined />}
                        iconColor="text-yellow-600"
                    />
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <StatCard
                        title="Hoàn thành"
                        value={33}
                        icon={<CheckCircleOutlined />}
                        iconColor="text-green-600"
                    />
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <StatCard
                        title="Doanh thu"
                        value={2890}
                        icon={<DollarOutlined />}
                        iconColor="text-pink-600"
                        suffix="$"
                    />
                </Col>
            </Row>

            {/* Quick Actions */}
            <div className="mb-4">
                <h2 className="text-2xl font-bold mb-4">Thao tác nhanh</h2>
            </div>

            <Row gutter={[16, 16]} className="mb-6">
                <Col xs={24} sm={12} lg={6}>
                    <QuickActionCard
                        title="Dashboard"
                        description="Xem tổng quan"
                        icon={<FileTextOutlined />}
                        iconColor="text-blue-600"
                        onClick={() => navigate('/staff')}
                    />
                </Col>

                <Col xs={24} sm={12} lg={6}>
                    <QuickActionCard
                        title="Đơn hàng"
                        description="Quản lý đơn"
                        icon={<ShoppingOutlined />}
                        iconColor="text-green-600"
                        onClick={() => navigate('/admin/orders')}
                    />
                </Col>

                <Col xs={24} sm={12} lg={6}>
                    <QuickActionCard
                        title="Bàn ăn"
                        description="Quản lý bàn"
                        icon={<TableOutlined />}
                        iconColor="text-orange-600"
                        onClick={() => navigate('/admin/tables')}
                    />
                </Col>

                <Col xs={24} sm={12} lg={6}>
                    <QuickActionCard
                        title="Thanh toán"
                        description="Tạo thanh toán"
                        icon={<DollarOutlined />}
                        iconColor="text-purple-600"
                        onClick={() => navigate('/admin/payments/create')}
                    />
                </Col>
            </Row>

            {/* Recent Activity */}
            <Row gutter={[16, 16]}>
                <Col xs={24} lg={12}>
                    <Card title="Hoạt động gần đây" className="h-full">
                        <Timeline
                            items={[
                                {
                                    color: 'green',
                                    children: (
                                        <>
                                            <p className="font-semibold">Đơn hàng #1234 đã hoàn thành</p>
                                            <p className="text-gray-500 text-sm">5 phút trước</p>
                                        </>
                                    ),
                                },
                                {
                                    color: 'blue',
                                    children: (
                                        <>
                                            <p className="font-semibold">Đơn hàng #1235 đang xử lý</p>
                                            <p className="text-gray-500 text-sm">10 phút trước</p>
                                        </>
                                    ),
                                },
                                {
                                    color: 'orange',
                                    children: (
                                        <>
                                            <p className="font-semibold">Bàn 5 đã được đặt trước</p>
                                            <p className="text-gray-500 text-sm">15 phút trước</p>
                                        </>
                                    ),
                                },
                                {
                                    color: 'green',
                                    children: (
                                        <>
                                            <p className="font-semibold">Thanh toán #567 thành công</p>
                                            <p className="text-gray-500 text-sm">20 phút trước</p>
                                        </>
                                    ),
                                },
                            ]}
                        />
                    </Card>
                </Col>

                <Col xs={24} lg={12}>
                    <Card title="Trạng thái bàn" className="h-full">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                                <span className="font-semibold">Bàn trống</span>
                                <span className="text-green-600 font-bold">8 bàn</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-red-50 rounded">
                                <span className="font-semibold">Đang sử dụng</span>
                                <span className="text-red-600 font-bold">5 bàn</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-orange-50 rounded">
                                <span className="font-semibold">Đã đặt trước</span>
                                <span className="text-orange-600 font-bold">2 bàn</span>
                            </div>
                            <Button
                                type="primary"
                                block
                                className="mt-4"
                                onClick={() => navigate('/admin/tables')}
                            >
                                Xem tất cả bàn
                            </Button>
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default StaffHomePage;
