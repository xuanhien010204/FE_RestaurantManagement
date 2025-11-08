import React from 'react';
import { Card, Row, Col, Button, Timeline, Tag } from 'antd';
import {
    ShoppingOutlined,
    CreditCardOutlined,
    CalendarOutlined,
    MessageOutlined,
    UserOutlined,
    ClockCircleOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../redux/app/hook';

// Customer homepage with personal dashboard
const CustomerHomePage: React.FC = () => {
    const navigate = useNavigate();
    const user = useAppSelector(state => state.auth.user);

    return (
        <div className="p-6">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-8 rounded-lg mb-6 shadow-lg">
                <h1 className="text-3xl font-bold mb-2">Xin chào, {user?.fullName}!</h1>
                <p className="text-orange-100">Chào mừng bạn đến với Thuyền Quán</p>
            </div>

            {/* Quick Stats */}
            <Row gutter={[16, 16]} className="mb-6">
                <Col xs={24} sm={12} lg={6}>
                    <Card className="text-center hover:shadow-lg transition-shadow">
                        <ShoppingOutlined className="text-4xl text-blue-600 mb-2" />
                        <div className="text-2xl font-bold text-gray-800">12</div>
                        <div className="text-gray-600">Đơn hàng</div>
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card className="text-center hover:shadow-lg transition-shadow">
                        <CreditCardOutlined className="text-4xl text-green-600 mb-2" />
                        <div className="text-2xl font-bold text-gray-800">$458</div>
                        <div className="text-gray-600">Tổng chi tiêu</div>
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card className="text-center hover:shadow-lg transition-shadow">
                        <CalendarOutlined className="text-4xl text-purple-600 mb-2" />
                        <div className="text-2xl font-bold text-gray-800">3</div>
                        <div className="text-gray-600">Đặt bàn</div>
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card className="text-center hover:shadow-lg transition-shadow">
                        <MessageOutlined className="text-4xl text-orange-600 mb-2" />
                        <div className="text-2xl font-bold text-gray-800">5</div>
                        <div className="text-gray-600">Đánh giá</div>
                    </Card>
                </Col>
            </Row>

            {/* Quick Actions */}
            <div className="mb-4">
                <h2 className="text-2xl font-bold mb-4">Thao tác nhanh</h2>
            </div>

            <Row gutter={[16, 16]} className="mb-6">
                <Col xs={24} sm={12} lg={6}>
                    <Card
                        hoverable
                        className="text-center"
                        onClick={() => navigate('/customer/orders')}
                    >
                        <ShoppingOutlined className="text-4xl text-blue-600 mb-3" />
                        <h3 className="text-lg font-semibold mb-2">Đơn hàng</h3>
                        <p className="text-gray-600 text-sm">Xem đơn của tôi</p>
                    </Card>
                </Col>

                <Col xs={24} sm={12} lg={6}>
                    <Card
                        hoverable
                        className="text-center"
                        onClick={() => navigate('/customer/payments')}
                    >
                        <CreditCardOutlined className="text-4xl text-green-600 mb-3" />
                        <h3 className="text-lg font-semibold mb-2">Thanh toán</h3>
                        <p className="text-gray-600 text-sm">Lịch sử giao dịch</p>
                    </Card>
                </Col>

                <Col xs={24} sm={12} lg={6}>
                    <Card
                        hoverable
                        className="text-center"
                        onClick={() => navigate('/customer/reservations')}
                    >
                        <CalendarOutlined className="text-4xl text-purple-600 mb-3" />
                        <h3 className="text-lg font-semibold mb-2">Đặt bàn</h3>
                        <p className="text-gray-600 text-sm">Quản lý đặt bàn</p>
                    </Card>
                </Col>

                <Col xs={24} sm={12} lg={6}>
                    <Card
                        hoverable
                        className="text-center"
                        onClick={() => navigate('/customer/feedback')}
                    >
                        <MessageOutlined className="text-4xl text-orange-600 mb-3" />
                        <h3 className="text-lg font-semibold mb-2">Đánh giá</h3>
                        <p className="text-gray-600 text-sm">Gửi phản hồi</p>
                    </Card>
                </Col>
            </Row>

            {/* Recent Orders & Profile */}
            <Row gutter={[16, 16]}>
                <Col xs={24} lg={14}>
                    <Card title="Đơn hàng gần đây" extra={<a onClick={() => navigate('/customer/orders')}>Xem tất cả</a>}>
                        <Timeline
                            items={[
                                {
                                    dot: <ClockCircleOutlined className="text-blue-600" />,
                                    children: (
                                        <div className="pb-4">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="font-semibold">Đơn hàng #1234</p>
                                                    <p className="text-gray-600 text-sm">2 món - $45.50</p>
                                                </div>
                                                <Tag color="blue">Đang xử lý</Tag>
                                            </div>
                                            <p className="text-gray-500 text-xs mt-1">Hôm nay, 10:30</p>
                                        </div>
                                    ),
                                },
                                {
                                    dot: <ClockCircleOutlined className="text-green-600" />,
                                    children: (
                                        <div className="pb-4">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="font-semibold">Đơn hàng #1233</p>
                                                    <p className="text-gray-600 text-sm">3 món - $67.80</p>
                                                </div>
                                                <Tag color="green">Hoàn thành</Tag>
                                            </div>
                                            <p className="text-gray-500 text-xs mt-1">Hôm qua, 19:45</p>
                                        </div>
                                    ),
                                },
                                {
                                    dot: <ClockCircleOutlined className="text-green-600" />,
                                    children: (
                                        <div className="pb-4">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="font-semibold">Đơn hàng #1232</p>
                                                    <p className="text-gray-600 text-sm">1 món - $28.90</p>
                                                </div>
                                                <Tag color="green">Hoàn thành</Tag>
                                            </div>
                                            <p className="text-gray-500 text-xs mt-1">2 ngày trước, 12:15</p>
                                        </div>
                                    ),
                                },
                            ]}
                        />
                    </Card>
                </Col>

                <Col xs={24} lg={10}>
                    <Card title="Thông tin tài khoản" className="mb-4">
                        <div className="space-y-4">
                            <div className="flex items-center">
                                <UserOutlined className="text-xl text-gray-500 mr-3" />
                                <div>
                                    <div className="text-sm text-gray-600">Họ và tên</div>
                                    <div className="font-semibold">{user?.fullName}</div>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <CreditCardOutlined className="text-xl text-gray-500 mr-3" />
                                <div>
                                    <div className="text-sm text-gray-600">Email</div>
                                    <div className="font-semibold">{user?.email}</div>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <CalendarOutlined className="text-xl text-gray-500 mr-3" />
                                <div>
                                    <div className="text-sm text-gray-600">Thành viên từ</div>
                                    <div className="font-semibold">Tháng 1, 2024</div>
                                </div>
                            </div>
                            <Button
                                type="primary"
                                block
                                icon={<UserOutlined />}
                                onClick={() => navigate('/customer/profile')}
                                className="mt-4"
                            >
                                Chỉnh sửa hồ sơ
                            </Button>
                        </div>
                    </Card>

                    <Card title="Đặt bàn sắp tới">
                        <div className="text-center p-4">
                            <CalendarOutlined className="text-4xl text-gray-400 mb-2" />
                            <p className="text-gray-600 mb-3">Bạn có 1 đặt bàn sắp tới</p>
                            <div className="bg-orange-50 p-3 rounded mb-3">
                                <div className="font-semibold">Bàn số 5</div>
                                <div className="text-sm text-gray-600">Thứ 7, 19:00 - 4 người</div>
                            </div>
                            <Button
                                type="default"
                                block
                                onClick={() => navigate('/customer/reservations')}
                            >
                                Xem chi tiết
                            </Button>
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default CustomerHomePage;
