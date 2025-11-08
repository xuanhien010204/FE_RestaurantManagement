import React from 'react';
import { Card, Row, Col } from 'antd';
import {
    UserOutlined,
    ShoppingOutlined,
    DollarOutlined,
    FileTextOutlined,
    TeamOutlined,
    CalendarOutlined,
    MessageOutlined,
    TableOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../redux/app/hook';
import { StatCard, QuickActionCard } from '../../components/dashboard';

// Admin homepage with management overview and quick access
const AdminHomePage: React.FC = () => {
    const navigate = useNavigate();
    const user = useAppSelector(state => state.auth.user);

    return (
        <div className="p-6">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-8 rounded-lg mb-6 shadow-lg">
                <h1 className="text-3xl font-bold mb-2">Chào mừng trở lại, {user?.fullName}!</h1>
                <p className="text-red-100">Quản trị viên hệ thống - Bảng điều khiển toàn diện</p>
            </div>

            {/* Statistics Overview */}
            <Row gutter={[16, 16]} className="mb-6">
                <Col xs={24} sm={12} lg={6}>
                    <StatCard
                        title="Tổng đơn hàng"
                        value={1234}
                        icon={<ShoppingOutlined />}
                        iconColor="text-green-600"
                    />
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <StatCard
                        title="Doanh thu tháng"
                        value={45678}
                        icon={<DollarOutlined />}
                        iconColor="text-red-600"
                        suffix="$"
                    />
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <StatCard
                        title="Khách hàng"
                        value={567}
                        icon={<UserOutlined />}
                        iconColor="text-blue-600"
                    />
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <StatCard
                        title="Nhân viên"
                        value={23}
                        icon={<TeamOutlined />}
                        iconColor="text-purple-600"
                    />
                </Col>
            </Row>

            {/* Quick Access Management Cards */}
            <div className="mb-4">
                <h2 className="text-2xl font-bold mb-4">Quản lý nhanh</h2>
            </div>

            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} lg={8}>
                    <QuickActionCard
                        title="Quản lý thực đơn"
                        description="Tạo, chỉnh sửa và quản lý các món ăn"
                        icon={<FileTextOutlined />}
                        iconColor="text-green-600"
                        onClick={() => navigate('/admin/menu')}
                    />
                </Col>

                <Col xs={24} sm={12} lg={8}>
                    <QuickActionCard
                        title="Quản lý đơn hàng"
                        description="Theo dõi và xử lý đơn hàng"
                        icon={<ShoppingOutlined />}
                        iconColor="text-blue-600"
                        onClick={() => navigate('/admin/orders')}
                    />
                </Col>

                <Col xs={24} sm={12} lg={8}>
                    <QuickActionCard
                        title="Quản lý nhân viên"
                        description="Quản lý thông tin nhân viên"
                        icon={<TeamOutlined />}
                        iconColor="text-purple-600"
                        onClick={() => navigate('/admin/staff')}
                    />
                </Col>

                <Col xs={24} sm={12} lg={8}>
                    <QuickActionCard
                        title="Quản lý bàn ăn"
                        description="Sắp xếp và quản lý bàn"
                        icon={<TableOutlined />}
                        iconColor="text-orange-600"
                        onClick={() => navigate('/admin/tables')}
                    />
                </Col>

                <Col xs={24} sm={12} lg={8}>
                    <QuickActionCard
                        title="Quản lý thanh toán"
                        description="Theo dõi giao dịch thanh toán"
                        icon={<DollarOutlined />}
                        iconColor="text-green-600"
                        onClick={() => navigate('/admin/payments')}
                    />
                </Col>

                <Col xs={24} sm={12} lg={8}>
                    <QuickActionCard
                        title="Quản lý đánh giá"
                        description="Xem và phản hồi đánh giá"
                        icon={<MessageOutlined />}
                        iconColor="text-red-600"
                        onClick={() => navigate('/admin/feedback')}
                    />
                </Col>
            </Row>

            {/* System Status */}
            <Card className="mt-6" title="Trạng thái hệ thống">
                <Row gutter={[16, 16]}>
                    <Col span={8}>
                        <div className="text-center">
                            <CalendarOutlined className="text-3xl text-blue-500 mb-2" />
                            <div className="font-semibold">Hôm nay</div>
                            <div className="text-gray-600">{new Date().toLocaleDateString('vi-VN')}</div>
                        </div>
                    </Col>
                    <Col span={8}>
                        <div className="text-center">
                            <ShoppingOutlined className="text-3xl text-green-500 mb-2" />
                            <div className="font-semibold">Đơn hàng đang xử lý</div>
                            <div className="text-gray-600">15 đơn</div>
                        </div>
                    </Col>
                    <Col span={8}>
                        <div className="text-center">
                            <MessageOutlined className="text-3xl text-orange-500 mb-2" />
                            <div className="font-semibold">Đánh giá chờ duyệt</div>
                            <div className="text-gray-600">8 đánh giá</div>
                        </div>
                    </Col>
                </Row>
            </Card>
        </div>
    );
};

export default AdminHomePage;
