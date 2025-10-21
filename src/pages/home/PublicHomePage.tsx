import React from "react";
import { Row, Col, Card, Button, Typography, Space } from "antd";
import {
    CalendarOutlined,
    ShoppingCartOutlined,
    StarOutlined,
    PhoneOutlined,
    ClockCircleOutlined,
    EnvironmentOutlined,
    CrownOutlined,
    TeamOutlined
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

const { Title, Paragraph, Text } = Typography;

const PublicHomePage: React.FC = () => {
    const { isAuthenticated, user } = useAuth();

    const features = [
        {
            icon: <CalendarOutlined className="text-3xl text-blue-500" />,
            title: "Đặt bàn trực tuyến",
            description: "Đặt bàn nhanh chóng và tiện lợi chỉ với vài click chuột",
            action: isAuthenticated ? (
                <Button type="primary">
                    <Link to="/reservations">Đặt bàn ngay</Link>
                </Button>
            ) : (
                <Button type="primary">
                    <Link to="/login">Đăng nhập để đặt bàn</Link>
                </Button>
            )
        },
        {
            icon: <ShoppingCartOutlined className="text-3xl text-green-500" />,
            title: "Giao hàng tận nơi",
            description: "Thưởng thức món ăn ngon tại nhà với dịch vụ giao hàng nhanh chóng",
            action: isAuthenticated ? (
                <Button type="default">
                    <Link to="/orders">Đặt món ngay</Link>
                </Button>
            ) : (
                <Button type="default">
                    <Link to="/register">Đăng ký để đặt món</Link>
                </Button>
            )
        },
        {
            icon: <StarOutlined className="text-3xl text-yellow-500" />,
            title: "Chất lượng 5 sao",
            description: "Cam kết mang đến những món ăn chất lượng cao với dịch vụ tận tâm",
            action: (
                <Button type="default">
                    <Link to="/menu">Xem thực đơn</Link>
                </Button>
            )
        }
    ];

    const stats = [
        { label: "Khách hàng hài lòng", value: "10,000+", icon: <TeamOutlined /> },
        { label: "Món ăn đa dạng", value: "200+", icon: <CrownOutlined /> },
        { label: "Năm phục vụ", value: "15+", icon: <StarOutlined /> },
        { label: "Chi nhánh", value: "5", icon: <EnvironmentOutlined /> }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="text-center">
                        <Title level={1} className="text-white mb-4">
                            Chào mừng đến với Nhà Hàng Thuyền Quán
                        </Title>
                        <Paragraph className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
                            Trải nghiệm ẩm thực tuyệt vời với hệ thống quản lý hiện đại.
                            Đặt bàn, gọi món và thanh toán dễ dàng chỉ với vài thao tác đơn giản.
                        </Paragraph>
                        <Space size="large">
                            {!isAuthenticated ? (
                                <>
                                    <Button type="primary" size="large" className="bg-white text-blue-600 border-white hover:bg-gray-100">
                                        <Link to="/register">Đăng ký ngay</Link>
                                    </Button>
                                    <Button type="primary" size="large" className="bg-white text-blue-600 border-white hover:bg-gray-100">
                                        <Link to="/login">Đăng nhập</Link>
                                    </Button>
                                </>
                            ) : (
                                <Button type="primary" size="large" className="bg-white text-blue-600 border-white hover:bg-gray-100">
                                    <Link to="/reservations">Đặt bàn ngay</Link>
                                </Button>
                            )}
                        </Space>
                    </div>
                </div>
            </div>

            {/* Welcome Message for Authenticated Users */}
            {isAuthenticated && (
                <div className="bg-blue-50 border-b">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <div className="text-center">
                            <Text className="text-blue-800">
                                Xin chào <strong>{user?.fullName}</strong>!
                                Chúc bạn có một trải nghiệm tuyệt vời tại nhà hàng.
                            </Text>
                        </div>
                    </div>
                </div>
            )}

            {/* Features Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center mb-12">
                    <Title level={2}>Dịch vụ nổi bật</Title>
                    <Paragraph className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Khám phá những dịch vụ tuyệt vời mà chúng tôi mang lại cho khách hàng
                    </Paragraph>
                </div>

                <Row gutter={[24, 24]}>
                    {features.map((feature, index) => (
                        <Col xs={24} md={8} key={index}>
                            <Card
                                className="text-center h-full hover:shadow-lg transition-shadow"
                                bodyStyle={{ padding: '2rem' }}
                            >
                                <div className="mb-4">{feature.icon}</div>
                                <Title level={4} className="mb-3">{feature.title}</Title>
                                <Paragraph className="text-gray-600 mb-6">
                                    {feature.description}
                                </Paragraph>
                                {feature.action}
                            </Card>
                        </Col>
                    ))}
                </Row>
            </div>

            {/* Stats Section */}
            <div className="bg-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <Title level={2}>Thành tựu của chúng tôi</Title>
                    </div>
                    <Row gutter={[24, 24]}>
                        {stats.map((stat, index) => (
                            <Col xs={12} md={6} key={index}>
                                <div className="text-center">
                                    <div className="text-3xl text-blue-500 mb-2">{stat.icon}</div>
                                    <Title level={2} className="text-blue-600 mb-1">{stat.value}</Title>
                                    <Text className="text-gray-600">{stat.label}</Text>
                                </div>
                            </Col>
                        ))}
                    </Row>
                </div>
            </div>

            {/* Contact Section */}
            <div className="bg-gray-100 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Row gutter={[48, 24]} align="middle">
                        <Col xs={24} lg={12}>
                            <Title level={2} className="mb-6">Liên hệ với chúng tôi</Title>
                            <Space direction="vertical" size="large" className="w-full">
                                <div className="flex items-center space-x-3">
                                    <EnvironmentOutlined className="text-blue-500 text-xl" />
                                    <div>
                                        <Text strong>Địa chỉ:</Text>
                                        <br />
                                        <Text>194 Xuân Diệu, Phường Quy Nhơn, tỉnh Gia Lai</Text>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <PhoneOutlined className="text-blue-500 text-xl" />
                                    <div>
                                        <Text strong>Điện thoại:</Text>
                                        <br />
                                        <Text>(039) 2818 285</Text>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <ClockCircleOutlined className="text-blue-500 text-xl" />
                                    <div>
                                        <Text strong>Giờ mở cửa:</Text>
                                        <br />
                                        <Text>Hằng ngày: 09:00 - 12:00</Text>
                                    </div>
                                </div>
                            </Space>
                        </Col>
                        <Col xs={24} lg={12}>
                            <Card>
                                <Title level={4} className="mb-4">Gửi tin nhắn cho chúng tôi</Title>
                                <Button type="primary" block size="large">
                                    <Link to="/contact">Liên hệ ngay</Link>
                                </Button>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </div>
        </div>
    );
};

export default PublicHomePage;