import React, { useState, useEffect } from 'react';
import { Table, Button, Card, Space, Input, Tag, Modal, Form, InputNumber, DatePicker, message, Popconfirm, Typography } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, GiftOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { Promotion } from '../../types/Promotion';
import * as promotionService from '../../services/promotion.service';
import dayjs from 'dayjs';

const { Search } = Input;
const { RangePicker } = DatePicker;
const { Title } = Typography;
const { TextArea } = Input;

const PromotionManagementPage: React.FC = () => {
    const [promotions, setPromotions] = useState<Promotion[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingItem, setEditingItem] = useState<Promotion | null>(null);
    const [form] = Form.useForm();

    useEffect(() => {
        loadAllPromotions();
    }, []);

    // Load all promotions from API
    const loadAllPromotions = async () => {
        setLoading(true);
        try {
            console.log('[PromotionManagementPage] Loading all promotions...');
            const items = await promotionService.getAllPromotions();
            console.log('[PromotionManagementPage] Loaded promotions:', items);
            setPromotions(items);
        } catch (error) {
            console.error('[PromotionManagementPage] Error loading promotions:', error);
            message.error('Không thể tải danh sách mã giảm giá');
        } finally {
            setLoading(false);
        }
    };

    // Search promotions by keyword
    const handleSearch = async (value: string) => {
        setSearchKeyword(value);
        if (!value.trim()) {
            // If search is empty, load all promotions
            await loadAllPromotions();
        } else {
            // Otherwise search
            setLoading(true);
            try {
                console.log('[PromotionManagementPage] Searching with keyword:', value);
                const items = await promotionService.searchPromotions(value);
                console.log('[PromotionManagementPage] Search results:', items);
                setPromotions(items);
            } catch (error) {
                console.error('[PromotionManagementPage] Error searching:', error);
                message.error('Lỗi tìm kiếm');
            } finally {
                setLoading(false);
            }
        }
    };

    const handleCreate = () => {
        setEditingItem(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    const handleEdit = (item: Promotion) => {
        setEditingItem(item);
        form.setFieldsValue({
            code: item.code,
            description: item.description,
            discount: item.discount,
            dateRange: [dayjs(item.startDate), dayjs(item.endDate)],
        });
        setIsModalVisible(true);
    };

    const handleDelete = async (id: number) => {
        try {
            console.log('[PromotionManagementPage] Deleting promotion:', id);
            await promotionService.deletePromotion(id);
            message.success('Xóa mã giảm giá thành công');
            // Reload all promotions after delete
            console.log('[PromotionManagementPage] Reloading promotions after delete...');
            await loadAllPromotions();
            setSearchKeyword('');
        } catch (error) {
            console.error('[PromotionManagementPage] Error deleting:', error);
            message.error('Không thể xóa mã giảm giá');
        }
    };

    const handleSubmit = async (values: {
        code: string;
        description?: string;
        discount: number;
        dateRange: [dayjs.Dayjs, dayjs.Dayjs];
    }) => {
        try {
            console.log('[PromotionManagementPage] Submitting values:', values);

            const payload: promotionService.PromotionCreateRequest = {
                code: values.code,
                description: values.description,
                discount: values.discount,
                startDate: values.dateRange[0].toISOString(),
                endDate: values.dateRange[1].toISOString(),
            };

            if (editingItem) {
                console.log('[PromotionManagementPage] Updating promotion:', editingItem.id);
                await promotionService.updatePromotion(editingItem.id, payload);
                message.success('Cập nhật mã giảm giá thành công');
            } else {
                console.log('[PromotionManagementPage] Creating new promotion');
                await promotionService.createPromotion(payload);
                message.success('Tạo mã giảm giá thành công');
            }

            setIsModalVisible(false);
            // Reload all promotions after create/update
            console.log('[PromotionManagementPage] Reloading promotions after submit...');
            await loadAllPromotions();
            setSearchKeyword('');
        } catch (error) {
            console.error('[PromotionManagementPage] Error submitting:', error);
            message.error(editingItem ? 'Không thể cập nhật mã giảm giá' : 'Không thể tạo mã giảm giá');
        }
    };

    const columns: ColumnsType<Promotion> = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 60,
        },
        {
            title: 'Mã giảm giá',
            dataIndex: 'code',
            key: 'code',
            render: (code: string) => (
                <Tag color="blue" className="font-mono">
                    {code}
                </Tag>
            ),
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
            render: (description: string) => description || <span className="text-gray-400">Không có</span>,
        },
        {
            title: 'Giảm giá',
            dataIndex: 'discount',
            key: 'discount',
            render: (discount: number) => (
                <Tag color="green">
                    {discount}%
                </Tag>
            ),
            width: 100,
        },
        {
            title: 'Ngày bắt đầu',
            dataIndex: 'startDate',
            key: 'startDate',
            render: (startDate: string) => dayjs(startDate).format('DD/MM/YYYY'),
            width: 120,
        },
        {
            title: 'Ngày kết thúc',
            dataIndex: 'endDate',
            key: 'endDate',
            render: (endDate: string) => dayjs(endDate).format('DD/MM/YYYY'),
            width: 120,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (_, record) => {
                const now = dayjs();
                const endDate = dayjs(record.endDate);
                const isExpired = now.isAfter(endDate);

                return (
                    <Tag color={isExpired ? 'red' : 'green'}>
                        {isExpired ? 'Hết hạn' : 'Đang hoạt động'}
                    </Tag>
                );
            },
            width: 120,
        },
        {
            title: 'Hành động',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button
                        type="text"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                        size="small"
                    >
                        Sửa
                    </Button>
                    <Popconfirm
                        title="Bạn có chắc chắn muốn xóa mã giảm giá này?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Xóa"
                        cancelText="Hủy"
                        okType="danger"
                    >
                        <Button
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                            size="small"
                        >
                            Xóa
                        </Button>
                    </Popconfirm>
                </Space>
            ),
            width: 120,
        },
    ];

    return (
        <div className="p-6">
            <Card
                title={
                    <Space>
                        <GiftOutlined />
                        <Title level={4} style={{ margin: 0 }}>
                            Quản lý mã giảm giá
                        </Title>
                    </Space>
                }
                extra={
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
                        Tạo mã giảm giá
                    </Button>
                }
            >
                <div className="mb-4">
                    <Search
                        placeholder="Tìm kiếm mã giảm giá..."
                        allowClear
                        enterButton={<SearchOutlined />}
                        size="large"
                        onSearch={handleSearch}
                        onChange={(e) => {
                            if (!e.target.value) {
                                handleSearch('');
                            }
                        }}
                        value={searchKeyword}
                    />
                </div>

                <Table
                    columns={columns}
                    dataSource={promotions}
                    loading={loading}
                    rowKey="id"
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) =>
                            `${range[0]}-${range[1]} của ${total} mã giảm giá`,
                    }}
                    scroll={{ x: 800 }}
                />
            </Card>

            {/* Create/Edit Modal */}
            <Modal
                title={editingItem ? 'Chỉnh sửa mã giảm giá' : 'Tạo mã giảm giá mới'}
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
                width={600}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    autoComplete="off"
                >
                    <Form.Item
                        name="code"
                        label="Mã giảm giá"
                        rules={[
                            { required: true, message: 'Vui lòng nhập mã giảm giá' },
                            { min: 3, message: 'Mã giảm giá phải có ít nhất 3 ký tự' },
                            { max: 20, message: 'Mã giảm giá không được quá 20 ký tự' },
                            { pattern: /^[A-Z0-9]+$/, message: 'Mã chỉ được chứa chữ hoa và số' },
                        ]}
                    >
                        <Input
                            placeholder="VD: SUMMER2024"
                            style={{ textTransform: 'uppercase' }}
                            onChange={(e) => {
                                const value = e.target.value.toUpperCase();
                                form.setFieldValue('code', value);
                            }}
                        />
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label="Mô tả"
                    >
                        <TextArea
                            placeholder="Mô tả về mã giảm giá (tùy chọn)"
                            rows={3}
                            maxLength={200}
                        />
                    </Form.Item>

                    <Form.Item
                        name="discount"
                        label="Phần trăm giảm giá (%)"
                        rules={[
                            { required: true, message: 'Vui lòng nhập phần trăm giảm giá' },
                            { type: 'number', min: 1, max: 100, message: 'Giảm giá phải từ 1% đến 100%' },
                        ]}
                    >
                        <InputNumber
                            placeholder="VD: 20"
                            style={{ width: '100%' }}
                            min={1}
                            max={100}
                            formatter={(value) => `${value}%`}
                            parser={(value) => {
                                const parsed = parseInt(value?.replace('%', '') || '0', 10);
                                return Math.min(Math.max(parsed, 1), 100) as 1 | 100;
                            }}
                        />
                    </Form.Item>

                    <Form.Item
                        name="dateRange"
                        label="Thời gian áp dụng"
                        rules={[
                            { required: true, message: 'Vui lòng chọn thời gian áp dụng' },
                        ]}
                    >
                        <RangePicker
                            style={{ width: '100%' }}
                            format="DD/MM/YYYY"
                            placeholder={['Ngày bắt đầu', 'Ngày kết thúc']}
                            disabledDate={(current) => {
                                // Disable past dates
                                return current && current < dayjs().startOf('day');
                            }}
                        />
                    </Form.Item>

                    <Form.Item>
                        <Space>
                            <Button type="primary" htmlType="submit">
                                {editingItem ? 'Cập nhật' : 'Tạo mới'}
                            </Button>
                            <Button onClick={() => setIsModalVisible(false)}>
                                Hủy
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default PromotionManagementPage;