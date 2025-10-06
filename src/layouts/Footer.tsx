import React from "react";
import { Layout, Typography, Space, Divider } from "antd";
import { HeartFilled } from "@ant-design/icons";

const { Footer: AntFooter } = Layout;
const { Text, Link } = Typography;

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    return (
        <AntFooter className="bg-gray-50 border-t border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-8">
                    {/* About Section */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900">Nhà Hàng ABC</h3>
                        <p className="text-gray-600 text-sm">
                            Hệ thống quản lý nhà hàng hiện đại, mang đến trải nghiệm ẩm thực tuyệt vời
                            với dịch vụ chuyên nghiệp.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h4 className="text-md font-medium text-gray-900">Liên kết nhanh</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/">Trang chủ</Link></li>
                            <li><Link href="/menu">Thực đơn</Link></li>
                            <li><Link href="/reservations">Đặt bàn</Link></li>
                            <li><Link href="/contact">Liên hệ</Link></li>
                        </ul>
                    </div>

                    {/* Services */}
                    <div className="space-y-4">
                        <h4 className="text-md font-medium text-gray-900">Dịch vụ</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Text type="secondary">Đặt bàn trực tuyến</Text></li>
                            <li><Text type="secondary">Giao hàng tận nơi</Text></li>
                            <li><Text type="secondary">Tổ chức sự kiện</Text></li>
                            <li><Text type="secondary">Catering</Text></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-4">
                        <h4 className="text-md font-medium text-gray-900">Thông tin liên hệ</h4>
                        <div className="space-y-2 text-sm text-gray-600">
                            <p>📍 194 Đường Xuân Diệu, Quy Nhơn, Gia Lai</p>
                            <p>📞 (028) 1234 5678</p>
                            <p>✉️ ThuyenQuan@restaurant-abc.com</p>
                            <p>🕒 Mở cửa: 09:00 - 22:00</p>
                        </div>
                    </div>
                </div>

                <Divider className="my-4" />

                {/* Bottom Section */}
                <div className="flex flex-col md:flex-row justify-between items-center py-4 text-sm text-gray-500">
                    <Space align="center">
                        <Text type="secondary">
                            © {currentYear} Restaurant Management System.
                        </Text>
                        <Text type="secondary">
                            Made with <HeartFilled className="text-red-500 mx-1" /> by Development Team
                        </Text>
                    </Space>

                    <Space className="mt-4 md:mt-0">
                        <Link href="/privacy" className="text-gray-500 hover:text-gray-700">
                            Chính sách bảo mật
                        </Link>
                        <Link href="/terms" className="text-gray-500 hover:text-gray-700">
                            Điều khoản sử dụng
                        </Link>
                    </Space>
                </div>
            </div>
        </AntFooter>
    );
};

export default Footer;
