import React, { useState, useEffect } from 'react';
import { Table, Button, Card, Space, Tag, Modal, Form, Input, Rate, message, Avatar } from 'antd';
import { EyeOutlined, MessageOutlined, StarFilled, UserOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { Feedback } from '../../types/Feedback';
import * as feedbackService from '../../services/feedback.service';
import dayjs from 'dayjs';

const { TextArea } = Input;

const FeedbackManagementPage: React.FC = () => {
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
    const [isReplyModalVisible, setIsReplyModalVisible] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        loadFeedbacks();
    }, []);

    const loadFeedbacks = async () => {
        setLoading(true);
        try {
            const feedbackList = await feedbackService.getAllFeedbacks();
            setFeedbacks(feedbackList);
        } catch {
            message.error('Không thể tải danh sách đánh giá');
        } finally {
            setLoading(false);
        }
    };

    const handleViewFeedback = (feedback: Feedback) => {
        setSelectedFeedback(feedback);
        setIsModalVisible(true);
    };

    const handleReply = (feedback: Feedback) => {
        setSelectedFeedback(feedback);
        form.setFieldsValue({
            reply: feedback.reply || '',
        });
        setIsReplyModalVisible(true);
    };

    const handleSubmitReply = async (values: { reply: string }) => {
        if (!selectedFeedback) return;

        try {
            await feedbackService.updateFeedback(selectedFeedback.id, {
                id: selectedFeedback.id,
                reply: values.reply,
                repliedAt: new Date().toISOString(),
            });
            message.success('Phản hồi thành công');
            setIsReplyModalVisible(false);
            loadFeedbacks();
        } catch {
            message.error('Không thể gửi phản hồi');
        }
    };

    const getApprovalColor = (isApproved: boolean) => {
        return isApproved ? 'green' : 'orange';
    };

    const getApprovalText = (isApproved: boolean) => {
        return isApproved ? 'Đã duyệt' : 'Chờ duyệt';
    };

    const columns: ColumnsType<Feedback> = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 70,
        },
        {
            title: 'Khách hàng',
            key: 'customer',
            render: (_, record) => (
                <Space>
                    <Avatar icon={<UserOutlined />} size="small" />
                    <div>
                        <div className="font-medium">
                            {record.user?.fullName || `Khách hàng #${record.userId}`}
                        </div>
                        <div className="text-gray-500 text-xs">
                            {record.user?.email}
                        </div>
                    </div>
                </Space>
            ),
        },
        {
            title: 'Đánh giá',
            dataIndex: 'rating',
            key: 'rating',
            render: (rating: number) => (
                <Space>
                    <Rate disabled defaultValue={rating} style={{ fontSize: 14 }} />
                    <span className="text-yellow-600">
                        <StarFilled /> {rating}/5
                    </span>
                </Space>
            ),
            sorter: (a, b) => a.rating - b.rating,
        },
        {
            title: 'Bình luận',
            dataIndex: 'comment',
            key: 'comment',
            ellipsis: true,
            render: (comment: string) => comment || 'Không có bình luận',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'isApproved',
            key: 'isApproved',
            render: (isApproved: boolean) => (
                <Tag color={getApprovalColor(isApproved)}>
                    {getApprovalText(isApproved)}
                </Tag>
            ),
            filters: [
                { text: 'Đã duyệt', value: true },
                { text: 'Chờ duyệt', value: false },
            ],
            onFilter: (value, record) => record.isApproved === value,
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date: string) => dayjs(date).format('DD/MM/YYYY HH:mm'),
            sorter: (a, b) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
        },
        {
            title: 'Phản hồi',
            key: 'reply',
            render: (_, record) => (
                <Space>
                    {record.reply ? (
                        <Tag color="blue">Đã phản hồi</Tag>
                    ) : (
                        <Tag color="gray">Chưa phản hồi</Tag>
                    )}
                </Space>
            ),
        },
        {
            title: 'Hành động',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button
                        type="text"
                        icon={<EyeOutlined />}
                        onClick={() => handleViewFeedback(record)}
                        size="small"
                    >
                        Xem
                    </Button>
                    <Button
                        type="text"
                        icon={<MessageOutlined />}
                        onClick={() => handleReply(record)}
                        size="small"
                        className="text-blue-600"
                    >
                        Phản hồi
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div className="p-6">
            <Card title="Quản lý đánh giá khách hàng" className="mb-6">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex gap-4">
                        <div className="text-gray-600">
                            Tổng: <span className="font-bold">{feedbacks.length}</span> đánh giá
                        </div>
                        <div className="text-gray-600">
                            Đã duyệt: <span className="font-bold text-green-600">
                                {feedbacks.filter(f => f.isApproved).length}
                            </span>
                        </div>
                        <div className="text-gray-600">
                            Chờ duyệt: <span className="font-bold text-orange-600">
                                {feedbacks.filter(f => !f.isApproved).length}
                            </span>
                        </div>
                    </div>
                    <Button type="primary" onClick={loadFeedbacks}>
                        Làm mới
                    </Button>
                </div>

                <Table
                    columns={columns}
                    dataSource={feedbacks}
                    loading={loading}
                    rowKey="id"
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total) => `Tổng ${total} đánh giá`,
                    }}
                />
            </Card>

            {/* View Feedback Modal */}
            <Modal
                title="Chi tiết đánh giá"
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={[
                    <Button key="close" onClick={() => setIsModalVisible(false)}>
                        Đóng
                    </Button>
                ]}
                width={600}
            >
                {selectedFeedback && (
                    <div className="space-y-4">
                        <div className="border-b pb-4">
                            <div className="flex items-center space-x-3 mb-2">
                                <Avatar icon={<UserOutlined />} />
                                <div>
                                    <div className="font-medium">
                                        {selectedFeedback.user?.fullName || `Khách hàng #${selectedFeedback.userId}`}
                                    </div>
                                    <div className="text-gray-500 text-sm">
                                        {dayjs(selectedFeedback.createdAt).format('DD/MM/YYYY HH:mm:ss')}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2 mb-2">
                                <Rate disabled defaultValue={selectedFeedback.rating} />
                                <span className="text-yellow-600 font-medium">
                                    {selectedFeedback.rating}/5 sao
                                </span>
                            </div>
                        </div>

                        <div>
                            <div className="font-medium mb-2">Bình luận:</div>
                            <div className="bg-gray-50 p-3 rounded">
                                {selectedFeedback.comment || 'Không có bình luận'}
                            </div>
                        </div>

                        {selectedFeedback.reply && (
                            <div>
                                <div className="font-medium mb-2">Phản hồi từ nhà hàng:</div>
                                <div className="bg-blue-50 p-3 rounded border-l-4 border-blue-400">
                                    {selectedFeedback.reply}
                                </div>
                                {selectedFeedback.repliedAt && (
                                    <div className="text-gray-500 text-sm mt-1">
                                        Phản hồi lúc: {dayjs(selectedFeedback.repliedAt).format('DD/MM/YYYY HH:mm:ss')}
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="flex items-center space-x-2">
                            <span>Trạng thái:</span>
                            <Tag color={getApprovalColor(selectedFeedback.isApproved)}>
                                {getApprovalText(selectedFeedback.isApproved)}
                            </Tag>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Reply Modal */}
            <Modal
                title="Phản hồi đánh giá"
                open={isReplyModalVisible}
                onCancel={() => setIsReplyModalVisible(false)}
                footer={null}
                width={500}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmitReply}
                >
                    <Form.Item
                        name="reply"
                        label="Nội dung phản hồi"
                        rules={[{ required: true, message: 'Vui lòng nhập nội dung phản hồi' }]}
                    >
                        <TextArea
                            rows={4}
                            placeholder="Nhập phản hồi của bạn..."
                        />
                    </Form.Item>

                    <Form.Item className="mb-0">
                        <Space>
                            <Button type="primary" htmlType="submit">
                                Gửi phản hồi
                            </Button>
                            <Button onClick={() => setIsReplyModalVisible(false)}>
                                Hủy
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default FeedbackManagementPage;