import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Card,
  Space,
  Input,
  Tag,
  Modal,
  Form,
  InputNumber,
  Select,
  message,
  Popconfirm,
} from 'antd';
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
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

  const loadAllMenuItems = async () => {
    setLoading(true);
    try {
      const items = await menuService.getAllMenuItems();
      setMenuItems(items);
    } catch {
      message.error('Không thể tải danh sách món ăn');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (value: string) => {
    setSearchKeyword(value);
    if (!value.trim()) {
      await loadAllMenuItems();
    } else {
      setLoading(true);
      try {
        const items = await menuService.searchMenuItems(value);
        setMenuItems(items);
      } catch {
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
      await menuService.deleteMenuItem(id);
      message.success('Xóa món ăn thành công');
      await loadAllMenuItems();
    } catch {
      message.error('Không thể xóa món ăn');
    }
  };

  const handleSubmit = async (values: menuService.MenuItemCreateRequest) => {
    try {
      if (editingItem) {
        await menuService.updateMenuItem(editingItem.id, values);
        message.success('Cập nhật món ăn thành công');
      } else {
        await menuService.createMenuItem(values);
        message.success('Tạo món ăn thành công');
      }
      setIsModalVisible(false);
      await loadAllMenuItems();
    } catch {
      message.error('Có lỗi xảy ra');
    }
  };

  const columns: ColumnsType<MenuItem> = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 70 },
    {
      title: 'Tên món ăn',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <strong>{text}</strong>,
    },
    { title: 'Mô tả', dataIndex: 'description', key: 'description', ellipsis: true },
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
      render: (category: string) => <Tag color="#F5B7B1">{category}</Tag>,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: MenuItem['status']) => (
        <Tag color={status === 'Available' ? '#52c41a' : '#ff4d4f'}>
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
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            className="text-red-600 hover:text-red-800"
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc muốn xóa món ăn này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-8 min-h-screen bg-[#FFE0E0]">
      <Card
        className="shadow-xl rounded-2xl border-0 bg-white/95 backdrop-blur"
        title={
          <h1 className="text-3xl font-extrabold text-center text-[#C0392B]">
            🍽️ Quản lý thực đơn
          </h1>
        }
      >
        <div className="flex justify-between items-center mb-6">
          <Search
            placeholder="Tìm kiếm món ăn..."
            allowClear
            enterButton={
              <Button
                style={{
                  backgroundColor: '#FADBD8',
                  color: '#C0392B',
                  border: 'none',
                  borderRadius: 10,
                  fontWeight: 600,
                  boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                  transition: '0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F5B7B1')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FADBD8')}
              >
                <SearchOutlined />
              </Button>
            }
            size="large"
            value={searchKeyword}
            onChange={(e) => handleSearch(e.target.value)}
            style={{
              width: 400,
              backgroundColor: '#FDEDEC',
              borderRadius: 12,
              border: 'none',
              padding: '6px 10px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
              transition: 'all 0.2s',
            }}
          />

          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            onClick={handleCreate}
            style={{
              backgroundColor: '#F5B7B1',
              color: '#C0392B',
              border: 'none',
              fontWeight: 600,
              borderRadius: 10,
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
            }}
          >
            Thêm món ăn
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={menuItems}
          loading={loading}
          rowKey="id"
          className="rounded-lg shadow-sm"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `Tổng ${total} món ăn`,
          }}
        />
      </Card>

      <Modal
        title={
          <span className="text-xl font-bold text-[#C0392B]">
            {editingItem ? 'Cập nhật món ăn' : 'Thêm món ăn mới'}
          </span>
        }
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={600}
        bodyStyle={{
          backgroundColor: '#FDEDEC',
          borderRadius: 12,
          padding: '24px 30px',
        }}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="name"
            label="Tên món ăn"
            rules={[{ required: true, message: 'Vui lòng nhập tên món ăn' }]}
          >
            <Input placeholder="Nhập tên món ăn" style={{ borderRadius: 8 }} />
          </Form.Item>

          <Form.Item name="description" label="Mô tả">
            <Input.TextArea
              rows={3}
              placeholder="Mô tả món ăn"
              style={{ borderRadius: 8 }}
            />
          </Form.Item>

          <Form.Item
            name="price"
            label="Giá"
            rules={[
              { required: true, message: 'Vui lòng nhập giá' },
              { type: 'number', min: 0.01, message: 'Giá phải lớn hơn 0' },
            ]}
          >
            <InputNumber
              style={{ width: '100%', borderRadius: 8 }}
              placeholder="0.00"
              formatter={(value) =>
                `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              }
              parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
            />
          </Form.Item>

          <Form.Item
            name="category"
            label="Danh mục"
            rules={[{ required: true, message: 'Vui lòng chọn danh mục' }]}
          >
            <Select placeholder="Chọn danh mục" style={{ borderRadius: 8 }}>
              <Option value="Appetizer">Khai vị</Option>
              <Option value="Main Course">Món chính</Option>
              <Option value="Dessert">Tráng miệng</Option>
              <Option value="Beverage">Đồ uống</Option>
              <Option value="Salad">Salad</Option>
              <Option value="Soup">Soup</Option>
            </Select>
          </Form.Item>

          <Form.Item className="mb-0 text-center">
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                style={{
                  backgroundColor: '#F5B7B1',
                  color: '#C0392B',
                  border: 'none',
                  fontWeight: 600,
                  borderRadius: 10,
                  padding: '6px 20px',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                }}
              >
                {editingItem ? 'Cập nhật' : 'Tạo mới'}
              </Button>
              <Button onClick={() => setIsModalVisible(false)}>Hủy</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MenuManagementPage;
