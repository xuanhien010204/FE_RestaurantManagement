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
  CheckOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { RestaurantTable } from '../../types/RestaurantTable';
import * as tableService from '../../services/restaurant-table.service';

const { Search } = Input;
const { Option } = Select;

const TableManagementPage: React.FC = () => {
  const [tables, setTables] = useState<RestaurantTable[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTable, setEditingTable] = useState<RestaurantTable | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    loadTables();
  }, []);

  const loadTables = async () => {
    setLoading(true);
    try {
      const tableList = await tableService.getAllTables();
      setTables(tableList);
    } catch {
      message.error('Không thể tải danh sách bàn');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (value: string) => {
    if (!value.trim()) {
      loadTables();
      return;
    }

    const tableNumber = parseInt(value);
    if (isNaN(tableNumber)) {
      message.error('Vui lòng nhập số bàn hợp lệ');
      return;
    }

    setLoading(true);
    try {
      const tableList = await tableService.searchTablesByNumber(tableNumber);
      setTables(tableList);
    } catch {
      message.error('Không thể tìm kiếm bàn');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingTable(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (table: RestaurantTable) => {
    setEditingTable(table);
    form.setFieldsValue({
      tableNumber: table.tableNumber,
      seats: table.seats,
      status: getStatusValue(table.status),
      location: table.location,
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await tableService.deleteTable(id);
      message.success('Xóa bàn thành công');
      loadTables();
    } catch {
      message.error('Không thể xóa bàn');
    }
  };

  const handleReserve = async (id: number) => {
    try {
      await tableService.reserveTable(id);
      message.success('Đặt bàn thành công');
      loadTables();
    } catch {
      message.error('Không thể đặt bàn');
    }
  };

  const handleCancelReservation = async (id: number) => {
    try {
      await tableService.cancelTableReservation(id);
      message.success('Hủy đặt bàn thành công');
      loadTables();
    } catch {
      message.error('Không thể hủy đặt bàn');
    }
  };

  const handleSubmit = async (values: tableService.RestaurantTableCreateRequest) => {
    try {
      if (editingTable) {
        await tableService.updateTable(editingTable.id, values);
        message.success('Cập nhật bàn thành công');
      } else {
        await tableService.createTable(values);
        message.success('Tạo bàn thành công');
      }
      setIsModalVisible(false);
      loadTables();
    } catch {
      message.error('Có lỗi xảy ra');
    }
  };

  const getStatusColor = (status: RestaurantTable['status']) => {
    switch (status) {
      case 'Available':
        return 'green';
      case 'Occupied':
        return 'red';
      case 'Reserved':
        return 'orange';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: RestaurantTable['status']) => {
    switch (status) {
      case 'Available':
        return 'Trống';
      case 'Occupied':
        return 'Đang sử dụng';
      case 'Reserved':
        return 'Đã đặt';
      default:
        return status;
    }
  };

  const getStatusValue = (status: RestaurantTable['status']): number => {
    switch (status) {
      case 'Available':
        return 0;
      case 'Occupied':
        return 1;
      case 'Reserved':
        return 2;
      default:
        return 0;
    }
  };

  const columns: ColumnsType<RestaurantTable> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 70,
    },
    {
      title: 'Số bàn',
      dataIndex: 'tableNumber',
      key: 'tableNumber',
      render: (tableNumber: number) => (
        <strong>Bàn {tableNumber}</strong>
      ),
      sorter: (a, b) => a.tableNumber - b.tableNumber,
    },
    {
      title: 'Số ghế',
      dataIndex: 'seats',
      key: 'seats',
      render: (seats: number) => `${seats} chỗ`,
      sorter: (a, b) => a.seats - b.seats,
    },
    {
      title: 'Vị trí',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: RestaurantTable['status']) => (
        <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>
      ),
      filters: [
        { text: 'Trống', value: 'Available' },
        { text: 'Đang sử dụng', value: 'Occupied' },
        { text: 'Đã đặt', value: 'Reserved' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            Sửa
          </Button>
          {record.status === 'Available' && (
            <Button type="text" icon={<CheckOutlined />} onClick={() => handleReserve(record.id)}>
              Đặt bàn
            </Button>
          )}
          {record.status === 'Reserved' && (
            <Button type="text" icon={<CloseOutlined />} onClick={() => handleCancelReservation(record.id)}>
              Hủy đặt
            </Button>
          )}
          <Popconfirm
            title="Bạn có chắc muốn xóa bàn này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button type="text" danger icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
<div className="p-8 min-h-screen" style={{ backgroundColor: '#FFF9E5' }}>
  <Card
    className="mx-auto shadow-lg rounded-2xl border-0"
    style={{ maxWidth: 1500, backgroundColor: 'white' }}
    title={
      <h2 style={{ textAlign: 'center', fontSize: 28, fontWeight: 'bold', color: '#D4A017', margin: 0 }}>
        🍽️ Quản lý bàn ăn
      </h2>
    }
  >
    <div className="flex justify-between items-center mb-6">
      <Search
        placeholder="Tìm theo số bàn..."
        allowClear
        enterButton={
          <Button
            style={{
              backgroundColor: '#F7DC6F', // vàng nhạt
              color: '#7D6608',
              border: 'none',
              borderRadius: 8,
              fontWeight: 600,
            }}
          >
            <SearchOutlined />
          </Button>
        }
        size="large"
        onSearch={handleSearch}
        style={{ width: 400 }}
      />

      <Button
        type="primary"
        icon={<PlusOutlined />}
        size="large"
        onClick={handleCreate}
        style={{
          backgroundColor: '#F7DC6F', // vàng nhạt
          color: '#7D6608',
          border: 'none',
          fontWeight: 600,
          borderRadius: 8,
        }}
      >
        Thêm bàn
      </Button>
    </div>

    <Table
      columns={columns}
      dataSource={tables}
      loading={loading}
      rowKey="id"
      pagination={{
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total) => `Tổng ${total} bàn`,
      }}
    />
  </Card>


{/* ==== Modal nền vàng nhạt ==== */}
<Modal
  title={editingTable ? 'Cập nhật bàn' : 'Thêm bàn mới'}
  open={isModalVisible}
  onCancel={() => setIsModalVisible(false)}
  footer={null}
  width={500}
  bodyStyle={{ backgroundColor: '#FEF5E7', borderRadius: 12 }} // nền vàng nhạt
>
  <Form form={form} layout="vertical" onFinish={handleSubmit}>
    <Form.Item
      name="tableNumber"
      label="Số bàn"
      rules={[{ required: true, message: 'Vui lòng nhập số bàn' }]}
    >
      <InputNumber style={{ width: '100%' }} placeholder="Nhập số bàn" min={1} />
    </Form.Item>

    <Form.Item
      name="seats"
      label="Số ghế"
      rules={[
        { required: true, message: 'Vui lòng nhập số ghế' },
        { type: 'number', min: 1, max: 50, message: 'Số ghế từ 1-50' },
      ]}
    >
      <InputNumber style={{ width: '100%' }} placeholder="Nhập số ghế" min={1} max={50} />
    </Form.Item>

    <Form.Item
      name="location"
      label="Vị trí"
      rules={[{ required: true, message: 'Vui lòng nhập vị trí' }]}
    >
      <Input placeholder="VD: Tầng 1, Gần cửa sổ..." />
    </Form.Item>

    <Form.Item
      name="status"
      label="Trạng thái"
      rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
    >
      <Select placeholder="Chọn trạng thái">
        <Option value={0}>Trống</Option>
        <Option value={1}>Đang sử dụng</Option>
        <Option value={2}>Đã đặt</Option>
      </Select>
    </Form.Item>

    <Form.Item className="mb-0 text-center">
      <Space>
        <Button
          type="primary"
          htmlType="submit"
          style={{
            backgroundColor: '#F7DC6F',
            color: '#7D6608',
            border: 'none',
            fontWeight: 600,
            borderRadius: 8,
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F9E79F')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#F7DC6F')}
        >
          {editingTable ? 'Cập nhật' : 'Tạo mới'}
        </Button>
        <Button
          onClick={() => setIsModalVisible(false)}
          style={{
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FDEBC5')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          Hủy
        </Button>
      </Space>
    </Form.Item>
  </Form>
</Modal>

</div>
  ); 
}
export default TableManagementPage;
