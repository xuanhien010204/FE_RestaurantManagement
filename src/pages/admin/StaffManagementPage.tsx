import React, { useState, useEffect } from 'react';
import { Table, Button, Card, Space, Input, Tag, Modal, Form, DatePicker, message, Popconfirm } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { StaffProfile } from '../../types/StaffProfile';
import * as staffService from '../../services/staff.service';
import dayjs from 'dayjs';

const { Search } = Input;

const StaffManagementPage: React.FC = () => {
    const [staffList, setStaffList] = useState<StaffProfile[]>([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingStaff, setEditingStaff] = useState<StaffProfile | null>(null);
    const [form] = Form.useForm();

    useEffect(() => {
        loadStaffList();
    }, []);

    const loadStaffList = async () => {
        setLoading(true);
        try {
            const staff = await staffService.getAllStaff();
            setStaffList(staff);
        } catch {
            message.error('Không thể tải danh sách nhân viên');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (value: string) => {
        if (!value.trim()) {
            loadStaffList();
            return;
        }

        setLoading(true);
        try {
            const staff = await staffService.searchStaff(value);
            setStaffList(staff);
        } catch {
            message.error('Không thể tìm kiếm nhân viên');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setEditingStaff(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    const handleEdit = (staff: StaffProfile) => {
        setEditingStaff(staff);
        form.setFieldsValue({
            fullName: staff.user?.fullName,
            email: staff.user?.email,
            phone: staff.user?.phone,
            address: staff.user?.address,
            position: staff.position,
            hireDate: staff.hireDate ? dayjs(staff.hireDate) : null,
        });
        setIsModalVisible(true);
    };

    const handleDelete = async (id: number) => {
        try {
            await staffService.deleteStaff(id);
            message.success('Xóa nhân viên thành công');
            loadStaffList();
        } catch {
            message.error('Không thể xóa nhân viên');
        }
    };

    const handleSubmit = async (values: staffService.StaffCreateRequest) => {
        try {
            const payload = {
                ...values,
                hireDate: values.hireDate ? dayjs(values.hireDate).toISOString() : undefined,
            };

            if (editingStaff) {
                await staffService.updateStaff(editingStaff.id, payload);
                message.success('Cập nhật nhân viên thành công');
            } else {
                await staffService.createStaff(payload);
                message.success('Tạo nhân viên thành công');
            }
            setIsModalVisible(false);
            loadStaffList();
        } catch {
            message.error('Có lỗi xảy ra');
        }
    };

    const columns: ColumnsType<StaffProfile> = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 70,
        },
        {
            title: 'Họ tên',
            dataIndex: ['user', 'fullName'],
            key: 'fullName',
            render: (text: string) => (
                <Space>
                    <UserOutlined />
                    <strong>{text}</strong>
                </Space>
            ),
        },
        {
            title: 'Email',
            dataIndex: ['user', 'email'],
            key: 'email',
        },
        {
            title: 'Số điện thoại',
            dataIndex: ['user', 'phone'],
            key: 'phone',
            render: (phone: string) => phone || 'Chưa cập nhật',
        },
        {
            title: 'Chức vụ',
            dataIndex: 'position',
            key: 'position',
            render: (position: string) => <Tag color="blue">{position}</Tag>,
        },
        {
            title: 'Ngày vào làm',
            dataIndex: 'hireDate',
            key: 'hireDate',
            render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
        },
        {
            title: 'Trạng thái',
            dataIndex: ['user', 'status'],
            key: 'status',
            render: (status: string) => (
                <Tag color={status === 'Active' ? 'green' : 'red'}>
                    {status === 'Active' ? 'Hoạt động' : 'Tạm khóa'}
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
                        title="Bạn có chắc muốn xóa nhân viên này?"
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
        <div className="p-6 bg-[#D6EAF8] min-h-screen">
            <Card
    title={
        <h2 style={{
            textAlign: 'center',
            fontSize: 28,
            fontWeight: 'bold',
            color: '#154360',
            margin: 0
        }}>
            👩‍💼 Quản lý nhân viên
        </h2>
    }
    className="mb-6"
    style={{
        backgroundColor: '#ffffffcc',
        borderRadius: 16,
        boxShadow: '0 4px 12px rgba(21, 67, 96, 0.15)',
        border: 'none',
    }}
>
                <div className="flex justify-between items-center mb-4">
                    <Search
                        placeholder="Tìm kiếm nhân viên..."
                        allowClear
                        enterButton={
                            <Button
                                size="large"
                                style={{
                                    backgroundColor: '#AED6F1',
                                    color: '#154360',
                                    border: 'none',
                                    borderRadius: 10,
                                    fontWeight: 500,
                                }}
                            >
                                <SearchOutlined />
                            </Button>
                        }
                        size="large"
                        onSearch={handleSearch}
                        style={{
                            width: 400,
                            backgroundColor: '#EBF5FB',
                            borderRadius: 12,
                            border: 'none',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
                        }}
                    />

                    <Button
                        size="large"
                        icon={<PlusOutlined />}
                        onClick={handleCreate}
                        style={{
                            backgroundColor: '#AED6F1',
                            color: '#154360',
                            border: 'none',
                            borderRadius: 10,
                            fontWeight: 500,
                            boxShadow: '0 3px 6px rgba(0,0,0,0.1)',
                        }}
                    >
                        Thêm nhân viên
                    </Button>
                </div>

                <Table
                    columns={columns}
                    dataSource={staffList}
                    loading={loading}
                    rowKey="id"
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total) => `Tổng ${total} nhân viên`,
                    }}
                    style={{
                        backgroundColor: '#ffffffb0',
                        borderRadius: 12,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                    }}
                />
            </Card>

            <Modal
                title={editingStaff ? 'Cập nhật nhân viên' : 'Thêm nhân viên mới'}
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
                width={600}
                bodyStyle={{
                    backgroundColor: '#EBF5FB',
                    borderRadius: 12,
                }}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                >
                    <Form.Item
                        name="fullName"
                        label="Họ tên"
                        rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
                    >
                        <Input placeholder="Nhập họ tên" />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                            { required: true, message: 'Vui lòng nhập email' },
                            { type: 'email', message: 'Email không hợp lệ' }
                        ]}
                    >
                        <Input placeholder="Nhập email" />
                    </Form.Item>

                    <Form.Item
                        name="phone"
                        label="Số điện thoại"
                    >
                        <Input placeholder="Nhập số điện thoại" />
                    </Form.Item>

                    <Form.Item
                        name="address"
                        label="Địa chỉ"
                    >
                        <Input placeholder="Nhập địa chỉ" />
                    </Form.Item>

                    <Form.Item
                        name="position"
                        label="Chức vụ"
                        rules={[{ required: true, message: 'Vui lòng nhập chức vụ' }]}
                    >
                        <Input placeholder="VD: Waiter, Chef, Manager" />
                    </Form.Item>

                    <Form.Item
                        name="hireDate"
                        label="Ngày vào làm"
                    >
                        <DatePicker
                            style={{ width: '100%' }}
                            format="DD/MM/YYYY"
                            placeholder="Chọn ngày vào làm"
                        />
                    </Form.Item>

                    <Form.Item className="mb-0">
                        <Space>
                            <Button
                                htmlType="submit"
                                style={{
                                    backgroundColor: '#AED6F1',
                                    color: '#154360',
                                    border: 'none',
                                    borderRadius: 8,
                                    fontWeight: 500,
                                }}
                            >
                                {editingStaff ? 'Cập nhật' : 'Tạo mới'}
                            </Button>
                            <Button onClick={() => setIsModalVisible(false)}>Hủy</Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default StaffManagementPage;
