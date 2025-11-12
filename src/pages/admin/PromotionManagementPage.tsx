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
  DatePicker,
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
import type { Promotion } from '../../types/Promotion';
import * as promotionService from '../../services/promotion.service';
import dayjs from 'dayjs';

const { Search } = Input;
const { Option } = Select;

const PromotionManagementPage: React.FC = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    loadAllPromotions();
  }, []);

  const loadAllPromotions = async () => {
    setLoading(true);
    try {
      const items = await promotionService.getAllPromotions();
      setPromotions(items);
    } catch {
      message.error('Không thể tải danh sách mã giảm giá');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (value: string) => {
    setSearchKeyword(value);
    if (!value.trim()) {
      await loadAllPromotions();
    } else {
      setLoading(true);
      try {
        const items = await promotionService.searchPromotions(value);
        setPromotions(items);
      } catch {
        message.error('Lỗi tìm kiếm');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCreate = () => {
    setEditingPromotion(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (promo: Promotion) => {
    setEditingPromotion(promo);
    form.setFieldsValue({
      code: promo.code,
      description: promo.description,
      discount: promo.discount,
      startDate: dayjs(promo.startDate),
      endDate: dayjs(promo.endDate),
      status: promo.status,
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await promotionService.deletePromotion(id);
      message.success('Xóa mã giảm giá thành công');
      await loadAllPromotions();
    } catch {
      message.error('Không thể xóa mã giảm giá');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      const payload = {
        ...values,
        startDate: values.startDate.toDate().toISOString(),
        endDate: values.endDate.toDate().toISOString(),
      };

      if (editingPromotion) {
        await promotionService.updatePromotion(editingPromotion.id, payload);
        message.success('Cập nhật mã giảm giá thành công');
      } else {
        await promotionService.createPromotion(payload);
        message.success('Tạo mã giảm giá thành công');
      }
      setIsModalVisible(false);
      await loadAllPromotions();
    } catch {
      message.error('Có lỗi xảy ra');
    }
  };

  const columns: ColumnsType<Promotion> = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    {
      title: 'Mã giảm giá',
      dataIndex: 'code',
      key: 'code',
      render: (text: string) => <strong>{text}</strong>,
    },
    { title: 'Mô tả', dataIndex: 'description', key: 'description', ellipsis: true },
    {
      title: 'Giảm (%)',
      dataIndex: 'discount',
      key: 'discount',
      render: (value: number) => <Tag color="#FB8C00">{value}%</Tag>,
      sorter: (a, b) => a.discount - b.discount,
    },
    {
      title: 'Thời gian áp dụng',
      key: 'duration',
      render: (_, record) => (
        <>
          {dayjs(record.startDate).format('DD/MM/YYYY')} -{' '}
          {dayjs(record.endDate).format('DD/MM/YYYY')}
        </>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: Promotion['status']) => (
        <Tag color={status === 'Active' ? '#FFA726' : '#FF7043'}>
          {status === 'Active' ? 'Đang hoạt động' : 'Hết hạn'}
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
            className="text-[#FB8C00] hover:text-[#EF6C00]"
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc muốn xóa mã giảm giá này?"
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
    <div className="p-8 min-h-screen bg-[#FFF3E0]">
      <Card
        className="shadow-xl rounded-2xl border-0 bg-white/95 backdrop-blur"
        title={
          <h1 className="text-3xl font-extrabold text-center text-[#EF6C00]">
            🎟️ Quản lý mã giảm giá
          </h1>
        }
      >
        <div className="flex justify-between items-center mb-6">
          <Search
            placeholder="Tìm kiếm mã giảm giá..."
            allowClear
            enterButton={
              <Button
                style={{
                  backgroundColor: '#FFE0B2',
                  color: '#E65100',
                  border: 'none',
                  borderRadius: 10,
                  fontWeight: 600,
                  boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                  transition: '0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FFCC80')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FFE0B2')}
              >
                <SearchOutlined />
              </Button>
            }
            size="large"
            value={searchKeyword}
            onChange={(e) => handleSearch(e.target.value)}
            style={{
              width: 400,
              backgroundColor: '#FFF8E1',
              borderRadius: 12,
              border: 'none',
              padding: '6px 10px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
            }}
          />

          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            onClick={handleCreate}
            style={{
              backgroundColor: '#FFB74D',
              color: '#E65100',
              border: 'none',
              fontWeight: 600,
              borderRadius: 10,
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
            }}
          >
            Thêm mã giảm giá
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={promotions}
          loading={loading}
          rowKey="id"
          className="rounded-lg shadow-sm"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `Tổng ${total} mã giảm giá`,
          }}
        />
      </Card>

      <Modal
        title={
          <span className="text-xl font-bold text-[#E65100]">
            {editingPromotion ? 'Cập nhật mã giảm giá' : 'Thêm mã giảm giá mới'}
          </span>
        }
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={600}
        bodyStyle={{
          backgroundColor: '#FFF3E0',
          borderRadius: 12,
          padding: '24px 30px',
        }}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="code"
            label="Mã giảm giá"
            rules={[{ required: true, message: 'Vui lòng nhập mã giảm giá' }]}
          >
            <Input placeholder="Nhập mã giảm giá" style={{ borderRadius: 8 }} />
          </Form.Item>

          <Form.Item name="description" label="Mô tả">
            <Input.TextArea
              rows={3}
              placeholder="Mô tả mã giảm giá"
              style={{ borderRadius: 8 }}
            />
          </Form.Item>

          <Form.Item
            name="discount"
            label="Giảm (%)"
            rules={[{ required: true, message: 'Vui lòng nhập mức giảm' }]}
          >
            <InputNumber
              min={1}
              max={100}
              style={{ width: '100%', borderRadius: 8 }}
              placeholder="Nhập % giảm giá"
            />
          </Form.Item>

          <Form.Item
            name="startDate"
            label="Ngày bắt đầu"
            rules={[{ required: true, message: 'Chọn ngày bắt đầu' }]}
          >
            <DatePicker style={{ width: '100%', borderRadius: 8 }} />
          </Form.Item>

          <Form.Item
            name="endDate"
            label="Ngày kết thúc"
            rules={[{ required: true, message: 'Chọn ngày kết thúc' }]}
          >
            <DatePicker style={{ width: '100%', borderRadius: 8 }} />
          </Form.Item>

          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true, message: 'Chọn trạng thái' }]}
          >
            <Select placeholder="Chọn trạng thái" style={{ borderRadius: 8 }}>
              <Option value="Active">Đang hoạt động</Option>
              <Option value="Expired">Hết hạn</Option>
            </Select>
          </Form.Item>

          <Form.Item className="mb-0 text-center">
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                style={{
                  backgroundColor: '#FFB74D',
                  color: '#E65100',
                  border: 'none',
                  fontWeight: 600,
                  borderRadius: 10,
                  padding: '6px 20px',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                }}
              >
                {editingPromotion ? 'Cập nhật' : 'Tạo mới'}
              </Button>
              <Button onClick={() => setIsModalVisible(false)}>Hủy</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PromotionManagementPage;
