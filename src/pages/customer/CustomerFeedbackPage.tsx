import React, { useState, useEffect, useCallback } from 'react';
import {
    Table,
    Button,
    Input,
    DatePicker,
    Select,
    Tag,
    Modal,
    Typography,
    Space,
    Pagination,
    message,
    Card,
    Form,
    Rate,
} from 'antd';
import { EyeOutlined, PlusOutlined, SearchOutlined, StarOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { Feedback } from '../../types/Feedback';
import { useAppSelector } from '../../redux/app/hook';
import dayjs from 'dayjs';
import axios from 'axios';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

interface FeedbackFormData {
    rating: number;
    comment: string;
    orderId?: number;
}

const CustomerFeedbackPage: React.FC = () => {
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [ratingFilter, setRatingFilter] = useState<string>('');
    const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);
    const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
    const [detailModalVisible, setDetailModalVisible] = useState(false);
    const [createModalVisible, setCreateModalVisible] = useState(false);
    const [createForm] = Form.useForm<FeedbackFormData>();

    const user = useAppSelector((state) => state.auth.user);

    // Fetch API
    const fetchFeedbacks = useCallback(async () => {
        if (!user?.id) return;
        setLoading(true);
        try {
            const params: any = {
                userId: user.id,
                page: currentPage,
                pageSize,
            };

            if (searchKeyword) params.search = searchKeyword;
            if (ratingFilter) params.rating = ratingFilter;
            if (dateRange) {
                params.from = dateRange[0].startOf('day').toISOString();
                params.to = dateRange[1].endOf('day').toISOString();
            }

            const { data } = await axios.get('/api/feedbacks', { params });
            setFeedbacks(data.items || []);
            setTotal(data.total || 0);
        } catch (error) {
            console.error(error);
            message.error('Failed to load feedbacks');
        } finally {
            setLoading(false);
        }
    }, [user?.id, currentPage, searchKeyword, ratingFilter, dateRange, pageSize]);

    useEffect(() => {
        fetchFeedbacks();
    }, [fetchFeedbacks]);

    //  Create Feedback
    const handleCreateFeedback = async (values: FeedbackFormData) => {
        if (!user?.id) return;
        try {
            await axios.post('/api/feedbacks', {
                userId: user.id,
                ...values,
            });
            message.success('Feedback submitted successfully');
            setCreateModalVisible(false);
            createForm.resetFields();
            fetchFeedbacks();
        } catch (error) {
            console.error(error);
            message.error('Failed to submit feedback');
        }
    };

    //  Update Feedback (optional if allowed)
    // const handleUpdateFeedback = async (id: number, updatedData: Partial<Feedback>) => {
    //     try {
    //         await axios.put(`/api/feedbacks/${id}`, updatedData);
    //         message.success('Feedback updated successfully');
    //         fetchFeedbacks();
    //     } catch (error) {
    //         console.error(error);
    //         message.error('Failed to update feedback');
    //     }
    // };

    const handleViewDetails = (feedback: Feedback) => {
        setSelectedFeedback(feedback);
        setDetailModalVisible(true);
    };

    const getStatusColor = (isApproved: boolean) => (isApproved ? 'green' : 'orange');
    const getStatusText = (isApproved: boolean) => (isApproved ? 'Approved' : 'Pending');

    const getRatingColor = (rating: number) => {
        if (rating >= 4) return 'green';
        if (rating >= 3) return 'orange';
        return 'red';
    };

    const columns: ColumnsType<Feedback> = [
        {
            title: 'Feedback ID',
            dataIndex: 'id',
            key: 'id',
            width: 120,
            render: (id: number) => `#${id.toString().padStart(4, '0')}`,
        },
        {
            title: 'Order ID',
            dataIndex: 'orderId',
            key: 'orderId',
            width: 100,
            render: (orderId: number) => (orderId ? `#${orderId}` : 'General'),
        },
        {
            title: 'Rating',
            dataIndex: 'rating',
            key: 'rating',
            width: 120,
            render: (rating: number) => (
                <div className="flex items-center space-x-2">
                    <Rate disabled value={rating} style={{ fontSize: 14 }} />
                    <span
                        className={`font-medium ${
                            getRatingColor(rating) === 'green'
                                ? 'text-green-600'
                                : getRatingColor(rating) === 'orange'
                                ? 'text-orange-600'
                                : 'text-red-600'
                        }`}
                    >
                        {rating}/5
                    </span>
                </div>
            ),
            sorter: (a, b) => a.rating - b.rating,
        },
        {
            title: 'Comment',
            dataIndex: 'comment',
            key: 'comment',
            ellipsis: true,
            render: (comment: string) => (
                <div className="max-w-xs truncate" title={comment}>
                    {comment}
                </div>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'isApproved',
            key: 'isApproved',
            width: 100,
            render: (isApproved: boolean) => (
                <Tag color={getStatusColor(isApproved)}>{getStatusText(isApproved)}</Tag>
            ),
        },
        {
            title: 'Submitted',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: 120,
            render: (date: string) => dayjs(date).format('MMM DD, YYYY'),
            sorter: (a, b) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 100,
            render: (_, record) => (
                <Button
                    type="text"
                    icon={<EyeOutlined />}
                    onClick={() => handleViewDetails(record)}
                    title="View Details"
                />
            ),
        },
    ];

    const handleDateRangeChange = (dates: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null) => {
        if (dates && dates[0] && dates[1]) setDateRange([dates[0], dates[1]]);
        else setDateRange(null);
    };

    const averageRating =
        feedbacks.length > 0
            ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1)
            : '0.0';

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <Title level={2}>My Feedback</Title>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setCreateModalVisible(true)}
                >
                    Submit Feedback
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                <Card>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{feedbacks.length}</div>
                        <div className="text-gray-600">Total Feedback</div>
                    </div>
                </Card>
                <Card>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-600 flex items-center justify-center">
                            <StarOutlined className="mr-1" />
                            {averageRating}
                        </div>
                        <div className="text-gray-600">Average Rating</div>
                    </div>
                </Card>
                <Card>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                            {feedbacks.filter((f) => f.isApproved).length}
                        </div>
                        <div className="text-gray-600">Approved</div>
                    </div>
                </Card>
                <Card>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">
                            {feedbacks.filter((f) => !f.isApproved).length}
                        </div>
                        <div className="text-gray-600">Pending</div>
                    </div>
                </Card>
                <Card>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                            {feedbacks.filter((f) => f.reply).length}
                        </div>
                        <div className="text-gray-600">With Reply</div>
                    </div>
                </Card>
            </div>

            {/* Filters */}
            <div className="mb-6 bg-white p-4 rounded-lg shadow">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Input
                        placeholder="Search feedback..."
                        prefix={<SearchOutlined />}
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                        allowClear
                    />

                    <Select
                        placeholder="Filter by rating"
                        value={ratingFilter}
                        onChange={setRatingFilter}
                        allowClear
                        style={{ width: '100%' }}
                    >
                        <Option value="">All Ratings</Option>
                        {[5, 4, 3, 2, 1].map((r) => (
                            <Option key={r} value={r.toString()}>
                                {r} Stars
                            </Option>
                        ))}
                    </Select>

                    <RangePicker
                        value={dateRange}
                        onChange={handleDateRangeChange}
                        style={{ width: '100%' }}
                        placeholder={['Start Date', 'End Date']}
                    />

                    <Button type="primary" onClick={fetchFeedbacks}>
                        Search
                    </Button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow">
                <Table
                    columns={columns}
                    dataSource={feedbacks}
                    loading={loading}
                    rowKey="id"
                    pagination={false}
                    scroll={{ x: 900 }}
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
                            `${range[0]}-${range[1]} of ${total} feedback entries`
                        }
                    />
                </div>
            </div>

            {/* Create Modal */}
            <Modal
                title="Submit New Feedback"
                open={createModalVisible}
                onCancel={() => {
                    setCreateModalVisible(false);
                    createForm.resetFields();
                }}
                footer={null}
                width={600}
            >
                <Form form={createForm} layout="vertical" onFinish={handleCreateFeedback}>
                    <Form.Item
                        label="Order ID (Optional)"
                        name="orderId"
                        help="Leave empty for general feedback"
                    >
                        <Input placeholder="Enter order ID if feedback is for a specific order" />
                    </Form.Item>

                    <Form.Item
                        label="Rating"
                        name="rating"
                        rules={[{ required: true, message: 'Please provide a rating' }]}
                    >
                        <Rate />
                    </Form.Item>

                    <Form.Item
                        label="Comment"
                        name="comment"
                        rules={[
                            { required: true, message: 'Please enter your feedback' },
                            { min: 10, message: 'Comment must be at least 10 characters' },
                        ]}
                    >
                        <Input.TextArea
                            placeholder="Share your experience with us..."
                            rows={5}
                            showCount
                            maxLength={500}
                        />
                    </Form.Item>

                    <Form.Item className="mb-0">
                        <Space className="w-full justify-end">
                            <Button
                                onClick={() => {
                                    setCreateModalVisible(false);
                                    createForm.resetFields();
                                }}
                            >
                                Cancel
                            </Button>
                            <Button type="primary" htmlType="submit">
                                Submit Feedback
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Detail Modal */}
            <Modal
                title={`Feedback Details - #${selectedFeedback?.id
                    ?.toString()
                    .padStart(4, '0')}`}
                open={detailModalVisible}
                onCancel={() => setDetailModalVisible(false)}
                footer={[
                    <Button key="close" type="primary" onClick={() => setDetailModalVisible(false)}>
                        Close
                    </Button>,
                ]}
                width={600}
            >
                {selectedFeedback && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <strong>Order ID:</strong>
                                <div>
                                    {selectedFeedback.orderId
                                        ? `#${selectedFeedback.orderId}`
                                        : 'General Feedback'}
                                </div>
                            </div>
                            <div>
                                <strong>Status:</strong>
                                <div>
                                    <Tag color={getStatusColor(selectedFeedback.isApproved)}>
                                        {getStatusText(selectedFeedback.isApproved)}
                                    </Tag>
                                </div>
                            </div>
                            <div>
                                <strong>Rating:</strong>
                                <div className="flex items-center space-x-2">
                                    <Rate
                                        disabled
                                        value={selectedFeedback.rating}
                                        style={{ fontSize: 16 }}
                                    />
                                    <span className="font-medium text-lg">
                                        {selectedFeedback.rating}/5
                                    </span>
                                </div>
                            </div>
                            <div>
                                <strong>Submitted:</strong>
                                <div>
                                    {dayjs(selectedFeedback.createdAt).format(
                                        'MMM DD, YYYY HH:mm'
                                    )}
                                </div>
                            </div>
                        </div>

                        <div>
                            <strong>Comment:</strong>
                            <div className="bg-gray-50 p-4 rounded mt-2">
                                <Text>{selectedFeedback.comment}</Text>
                            </div>
                        </div>

                        {selectedFeedback.reply && (
                            <div>
                                <strong>Restaurant Response:</strong>
                                <div className="bg-blue-50 p-4 rounded mt-2 border-l-4 border-blue-500">
                                    <Text>{selectedFeedback.reply}</Text>
                                    {selectedFeedback.repliedAt && (
                                        <div className="text-sm text-gray-500 mt-2">
                                            Responded on{' '}
                                            {dayjs(selectedFeedback.repliedAt).format(
                                                'MMM DD, YYYY HH:mm'
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default CustomerFeedbackPage;
