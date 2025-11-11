import React, { useEffect, useState } from 'react';
import { Table, Card, Tag, Input, Select, Row, Col, Image, Typography } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import * as menuItemService from '../../services/menu-item.service';
import type { MenuItem, MenuItemStatus } from '../../types/MenuItem';

const { Title } = Typography;
const { Option } = Select;

const StaffMenuViewPage: React.FC = () => {
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [categories, setCategories] = useState<string[]>([]);

    useEffect(() => {
        fetchMenuItems();
    }, []);

    useEffect(() => {
        filterItems();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchKeyword, selectedCategory, menuItems]);

    const fetchMenuItems = async () => {
        setLoading(true);
        try {
            const data = await menuItemService.getAllMenuItems();
            setMenuItems(data);

            // Extract unique categories
            const uniqueCats = Array.from(
                new Set(data.map((item) => item.category).filter(Boolean) as string[])
            );
            setCategories(uniqueCats);
            setFilteredItems(data);
        } catch (error) {
            console.error('Error fetching menu items:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterItems = () => {
        let filtered = [...menuItems];

        if (selectedCategory) {
            filtered = filtered.filter((item) => item.category === selectedCategory);
        }

        if (searchKeyword) {
            const keyword = searchKeyword.toLowerCase();
            filtered = filtered.filter(
                (item) =>
                    item.name.toLowerCase().includes(keyword) ||
                    item.description?.toLowerCase().includes(keyword)
            );
        }

        setFilteredItems(filtered);
    };

    const getStatusColor = (status: MenuItemStatus): string => {
        return status === 'Available' ? 'green' : 'red';
    };

    const columns = [
        {
            title: 'Hình ảnh',
            dataIndex: 'images',
            key: 'images',
            width: 100,
            render: (images: MenuItem['images']) => {
                const imageUrl = images && images.length > 0 ? images[0].imageUrl : undefined;
                return imageUrl ? (
                    <Image src={imageUrl} alt="Menu item" width={60} height={60} style={{ objectFit: 'cover' }} />
                ) : (
                    <div
                        style={{
                            width: 60,
                            height: 60,
                            backgroundColor: '#f0f0f0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '24px',
                        }}
                    >
                        🍲
                    </div>
                );
            },
        },
        {
            title: 'Tên món',
            dataIndex: 'name',
            key: 'name',
            width: 200,
            render: (name: string) => <strong>{name}</strong>,
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
            ellipsis: true,
        },
        {
            title: 'Danh mục',
            dataIndex: 'category',
            key: 'category',
            width: 120,
            render: (category: string) => <Tag color="blue">{category || 'N/A'}</Tag>,
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            key: 'price',
            width: 120,
            render: (price: number) => (
                <strong style={{ color: '#1890ff' }}>{price.toLocaleString('vi-VN')}đ</strong>
            ),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            width: 120,
            render: (status: MenuItemStatus) => (
                <Tag color={getStatusColor(status)}>
                    {status === 'Available' ? 'Còn hàng' : 'Hết hàng'}
                </Tag>
            ),
        },
    ];

    return (
        <div className="p-6">
            <Title level={2}>Thực Đơn</Title>

            <Card className="mb-4">
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12} md={8}>
                        <Input
                            placeholder="Tìm kiếm món ăn..."
                            prefix={<SearchOutlined />}
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                            allowClear
                        />
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                        <Select
                            placeholder="Chọn danh mục"
                            value={selectedCategory || undefined}
                            onChange={(value) => setSelectedCategory(value || '')}
                            allowClear
                            style={{ width: '100%' }}
                        >
                            {categories.map((cat) => (
                                <Option key={cat} value={cat}>
                                    {cat}
                                </Option>
                            ))}
                        </Select>
                    </Col>
                    <Col xs={24} sm={24} md={8}>
                        <div className="text-gray-600">
                            Hiển thị {filteredItems.length} / {menuItems.length} món
                        </div>
                    </Col>
                </Row>
            </Card>

            <Card>
                <Table
                    columns={columns}
                    dataSource={filteredItems}
                    rowKey="id"
                    loading={loading}
                    scroll={{ x: 1000 }}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showTotal: (total) => `Tổng ${total} món`,
                    }}
                />
            </Card>
        </div>
    );
};

export default StaffMenuViewPage;
