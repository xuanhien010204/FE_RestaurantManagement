import React, { useState, useEffect } from 'react';
import { Table, Button, Card, Space, Input, Tag, Modal, Form, InputNumber, Select, message, Popconfirm } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { MenuItem } from '../../types/MenuItem';
import * as menuService from '../../services/menu-item.service';

const { Search } = Input;
const { Option } = Select;

const MenuManagementPage: React.FC = () => {
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
    const [form] = Form.useForm();

    useEffect(() => {
        loadAllMenuItems();
    }, []);

    // Load all menu items from API
    const loadAllMenuItems = async () => {
        setLoading(true);
        try {
            console.log('[MenuManagementPage] Loading all menu items...');
            const items = await menuService.getAllMenuItems();
            console.log('[MenuManagementPage] Loaded items:', items);
            setMenuItems(items);
        } catch (error) {
            console.error('[MenuManagementPage] Error loading all items:', error);
            message.error('Không thể tải danh sách món ăn');
        } finally {
            setLoading(false);
        }
    };

    // Search menu items by keyword
    const handleSearch = async (value: string) => {
        setSearchKeyword(value);
        if (!value.trim()) {
            // If search is empty, load all items
            await loadAllMenuItems();
        } else {
            // Otherwise search
            setLoading(true);
            try {
                console.log('[MenuManagementPage] Searching with keyword:', value);
                const items = await menuService.searchMenuItems(value);
                console.log('[MenuManagementPage] Search results:', items);
                setMenuItems(items);
            } catch (error) {
                console.error('[MenuManagementPage] Error searching:', error);
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

    const handleEdit = (item: MenuItem) => {
        setEditingItem(item);
        form.setFieldsValue({
            name: item.name,
            description: item.description,
            price: item.price,
            category: item.category,
        });
        setIsModalVisible(true);
    };

    const handleDelete = async (id: number) => {
        try {
            console.log('[MenuManagementPage] Deleting item:', id);
            await menuService.deleteMenuItem(id);
            message.success('Xóa món ăn thành công');
            // Reload all items after delete
            console.log('[MenuManagementPage] Reloading menu items after delete...');
            await loadAllMenuItems();
            setSearchKeyword('');
        } catch (error) {
            console.error('[MenuManagementPage] Error deleting:', error);
            message.error('Không thể xóa món ăn');
        }
    };

    const handleSubmit = async (values: menuService.MenuItemCreateRequest) => {
        try {
            console.log('[MenuManagementPage] Submitting values:', values);
            if (editingItem) {
                console.log('[MenuManagementPage] Updating item:', editingItem.id);
                await menuService.updateMenuItem(editingItem.id, values);
                message.success('Cập nhật món ăn thành công');
            } else {
                console.log('[MenuManagementPage] Creating new item');
                const newItem = await menuService.createMenuItem(values);
                console.log('[MenuManagementPage] Created item:', newItem);
                message.success('Tạo món ăn thành công');
            }
            setIsModalVisible(false);
            // Reload all items after submit
            console.log('[MenuManagementPage] Reloading menu items...');
            await loadAllMenuItems();
            setSearchKeyword('');
        } catch (error) {
            console.error('[MenuManagementPage] Error submitting:', error);
            const errorMessage = error instanceof Error ? error.message : 'Có lỗi xảy ra';
            message.error(`Lỗi: ${errorMessage}`);
        }
    };

    const columns: ColumnsType<MenuItem> = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 70,
        },
        {
            title: 'Tên món ăn',
            dataIndex: 'name',
            key: 'name',
            render: (text: string) => <strong>{text}</strong>,
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
            ellipsis: true,
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            key: 'price',
            render: (price: number) => `$${price.toFixed(2)}`,
            sorter: (a, b) => a.price - b.price,
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
            render: (status: MenuItem['status']) => (
                <Tag color={status === 'Available' ? 'green' : 'red'}>
                    {status === 'Available' ? 'Có sẵn' : 'Hết hàng'}
                </Tag>
            ),
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
                        title="Bạn có chắc muốn xóa món ăn này?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Có"
                        cancelText="Không"
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
        },
    ];

    return (
        <div className="p-6">
            <Card title="Quản lý thực đơn" className="mb-6">
                <div className="flex justify-between items-center mb-4">
                    <Search
                        placeholder="Tìm kiếm món ăn..."
                        allowClear
                        enterButton={<SearchOutlined />}
                        size="large"
                        value={searchKeyword}
                        onChange={(e) => handleSearch(e.target.value)}
                        style={{ width: 400 }}
                    />
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        size="large"
                        onClick={handleCreate}
                    >
                        Thêm món ăn
                    </Button>
                </div>

                <Table
                    columns={columns}
                    dataSource={menuItems}
                    loading={loading}
                    rowKey="id"
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total) => `Tổng ${total} món ăn`,
                    }}
                />
            </Card>

            <Modal
                title={editingItem ? 'Cập nhật món ăn' : 'Thêm món ăn mới'}
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
                width={600}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                >
                    <Form.Item
                        name="name"
                        label="Tên món ăn"
                        rules={[{ required: true, message: 'Vui lòng nhập tên món ăn' }]}
                    >
                        <Input placeholder="Nhập tên món ăn" />
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label="Mô tả"
                    >
                        <Input.TextArea rows={3} placeholder="Mô tả món ăn" />
                    </Form.Item>

                    <Form.Item
                        name="price"
                        label="Giá"
                        rules={[
                            { required: true, message: 'Vui lòng nhập giá' },
                            { type: 'number', min: 0.01, message: 'Giá phải lớn hơn 0' }
                        ]}
                    >
                        <InputNumber
                            style={{ width: '100%' }}
                            placeholder="0.00"
                            formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={value => value!.replace(/\$\s?|(,*)/g, '')}
                        />
                    </Form.Item>

                    <Form.Item
                        name="category"
                        label="Danh mục"
                        rules={[{ required: true, message: 'Vui lòng chọn danh mục' }]}
                    >
                        <Select placeholder="Chọn danh mục">
                            <Option value="Appetizer">Khai vị</Option>
                            <Option value="Main Course">Món chính</Option>
                            <Option value="Dessert">Tráng miệng</Option>
                            <Option value="Beverage">Đồ uống</Option>
                            <Option value="Salad">Salad</Option>
                            <Option value="Soup">Soup</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item className="mb-0">
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

export default MenuManagementPage;