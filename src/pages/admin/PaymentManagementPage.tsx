import React, { useState, useEffect } from 'react';
import { Table, Button, Card, Space, Input, Tag, Modal, Descriptions, Badge, DatePicker, Statistic, Row, Col, Select } from 'antd';
import { SearchOutlined, EyeOutlined, DollarOutlined, CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined, PlusOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { Payment, PaymentStatistics } from '../../types/Payment';
import * as paymentService from '../../services/payment.service';
import dayjs, { Dayjs } from 'dayjs';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Search } = Input;
const { RangePicker } = DatePicker;
const { Option } = Select;

const PaymentManagementPage: React.FC = () => {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
    const [statistics, setStatistics] = useState<PaymentStatistics | null>(null);
    const [filterStatus, setFilterStatus] = useState<number | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        loadPayments();
        loadStatistics();
    }, []);

    const loadPayments = async () => {
        setLoading(true);
        try {
            const paymentList = await paymentService.getAllPayments();
            setPayments(paymentList);
        } catch {
            message.error('Không thể tải danh sách thanh toán');
        } finally {
            setLoading(false);
        }
    };

    const loadStatistics = async () => {
        try {
            const stats = await paymentService.getPaymentStatistics();
            setStatistics(stats);
        } catch {
            message.error('Không thể tải thống kê');
        }
    };

    const handleSearch = async (value: string) => {
        if (!value.trim()) {
            loadPayments();
            return;
        }

        setLoading(true);
        try {
            const paymentList = await paymentService.searchPaymentsByTransactionCode(value);
            setPayments(paymentList);
        } catch {
            message.error('Không thể tìm kiếm thanh toán');
        } finally {
            setLoading(false);
        }
    };

    const handleDateRangeChange = async (dates: [Dayjs | null, Dayjs | null] | null) => {
        if (!dates || !dates[0] || !dates[1]) {
            loadPayments();
            return;
        }

        setLoading(true);
        try {
            const startDate = dates[0].toISOString();
            const endDate = dates[1].toISOString();
            const paymentList = await paymentService.getPaymentsByDateRange(startDate, endDate);
            setPayments(paymentList);
        } catch {
            message.error('Không thể lọc theo ngày');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusFilter = async (status: number | null) => {
        setFilterStatus(status);
        if (status === null) {
            loadPayments();
            return;
        }

        setLoading(true);
        try {
            const paymentList = await paymentService.getPaymentsByStatus(status);
            setPayments(paymentList);
        } catch {
            message.error('Không thể lọc theo trạng thái');
        } finally {
            setLoading(false);
        }
    };

    const handleViewPayment = (payment: Payment) => {
        setSelectedPayment(payment);
        setIsModalVisible(true);
    };

    const handleUpdateStatus = async (id: number, status: number) => {
        try {
            await paymentService.updatePaymentStatus(id, status);
            message.success('Cập nhật trạng thái thành công');
            loadPayments();
            loadStatistics();
        } catch {
            message.error('Không thể cập nhật trạng thái');
        }
    };

    const getStatusColor = (status: Payment['status']) => {
        switch (status) {
            case 'Pending': return 'gold';
            case 'Completed': return 'green';
            case 'Failed': return 'red';
            default: return 'default';
        }
    };

    const getStatusText = (status: Payment['status']) => {
        switch (status) {
            case 'Pending': return 'Đang chờ';
            case 'Completed': return 'Hoàn thành';
            case 'Failed': return 'Thất bại';
            default: return status;
        }
    };

    const getMethodText = (method: string) => {
        switch (method) {
            case 'Cash': return 'Tiền mặt';
            case 'CreditCard': return 'Thẻ tín dụng';
            case 'BankTransfer': return 'Chuyển khoản';
            case 'EWallet': return 'Ví điện tử';
            case 'Voucher': return 'Voucher';
            default: return method;
        }
    };

    const getMethodIcon = (method: string) => {
        switch (method) {
            case 'Cash': return '💵';
            case 'CreditCard': return '💳';
            case 'BankTransfer': return '🏦';
            case 'EWallet': return '📱';
            case 'Voucher': return '🎟️';
            default: return '💰';
        }
    };

    const columns: ColumnsType<Payment> = [
        {
            title: 'Mã thanh toán',
            dataIndex: 'id',
            key: 'id',
            width: 120,
            render: (id: number) => `#PAY${id}`,
        },
        {
            title: 'Mã đơn hàng',
            dataIndex: 'orderId',
            key: 'orderId',
            render: (orderId: number) => `#${orderId}`,
        },
        {
            title: 'Số tiền',
            dataIndex: 'amount',
            key: 'amount',
            render: (amount: number) => (
                <span className="font-semibold text-green-600">
                    ${amount.toFixed(2)}
                </span>
            ),
            sorter: (a, b) => a.amount - b.amount,
        },
        {
            title: 'Phương thức',
            key: 'methods',
            render: (_, record) => (
                <Space direction="vertical" size="small">
                    {record.paymentDetails?.map((detail, index) => (
                        <Tag key={index} color="blue">
                            {getMethodIcon(detail.method)} {getMethodText(detail.method)}
                        </Tag>
                    ))}
                </Space>
            ),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status: Payment['status']) => (
                <Tag color={getStatusColor(status)} icon={
                    status === 'Completed' ? <CheckCircleOutlined /> :
                        status === 'Failed' ? <CloseCircleOutlined /> :
                            <ClockCircleOutlined />
                }>
                    {getStatusText(status)}
                </Tag>
            ),
        },
        {
            title: 'Ngày thanh toán',
            dataIndex: 'paymentDate',
            key: 'paymentDate',
            render: (date: string) => dayjs(date).format('DD/MM/YYYY HH:mm'),
            sorter: (a, b) => dayjs(a.paymentDate).unix() - dayjs(b.paymentDate).unix(),
        },
        {
            title: 'Hành động',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button
                        type="text"
                        icon={<EyeOutlined />}
                        onClick={() => handleViewPayment(record)}
                        size="small"
                    >
                        Xem
                    </Button>
                    {record.status === 'Pending' && (
                        <>
                            <Button
                                type="text"
                                className="text-green-600"
                                onClick={() => handleUpdateStatus(record.id, 1)}
                                size="small"
                            >
                                Xác nhận
                            </Button>
                            <Button
                                type="text"
                                danger
                                onClick={() => handleUpdateStatus(record.id, 2)}
                                size="small"
                            >
                                Từ chối
                            </Button>
                        </>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <div className="p-6">
            {/* Statistics Cards */}
            {statistics && (
                <Row gutter={16} className="mb-6">
                    <Col span={6}>
                        <Card>
                            <Statistic
                                title="Tổng doanh thu"
                                value={statistics.totalRevenue}
                                precision={2}
                                prefix="$"
                                valueStyle={{ color: '#3f8600' }}
                                suffix={<DollarOutlined />}
                            />
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card>
                            <Statistic
                                title="Đã hoàn thành"
                                value={statistics.countCompleted}
                                valueStyle={{ color: '#52c41a' }}
                                prefix={<CheckCircleOutlined />}
                            />
                            <div className="text-sm text-gray-500 mt-2">
                                ${statistics.totalCompleted.toFixed(2)}
                            </div>
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card>
                            <Statistic
                                title="Đang chờ"
                                value={statistics.countPending}
                                valueStyle={{ color: '#faad14' }}
                                prefix={<ClockCircleOutlined />}
                            />
                            <div className="text-sm text-gray-500 mt-2">
                                ${statistics.totalPending.toFixed(2)}
                            </div>
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card>
                            <Statistic
                                title="Thất bại"
                                value={statistics.countFailed}
                                valueStyle={{ color: '#cf1322' }}
                                prefix={<CloseCircleOutlined />}
                            />
                            <div className="text-sm text-gray-500 mt-2">
                                ${statistics.totalFailed.toFixed(2)}
                            </div>
                        </Card>
                    </Col>
                </Row>
            )}

            <Card title="Quản lý thanh toán" className="mb-6">
                <div className="mb-4 flex flex-wrap gap-4 justify-between">
                    <div className="flex flex-wrap gap-4">
                        <Search
                            placeholder="Tìm theo mã giao dịch..."
                            allowClear
                            enterButton={<SearchOutlined />}
                            size="large"
                            onSearch={handleSearch}
                            style={{ width: 300 }}
                        />
                        <RangePicker
                            size="large"
                            onChange={handleDateRangeChange}
                            format="DD/MM/YYYY"
                            placeholder={['Từ ngày', 'Đến ngày']}
                        />
                        <Select
                            size="large"
                            placeholder="Lọc theo trạng thái"
                            style={{ width: 200 }}
                            allowClear
                            value={filterStatus}
                            onChange={handleStatusFilter}
                        >
                            <Option value={0}>Đang chờ</Option>
                            <Option value={1}>Hoàn thành</Option>
                            <Option value={2}>Thất bại</Option>
                        </Select>
                        <Button
                            type="default"
                            onClick={() => {
                                loadPayments();
                                loadStatistics();
                            }}
                        >
                            Làm mới
                        </Button>
                    </div>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => navigate('/admin/payments/create')}
                    >
                        Tạo thanh toán
                    </Button>
                </div>

                <Table
                    columns={columns}
                    dataSource={payments}
                    loading={loading}
                    rowKey="id"
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total) => `Tổng ${total} thanh toán`,
                    }}
                />
            </Card>

            {/* Payment Detail Modal */}
            <Modal
                title={`Chi tiết thanh toán #PAY${selectedPayment?.id}`}
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={[
                    <Button key="close" onClick={() => setIsModalVisible(false)}>
                        Đóng
                    </Button>
                ]}
                width={700}
            >
                {selectedPayment && (
                    <div>
                        <Descriptions title="Thông tin thanh toán" bordered column={2}>
                            <Descriptions.Item label="Mã thanh toán">
                                #PAY{selectedPayment.id}
                            </Descriptions.Item>
                            <Descriptions.Item label="Mã đơn hàng">
                                #{selectedPayment.orderId}
                            </Descriptions.Item>
                            <Descriptions.Item label="Số tiền">
                                <span className="text-lg font-bold text-green-600">
                                    ${selectedPayment.amount.toFixed(2)}
                                </span>
                            </Descriptions.Item>
                            <Descriptions.Item label="Trạng thái">
                                <Badge
                                    status={selectedPayment.status === 'Completed' ? 'success' : 'processing'}
                                    text={getStatusText(selectedPayment.status)}
                                />
                            </Descriptions.Item>
                            <Descriptions.Item label="Ngày thanh toán" span={2}>
                                {dayjs(selectedPayment.paymentDate).format('DD/MM/YYYY HH:mm:ss')}
                            </Descriptions.Item>
                        </Descriptions>

                        <div className="mt-6">
                            <h3 className="text-lg font-semibold mb-4">Chi tiết phương thức thanh toán</h3>
                            <Table
                                dataSource={selectedPayment.paymentDetails}
                                rowKey="id"
                                pagination={false}
                                size="small"
                                columns={[
                                    {
                                        title: 'Phương thức',
                                        dataIndex: 'method',
                                        key: 'method',
                                        render: (method: string) => (
                                            <Tag color="blue">
                                                {getMethodIcon(method)} {getMethodText(method)}
                                            </Tag>
                                        ),
                                    },
                                    {
                                        title: 'Số tiền',
                                        dataIndex: 'amount',
                                        key: 'amount',
                                        render: (amount: number) => `$${amount.toFixed(2)}`,
                                    },
                                    {
                                        title: 'Mã giao dịch',
                                        dataIndex: 'transactionCode',
                                        key: 'transactionCode',
                                        render: (code: string) => code || 'N/A',
                                    },
                                    {
                                        title: 'Nhà cung cấp',
                                        dataIndex: 'provider',
                                        key: 'provider',
                                        render: (provider: string) => provider || 'N/A',
                                    },
                                ]}
                            />
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default PaymentManagementPage;