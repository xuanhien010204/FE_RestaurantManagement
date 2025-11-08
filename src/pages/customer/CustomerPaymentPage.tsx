import React, { useState, useEffect, useCallback } from 'react';
import { Table, Button, Input, DatePicker, Select, Tag, Modal, Typography, Space, Pagination, message, Card } from 'antd';
import { EyeOutlined, DownloadOutlined, SearchOutlined, FileTextOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { Payment } from '../../types/Payment';
import * as paymentService from '../../services/payment.service';
import { useAppSelector } from '../../redux/app/hook';
import dayjs from 'dayjs';

const { Title } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

const CustomerPaymentPage: React.FC = () => {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('');
    const [methodFilter, setMethodFilter] = useState<string>('');
    const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);
    const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
    const [detailModalVisible, setDetailModalVisible] = useState(false);

    const user = useAppSelector(state => state.auth.user);

    const fetchPayments = useCallback(async () => {
        if (!user?.id) return;

        setLoading(true);
        try {
            // Get all payments and filter by current user
            const allPayments = await paymentService.getAllPayments();

            // Filter payments by current user's orders
            let userPayments = allPayments.filter(payment => {
                // Assuming payment has order information that contains userId
                return payment.order?.userId === user.id;
            });

            // Apply search filter (search by payment ID, amount, or transaction code from payment details)
            if (searchKeyword) {
                userPayments = userPayments.filter(payment =>
                    payment.id.toString().includes(searchKeyword) ||
                    payment.amount?.toString().includes(searchKeyword) ||
                    payment.paymentDetails?.some(detail =>
                        detail.transactionCode?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                        detail.method?.toLowerCase().includes(searchKeyword.toLowerCase())
                    )
                );
            }

            // Apply status filter
            if (statusFilter) {
                userPayments = userPayments.filter(payment => payment.status === statusFilter);
            }

            // Apply method filter
            if (methodFilter) {
                userPayments = userPayments.filter(payment =>
                    payment.paymentDetails?.some(detail => detail.method === methodFilter)
                );
            }

            // Apply date range filter
            if (dateRange) {
                userPayments = userPayments.filter(payment => {
                    const paymentDate = dayjs(payment.paymentDate);
                    return paymentDate.isAfter(dateRange[0].startOf('day')) &&
                        paymentDate.isBefore(dateRange[1].endOf('day'));
                });
            }

            // Apply pagination
            const startIndex = (currentPage - 1) * pageSize;
            const paginatedPayments = userPayments.slice(startIndex, startIndex + pageSize);

            setPayments(paginatedPayments);
            setTotal(userPayments.length);
        } catch (error) {
            console.error('Error fetching payments:', error);
            message.error('Failed to load payments');
        } finally {
            setLoading(false);
        }
    }, [user?.id, currentPage, searchKeyword, statusFilter, methodFilter, dateRange, pageSize]);

    useEffect(() => {
        fetchPayments();
    }, [fetchPayments]);

    const handleViewDetails = (payment: Payment) => {
        setSelectedPayment(payment);
        setDetailModalVisible(true);
    };

    const handleDownloadReceipt = async (payment: Payment) => {
        try {
            // This would normally call an API to generate/download receipt
            message.info('Receipt download functionality would be implemented here');
            console.log('Downloading receipt for payment:', payment.id);
        } catch (error) {
            console.error('Error downloading receipt:', error);
            message.error('Failed to download receipt');
        }
    };

    const handleDownloadInvoice = async (payment: Payment) => {
        try {
            // This would normally call an API to generate/download invoice
            message.info('Invoice download functionality would be implemented here');
            console.log('Downloading invoice for payment:', payment.id);
        } catch (error) {
            console.error('Error downloading invoice:', error);
            message.error('Failed to download invoice');
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Pending': return 'orange';
            case 'Completed': return 'green';
            case 'Failed': return 'red';
            case 'Refunded': return 'blue';
            default: return 'default';
        }
    };

    const getMethodColor = (method: string) => {
        switch (method) {
            case 'Cash': return 'green';
            case 'CreditCard': return 'blue';
            case 'DebitCard': return 'cyan';
            case 'DigitalWallet': return 'purple';
            default: return 'default';
        }
    };

    const columns: ColumnsType<Payment> = [
        {
            title: 'Payment ID',
            dataIndex: 'id',
            key: 'id',
            width: 100,
            render: (id: number) => `#${id.toString().slice(-6)}`,
        },
        {
            title: 'Order ID',
            dataIndex: 'orderId',
            key: 'orderId',
            width: 100,
            render: (orderId: number) => orderId ? `#${orderId.toString().slice(-6)}` : 'N/A',
        },
        {
            title: 'Date',
            dataIndex: 'paymentDate',
            key: 'paymentDate',
            width: 120,
            render: (date: string) => dayjs(date).format('MMM DD, YYYY'),
            sorter: (a, b) => dayjs(a.paymentDate).unix() - dayjs(b.paymentDate).unix(),
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
            width: 100,
            render: (amount: number) => `$${amount?.toFixed(2) || '0.00'}`,
            sorter: (a, b) => (a.amount || 0) - (b.amount || 0),
        },
        {
            title: 'Method',
            dataIndex: 'paymentDetails',
            key: 'paymentDetails',
            width: 120,
            render: (paymentDetails: Payment['paymentDetails']) => {
                const methods = paymentDetails?.map(detail => detail.method) || [];
                const uniqueMethods = [...new Set(methods)];
                return uniqueMethods.map(method => (
                    <Tag key={method} color={getMethodColor(method)}>{method}</Tag>
                ));
            },
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 100,
            render: (status: string) => (
                <Tag color={getStatusColor(status)}>{status}</Tag>
            ),
        },
        {
            title: 'Transaction Code',
            dataIndex: 'paymentDetails',
            key: 'transactionCode',
            width: 150,
            render: (paymentDetails: Payment['paymentDetails']) => {
                const codes = paymentDetails?.map(detail => detail.transactionCode).filter(Boolean) || [];
                return codes.length > 0 ? codes.join(', ') : 'N/A';
            },
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 200,
            render: (_, record) => (
                <Space>
                    <Button
                        type="text"
                        icon={<EyeOutlined />}
                        onClick={() => handleViewDetails(record)}
                        title="View Details"
                    />
                    <Button
                        type="text"
                        icon={<DownloadOutlined />}
                        onClick={() => handleDownloadReceipt(record)}
                        title="Download Receipt"
                    />
                    <Button
                        type="text"
                        icon={<FileTextOutlined />}
                        onClick={() => handleDownloadInvoice(record)}
                        title="Download Invoice"
                    />
                </Space>
            ),
        },
    ];

    const handleDateRangeChange = (dates: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null) => {
        if (dates && dates[0] && dates[1]) {
            setDateRange([dates[0], dates[1]]);
        } else {
            setDateRange(null);
        }
    };

    return (
        <div className="p-6">
            <Title level={2}>My Payment History</Title>

            {/* Payment Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Card>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                            ${payments.filter(p => p.status === 'Completed').reduce((sum, p) => sum + (p.amount || 0), 0).toFixed(2)}
                        </div>
                        <div className="text-gray-600">Total Paid</div>
                    </div>
                </Card>
                <Card>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">
                            ${payments.filter(p => p.status === 'Pending').reduce((sum, p) => sum + (p.amount || 0), 0).toFixed(2)}
                        </div>
                        <div className="text-gray-600">Pending</div>
                    </div>
                </Card>
                <Card>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">
                            ${payments.filter(p => p.status === 'Failed').reduce((sum, p) => sum + (p.amount || 0), 0).toFixed(2)}
                        </div>
                        <div className="text-gray-600">Failed</div>
                    </div>
                </Card>
                <Card>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                            {payments.length}
                        </div>
                        <div className="text-gray-600">Total Transactions</div>
                    </div>
                </Card>
            </div>

            {/* Filters */}
            <div className="mb-6 bg-white p-4 rounded-lg shadow">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <Input
                        placeholder="Search by transaction code..."
                        prefix={<SearchOutlined />}
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                        allowClear
                    />

                    <Select
                        placeholder="Filter by status"
                        value={statusFilter}
                        onChange={setStatusFilter}
                        allowClear
                        style={{ width: '100%' }}
                    >
                        <Option value="">All Status</Option>
                        <Option value="Pending">Pending</Option>
                        <Option value="Completed">Completed</Option>
                        <Option value="Failed">Failed</Option>
                        <Option value="Refunded">Refunded</Option>
                    </Select>

                    <Select
                        placeholder="Filter by method"
                        value={methodFilter}
                        onChange={setMethodFilter}
                        allowClear
                        style={{ width: '100%' }}
                    >
                        <Option value="">All Methods</Option>
                        <Option value="Cash">Cash</Option>
                        <Option value="CreditCard">Credit Card</Option>
                        <Option value="DebitCard">Debit Card</Option>
                        <Option value="DigitalWallet">Digital Wallet</Option>
                    </Select>

                    <RangePicker
                        value={dateRange}
                        onChange={handleDateRangeChange}
                        style={{ width: '100%' }}
                        placeholder={['Start Date', 'End Date']}
                    />

                    <Button type="primary" onClick={fetchPayments}>
                        Search
                    </Button>
                </div>
            </div>

            {/* Payments Table */}
            <div className="bg-white rounded-lg shadow">
                <Table
                    columns={columns}
                    dataSource={payments}
                    loading={loading}
                    rowKey="id"
                    pagination={false}
                    scroll={{ x: 1000 }}
                />

                <div className="p-4 border-t">
                    <Pagination
                        current={currentPage}
                        pageSize={pageSize}
                        total={total}
                        onChange={setCurrentPage}
                        showSizeChanger={false}
                        showQuickJumper
                        showTotal={(total, range) =>
                            `${range[0]}-${range[1]} of ${total} payments`
                        }
                    />
                </div>
            </div>

            {/* Payment Details Modal */}
            <Modal
                title={`Payment Details - #${selectedPayment?.id?.toString().slice(-6)}`}
                open={detailModalVisible}
                onCancel={() => setDetailModalVisible(false)}
                footer={[
                    <Button key="receipt" onClick={() => selectedPayment && handleDownloadReceipt(selectedPayment)}>
                        Download Receipt
                    </Button>,
                    <Button key="invoice" onClick={() => selectedPayment && handleDownloadInvoice(selectedPayment)}>
                        Download Invoice
                    </Button>,
                    <Button key="close" type="primary" onClick={() => setDetailModalVisible(false)}>
                        Close
                    </Button>,
                ]}
                width={600}
            >
                {selectedPayment && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <strong>Payment Date:</strong>
                                <div>{dayjs(selectedPayment.paymentDate).format('MMM DD, YYYY HH:mm')}</div>
                            </div>
                            <div>
                                <strong>Status:</strong>
                                <div>
                                    <Tag color={getStatusColor(selectedPayment.status)}>
                                        {selectedPayment.status}
                                    </Tag>
                                </div>
                            </div>
                            <div>
                                <strong>Amount:</strong>
                                <div className="text-lg font-semibold text-green-600">
                                    ${selectedPayment.amount?.toFixed(2)}
                                </div>
                            </div>
                            <div>
                                <strong>Payment Methods:</strong>
                                <div>
                                    {selectedPayment.paymentDetails?.map(detail => (
                                        <Tag key={detail.id} color={getMethodColor(detail.method)}>
                                            {detail.method}
                                        </Tag>
                                    )) || 'N/A'}
                                </div>
                            </div>
                            <div>
                                <strong>Transaction Codes:</strong>
                                <div className="font-mono text-sm bg-gray-100 p-2 rounded">
                                    {selectedPayment.paymentDetails?.map(detail => detail.transactionCode).filter(Boolean).join(', ') || 'N/A'}
                                </div>
                            </div>
                            <div>
                                <strong>Order ID:</strong>
                                <div>#{selectedPayment.orderId?.toString().slice(-6) || 'N/A'}</div>
                            </div>
                        </div>

                        {selectedPayment.paymentDetails && selectedPayment.paymentDetails.length > 0 && (
                            <div>
                                <strong>Payment Details:</strong>
                                <div className="mt-2 space-y-2">
                                    {selectedPayment.paymentDetails.map(detail => (
                                        <div key={detail.id} className="bg-gray-50 p-3 rounded">
                                            <div className="grid grid-cols-2 gap-2 text-sm">
                                                <div><strong>Method:</strong> {detail.method}</div>
                                                <div><strong>Amount:</strong> ${detail.amount.toFixed(2)}</div>
                                                <div><strong>Provider:</strong> {detail.provider || 'N/A'}</div>
                                                <div><strong>Transaction:</strong> {detail.transactionCode || 'N/A'}</div>
                                                {detail.extraInfo && (
                                                    <div className="col-span-2">
                                                        <strong>Extra Info:</strong> {detail.extraInfo}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default CustomerPaymentPage;