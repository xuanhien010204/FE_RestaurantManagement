import React, { useState, useEffect } from 'react';
import {
    Card,
    Table,
    Button,
    Modal,
    Form,
    DatePicker,
    TimePicker,
    InputNumber,
    Select,
    Input,
    message,
    Tag,
    Space,
    Typography,
    Descriptions,
} from 'antd';
import {
    PlusOutlined,
    EyeOutlined,
    CloseCircleOutlined,
    CalendarOutlined,
    UserOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useAppSelector } from '../../redux/app/hook';
import * as tableService from '../../services/restaurant-table.service';
import type { Reservation } from '../../types/Reservation';
import type { RestaurantTable } from '../../types/RestaurantTable';
import dayjs, { Dayjs } from 'dayjs';

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface ReservationFormData {
    reservationDate: Dayjs;
    reservationTime: Dayjs;
    numberOfGuests: number;
    tableId?: number;
    specialRequests?: string;
}

const CustomerReservationPage: React.FC = () => {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [tables, setTables] = useState<RestaurantTable[]>([]);
    const [loading, setLoading] = useState(false);
    const [createModalVisible, setCreateModalVisible] = useState(false);
    const [detailModalVisible, setDetailModalVisible] = useState(false);
    const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
    const [form] = Form.useForm<ReservationFormData>();

    const user = useAppSelector(state => state.auth.user);

    // Load reservations and tables
    useEffect(() => {
        const initData = async () => {
            await loadReservations();
            await loadTables();
        };
        initData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const loadReservations = async () => {
        setLoading(true);
        try {
            // Mock data - replace with actual API call
            const mockReservations: Reservation[] = [
                {
                    id: 1,
                    userId: user?.id || 1,
                    tableId: 1,
                    reservationTime: dayjs().add(2, 'days').hour(19).minute(0).toISOString(),
                    numberOfGuests: 4,
                    status: 'Confirmed',
                },
                {
                    id: 2,
                    userId: user?.id || 1,
                    tableId: 3,
                    reservationTime: dayjs().add(5, 'days').hour(20).minute(30).toISOString(),
                    numberOfGuests: 2,
                    status: 'Pending',
                },
            ];
            setReservations(mockReservations);
        } catch (error) {
            console.error('[CustomerReservationPage] Error loading reservations:', error);
            message.error('Không thể tải danh sách đặt bàn');
        } finally {
            setLoading(false);
        }
    };

    const loadTables = async () => {
        try {
            const allTables = await tableService.getAllTables();
            // Filter available tables
            const availableTables = allTables.filter(t => t.status === 'Available');
            setTables(availableTables);
        } catch (error) {
            console.error('[CustomerReservationPage] Error loading tables:', error);
        }
    };

    const handleCreateReservation = () => {
        form.resetFields();
        setCreateModalVisible(true);
    };

    const handleSubmitReservation = async (values: ReservationFormData) => {
        try {
            console.log('[CustomerReservationPage] Creating reservation:', values);

            // Combine date and time
            const reservationDateTime = values.reservationDate
                .hour(values.reservationTime.hour())
                .minute(values.reservationTime.minute());

            // Mock create - replace with actual API call
            const newReservation: Reservation = {
                id: Date.now(),
                userId: user?.id || 1,
                tableId: values.tableId || tables[0]?.id || 1,
                reservationTime: reservationDateTime.toISOString(),
                numberOfGuests: values.numberOfGuests,
                status: 'Pending',
            };

            setReservations([newReservation, ...reservations]);
            message.success('Đặt bàn thành công! Chờ xác nhận.');
            setCreateModalVisible(false);

            // If tableId is provided, reserve the table
            if (values.tableId) {
                await tableService.reserveTable(values.tableId);
                await loadTables(); // Reload tables
            }
        } catch (error) {
            console.error('[CustomerReservationPage] Error creating reservation:', error);
            message.error('Không thể đặt bàn. Vui lòng thử lại.');
        }
    };

    const handleViewDetails = (reservation: Reservation) => {
        setSelectedReservation(reservation);
        setDetailModalVisible(true);
    };

    const handleCancelReservation = async (reservationId: number) => {
        try {
            console.log('[CustomerReservationPage] Cancelling reservation:', reservationId);

            // Update local state
            setReservations(
                reservations.map(r =>
                    r.id === reservationId ? { ...r, status: 'Cancelled' as const } : r
                )
            );

            // Cancel table reservation if needed
            const reservation = reservations.find(r => r.id === reservationId);
            if (reservation?.tableId) {
                await tableService.cancelTableReservation(reservation.tableId);
                await loadTables(); // Reload tables
            }

            message.success('Hủy đặt bàn thành công');
        } catch (error) {
            console.error('[CustomerReservationPage] Error cancelling reservation:', error);
            message.error('Không thể hủy đặt bàn');
        }
    };

    // Disable past dates
    const disabledDate = (current: Dayjs) => {
        return current && current < dayjs().startOf('day');
    };

    // Disable past hours for today
    const disabledHours = () => {
        const hours = [];
        if (form.getFieldValue('reservationDate')?.isSame(dayjs(), 'day')) {
            for (let i = 0; i < dayjs().hour(); i++) {
                hours.push(i);
            }
        }
        return hours;
    };

    const columns: ColumnsType<Reservation> = [
        {
            title: 'Mã đặt bàn',
            dataIndex: 'id',
            key: 'id',
            width: 100,
            render: (id: number) => `#${id}`,
        },
        {
            title: 'Bàn số',
            dataIndex: 'tableId',
            key: 'tableId',
            render: (tableId: number) => `Bàn ${tableId}`,
        },
        {
            title: 'Thời gian',
            dataIndex: 'reservationTime',
            key: 'reservationTime',
            render: (time: string) => (
                <Space direction="vertical" size={0}>
                    <span>{dayjs(time).format('DD/MM/YYYY')}</span>
                    <span className="text-gray-500">{dayjs(time).format('HH:mm')}</span>
                </Space>
            ),
        },
        {
            title: 'Số khách',
            dataIndex: 'numberOfGuests',
            key: 'numberOfGuests',
            render: (guests: number) => (
                <Space>
                    <UserOutlined />
                    {guests} người
                </Space>
            ),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status: Reservation['status']) => {
                const colorMap = {
                    Pending: 'orange',
                    Confirmed: 'green',
                    Cancelled: 'red',
                };
                const textMap = {
                    Pending: 'Chờ xác nhận',
                    Confirmed: 'Đã xác nhận',
                    Cancelled: 'Đã hủy',
                };
                return <Tag color={colorMap[status]}>{textMap[status]}</Tag>;
            },
        },
        {
            title: 'Hành động',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button
                        type="text"
                        icon={<EyeOutlined />}
                        onClick={() => handleViewDetails(record)}
                        size="small"
                    >
                        Chi tiết
                    </Button>
                    {record.status === 'Pending' && (
                        <Button
                            type="text"
                            danger
                            icon={<CloseCircleOutlined />}
                            onClick={() => handleCancelReservation(record.id)}
                            size="small"
                        >
                            Hủy
                        </Button>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <div className="p-6">
            <Card
                title={
                    <Space>
                        <CalendarOutlined />
                        <Title level={4} style={{ margin: 0 }}>
                            Quản lý đặt bàn
                        </Title>
                    </Space>
                }
                extra={
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleCreateReservation}
                    >
                        Đặt bàn mới
                    </Button>
                }
            >
                <Table
                    columns={columns}
                    dataSource={reservations}
                    loading={loading}
                    rowKey="id"
                    pagination={{
                        pageSize: 10,
                        showTotal: (total) => `Tổng ${total} đặt bàn`,
                    }}
                />
            </Card>

            {/* Create Reservation Modal */}
            <Modal
                title="Đặt bàn mới"
                open={createModalVisible}
                onCancel={() => setCreateModalVisible(false)}
                footer={null}
                width={600}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmitReservation}
                >
                    <Form.Item
                        name="reservationDate"
                        label="Ngày đặt"
                        rules={[{ required: true, message: 'Vui lòng chọn ngày' }]}
                    >
                        <DatePicker
                            style={{ width: '100%' }}
                            format="DD/MM/YYYY"
                            disabledDate={disabledDate}
                            placeholder="Chọn ngày"
                        />
                    </Form.Item>

                    <Form.Item
                        name="reservationTime"
                        label="Giờ đặt"
                        rules={[{ required: true, message: 'Vui lòng chọn giờ' }]}
                    >
                        <TimePicker
                            style={{ width: '100%' }}
                            format="HH:mm"
                            disabledHours={disabledHours}
                            minuteStep={30}
                            placeholder="Chọn giờ"
                        />
                    </Form.Item>

                    <Form.Item
                        name="numberOfGuests"
                        label="Số lượng khách"
                        rules={[
                            { required: true, message: 'Vui lòng nhập số lượng khách' },
                            { type: 'number', min: 1, max: 20, message: 'Số khách từ 1-20' },
                        ]}
                    >
                        <InputNumber
                            style={{ width: '100%' }}
                            placeholder="Nhập số lượng khách"
                            min={1}
                            max={20}
                        />
                    </Form.Item>

                    <Form.Item name="tableId" label="Chọn bàn (tùy chọn)">
                        <Select placeholder="Chọn bàn trống" allowClear>
                            {tables.map(table => (
                                <Option key={table.id} value={table.id}>
                                    Bàn {table.tableNumber} - {table.seats} chỗ - {table.location}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item name="specialRequests" label="Yêu cầu đặc biệt">
                        <TextArea
                            rows={3}
                            placeholder="Ghi chú yêu cầu đặc biệt (nếu có)"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Space>
                            <Button type="primary" htmlType="submit">
                                Đặt bàn
                            </Button>
                            <Button onClick={() => setCreateModalVisible(false)}>
                                Hủy
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Detail Modal */}
            <Modal
                title="Chi tiết đặt bàn"
                open={detailModalVisible}
                onCancel={() => setDetailModalVisible(false)}
                footer={null}
                width={600}
            >
                {selectedReservation && (
                    <Descriptions bordered column={1}>
                        <Descriptions.Item label="Mã đặt bàn">
                            #{selectedReservation.id}
                        </Descriptions.Item>
                        <Descriptions.Item label="Bàn số">
                            Bàn {selectedReservation.tableId}
                        </Descriptions.Item>
                        <Descriptions.Item label="Ngày đặt">
                            {dayjs(selectedReservation.reservationTime).format('DD/MM/YYYY')}
                        </Descriptions.Item>
                        <Descriptions.Item label="Giờ đặt">
                            {dayjs(selectedReservation.reservationTime).format('HH:mm')}
                        </Descriptions.Item>
                        <Descriptions.Item label="Số lượng khách">
                            {selectedReservation.numberOfGuests} người
                        </Descriptions.Item>
                        <Descriptions.Item label="Trạng thái">
                            <Tag
                                color={
                                    selectedReservation.status === 'Confirmed'
                                        ? 'green'
                                        : selectedReservation.status === 'Pending'
                                        ? 'orange'
                                        : 'red'
                                }
                            >
                                {selectedReservation.status === 'Confirmed'
                                    ? 'Đã xác nhận'
                                    : selectedReservation.status === 'Pending'
                                    ? 'Chờ xác nhận'
                                    : 'Đã hủy'}
                            </Tag>
                        </Descriptions.Item>
                    </Descriptions>
                )}
            </Modal>
        </div>
    );
};

export default CustomerReservationPage;