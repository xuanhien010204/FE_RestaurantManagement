import React, { useState } from 'react';
import { Form, Input, Button, Card, Select, Space, Table, Divider, InputNumber, message } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import type { PaymentDetailCreateRequest, PaymentCreateRequest } from '../../services/payment.service';
import * as paymentService from '../../services/payment.service';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

interface PaymentDetailForm {
    method: number;
    amount: number;
    transactionCode?: string;
    provider?: string;
    extraInfo?: string;
}

const PaymentCreatePage: React.FC = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [paymentDetails, setPaymentDetails] = useState<PaymentDetailForm[]>([]);
    const [detailForm] = Form.useForm();

    const paymentMethods = [
        { value: 0, label: '💵 Tiền mặt (Cash)' },
        { value: 1, label: '💳 Thẻ tín dụng (Credit Card)' },
        { value: 2, label: '🏦 Chuyển khoản (Bank Transfer)' },
        { value: 3, label: '📱 Ví điện tử (E-Wallet)' },
        { value: 4, label: '🎟️ Voucher' },
    ];

    const addPaymentDetail = async () => {
        try {
            const values = await detailForm.validateFields();
            setPaymentDetails([...paymentDetails, values]);
            detailForm.resetFields();
            message.success('Thêm phương thức thanh toán thành công');
        } catch {
            message.error('Vui lòng điền đầy đủ thông tin');
        }
    };

    const removePaymentDetail = (index: number) => {
        setPaymentDetails(paymentDetails.filter((_, i) => i !== index));
    };

    const handleSubmit = async (values: { orderId: number; amount: number }) => {
        if (paymentDetails.length === 0) {
            message.error('Vui lòng thêm ít nhất một phương thức thanh toán');
            return;
        }

        setLoading(true);
        try {
            const payload: PaymentCreateRequest = {
                orderId: values.orderId,
                amount: values.amount,
                paymentDetails: paymentDetails as PaymentDetailCreateRequest[],
            };

            await paymentService.createPayment(payload);
            message.success('Tạo thanh toán thành công!');
            form.resetFields();
            setPaymentDetails([]);
            setTimeout(() => {
                navigate('/admin/payments');
            }, 1000);
        } catch (error) {
            console.error(error);
            message.error('Không thể tạo thanh toán');
        } finally {
            setLoading(false);
        }
    };

    const detailColumns = [
        {
            title: 'Phương thức',
            dataIndex: 'method',
            key: 'method',
            render: (method: number) => {
                const m = paymentMethods.find(pm => pm.value === method);
                return m ? m.label : 'Unknown';
            },
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
            render: (code: string | undefined) => code || 'N/A',
        },
        {
            title: 'Nhà cung cấp',
            dataIndex: 'provider',
            key: 'provider',
            render: (provider: string | undefined) => provider || 'N/A',
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_: unknown, __: unknown, index: number) => (
                <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => removePaymentDetail(index)}
                >
                    Xóa
                </Button>
            ),
        },
    ];

    const totalDetailAmount = paymentDetails.reduce((sum, detail) => sum + detail.amount, 0);

    return (
        <div className="p-6">
            <Card title="Tạo thanh toán mới" className="mb-6">
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    disabled={loading}
                >
                    <div className="grid grid-cols-2 gap-6">
                        <Form.Item
                            label="Mã đơn hàng"
                            name="orderId"
                            rules={[
                                { required: true, message: 'Vui lòng nhập mã đơn hàng' },
                                { pattern: /^\d+$/, message: 'Mã đơn hàng phải là số' },
                            ]}
                        >
                            <InputNumber
                                placeholder="VD: 1"
                                min={1}
                                style={{ width: '100%' }}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Tổng số tiền"
                            name="amount"
                            rules={[
                                { required: true, message: 'Vui lòng nhập tổng số tiền' },
                            ]}
                        >
                            <InputNumber
                                placeholder="VD: 100.00"
                                min={0.01}
                                step={0.01}
                                style={{ width: '100%' }}
                            />
                        </Form.Item>
                    </div>

                    <Divider>Chi tiết phương thức thanh toán</Divider>

                    <Card className="mb-4" title="Thêm phương thức thanh toán">
                        <Form
                            form={detailForm}
                            layout="vertical"
                        >
                            <div className="grid grid-cols-2 gap-4">
                                <Form.Item
                                    label="Phương thức"
                                    name="method"
                                    rules={[{ required: true, message: 'Chọn phương thức' }]}
                                >
                                    <Select placeholder="Chọn phương thức thanh toán">
                                        {paymentMethods.map(method => (
                                            <Option key={method.value} value={method.value}>
                                                {method.label}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>

                                <Form.Item
                                    label="Số tiền"
                                    name="amount"
                                    rules={[{ required: true, message: 'Vui lòng nhập số tiền' }]}
                                >
                                    <InputNumber
                                        placeholder="VD: 50.00"
                                        min={0.01}
                                        step={0.01}
                                        style={{ width: '100%' }}
                                    />
                                </Form.Item>

                                <Form.Item
                                    label="Mã giao dịch (tùy chọn)"
                                    name="transactionCode"
                                >
                                    <Input placeholder="VD: TXN001" />
                                </Form.Item>

                                <Form.Item
                                    label="Nhà cung cấp (tùy chọn)"
                                    name="provider"
                                >
                                    <Input placeholder="VD: Visa, Momo, ACB..." />
                                </Form.Item>
                            </div>

                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={addPaymentDetail}
                                block
                            >
                                Thêm phương thức
                            </Button>
                        </Form>
                    </Card>

                    {paymentDetails.length > 0 && (
                        <>
                            <Table
                                columns={detailColumns}
                                dataSource={paymentDetails.map((detail, index) => ({ ...detail, key: index }))}
                                pagination={false}
                                className="mb-4"
                            />

                            <div className="bg-blue-50 p-4 rounded mb-4 text-right">
                                <div className="text-lg font-bold">
                                    Tổng tiền chi tiết: <span className="text-green-600">${totalDetailAmount.toFixed(2)}</span>
                                </div>
                                <div className="text-sm text-gray-600">
                                    {totalDetailAmount !== form.getFieldValue('amount') && (
                                        <div className="text-red-600 mt-2">
                                            ⚠️ Tổng tiền chi tiết không khớp với tổng số tiền!
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    )}

                    <Space>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            Tạo thanh toán
                        </Button>
                        <Button onClick={() => navigate('/admin/payments')}>
                            Quay lại
                        </Button>
                    </Space>
                </Form>
            </Card>
        </div>
    );
};

export default PaymentCreatePage;
