import React, { useState, useEffect, useCallback } from 'react';
import { Card, Row, Col, Input, Select, Button, Typography, Tag, message, Pagination, Spin } from 'antd';
import { ShoppingCartOutlined, SearchOutlined } from '@ant-design/icons';
import type { MenuItem } from '../../types/MenuItem';
import * as menuItemService from '../../services/menu-item.service';
import { useCart } from '../../context/CartContext';

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;
const { Option } = Select;

const MenuBrowsePage: React.FC = () => {
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(12);
    const [total, setTotal] = useState(0);
    const [categoryFilter, setCategoryFilter] = useState<string>('');
    const [priceSort, setPriceSort] = useState<'asc' | 'desc' | ''>('');

    const { addItem } = useCart();

    const fetchMenuItems = useCallback(async () => {
        setLoading(true);
        try {
            const response = await menuItemService.getPaginatedMenuItems(currentPage, pageSize);

            let items = response.items;

            // Apply category filter
            if (categoryFilter) {
                items = items.filter((item: MenuItem) => item.category === categoryFilter);
            }

            // Apply price sort
            if (priceSort) {
                items = items.sort((a: MenuItem, b: MenuItem) =>
                    priceSort === 'asc' ? a.price - b.price : b.price - a.price
                );
            }

            setMenuItems(items);
            setTotal(response.totalItems);
        } catch (error) {
            message.error('Không thể tải menu');
            console.error('Error fetching menu items:', error);
        } finally {
            setLoading(false);
        }
    }, [currentPage, pageSize, categoryFilter, priceSort]);

    useEffect(() => {
        fetchMenuItems();
    }, [fetchMenuItems]);

    const handleSearch = async (value: string) => {
        if (!value.trim()) {
            fetchMenuItems();
            return;
        }

        setLoading(true);
        try {
            const response = await menuItemService.searchPaginatedMenuItems(value, currentPage, pageSize);
            setMenuItems(response.items);
            setTotal(response.totalItems);
        } catch (error) {
            message.error('Không thể tìm kiếm món ăn');
            console.error('Error searching menu items:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = (item: MenuItem) => {
        addItem(item);
        message.success(`Đã thêm "${item.name}" vào giỏ hàng`);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleCategoryChange = (value: string) => {
        setCategoryFilter(value);
        setCurrentPage(1);
    };

    const handlePriceSort = (value: 'asc' | 'desc' | '') => {
        setPriceSort(value);
    };

    const categories = [
        'Appetizer', 'Main Course', 'Dessert', 'Beverage',
        'Soup', 'Salad', 'Seafood', 'Vegetarian'
    ];

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <Title level={2}>Thực Đơn</Title>
                    <Text type="secondary">Khám phá các món ăn ngon của chúng tôi</Text>
                </div>

                {/* Filters */}
                <Card className="mb-6">
                    <Row gutter={[16, 16]} align="middle">
                        <Col xs={24} md={10}>
                            <Search
                                placeholder="Tìm kiếm món ăn..."
                                allowClear
                                enterButton={<SearchOutlined />}
                                size="large"
                                onSearch={handleSearch}
                                loading={loading}
                            />
                        </Col>
                        <Col xs={12} md={7}>
                            <Select
                                placeholder="Chọn danh mục"
                                style={{ width: '100%' }}
                                size="large"
                                allowClear
                                onChange={handleCategoryChange}
                                value={categoryFilter || undefined}
                            >
                                {categories.map(cat => (
                                    <Option key={cat} value={cat}>{cat}</Option>
                                ))}
                            </Select>
                        </Col>
                        <Col xs={12} md={7}>
                            <Select
                                placeholder="Sắp xếp theo giá"
                                style={{ width: '100%' }}
                                size="large"
                                allowClear
                                onChange={handlePriceSort}
                                value={priceSort || undefined}
                            >
                                <Option value="asc">Giá: Thấp đến Cao</Option>
                                <Option value="desc">Giá: Cao đến Thấp</Option>
                            </Select>
                        </Col>
                    </Row>
                </Card>

                {/* Menu Items Grid */}
                {loading ? (
                    <div className="text-center py-20">
                        <Spin size="large" tip="Đang tải menu..." />
                    </div>
                ) : (
                    <>
                        <Row gutter={[24, 24]}>
                            {menuItems.map(item => (
                                <Col xs={24} sm={12} md={8} lg={6} key={item.id}>
                                    <Card
                                        hoverable
                                        cover={
                                            <div className="h-48 bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                                                <Text className="text-6xl">🍽️</Text>
                                            </div>
                                        }
                                        actions={[
                                            <Button
                                                type="primary"
                                                icon={<ShoppingCartOutlined />}
                                                onClick={() => handleAddToCart(item)}
                                                className="w-full"
                                            >
                                                Thêm vào giỏ
                                            </Button>
                                        ]}
                                    >
                                        <Card.Meta
                                            title={
                                                <div className="flex justify-between items-start">
                                                    <Text strong className="text-lg">{item.name}</Text>
                                                </div>
                                            }
                                            description={
                                                <div className="space-y-2">
                                                    <Paragraph
                                                        ellipsis={{ rows: 2 }}
                                                        className="text-gray-600 mb-2"
                                                    >
                                                        {item.description || 'Món ăn đặc biệt'}
                                                    </Paragraph>
                                                    <div className="flex justify-between items-center">
                                                        <Tag color="blue">{item.category}</Tag>
                                                        <Text strong className="text-xl text-orange-500">
                                                            {item.price.toLocaleString('vi-VN')}đ
                                                        </Text>
                                                    </div>
                                                </div>
                                            }
                                        />
                                    </Card>
                                </Col>
                            ))}
                        </Row>

                        {menuItems.length === 0 && !loading && (
                            <div className="text-center py-20">
                                <Text type="secondary" className="text-lg">
                                    Không tìm thấy món ăn nào
                                </Text>
                            </div>
                        )}

                        {/* Pagination */}
                        {total > pageSize && (
                            <div className="flex justify-center mt-8">
                                <Pagination
                                    current={currentPage}
                                    total={total}
                                    pageSize={pageSize}
                                    onChange={handlePageChange}
                                    showSizeChanger={false}
                                    showTotal={(total) => `Tổng ${total} món`}
                                />
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default MenuBrowsePage;
