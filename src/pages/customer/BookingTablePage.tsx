import React, { useEffect, useState } from "react";
import { DatePicker, TimePicker, Select, Button, message, Empty, Alert, Card } from "antd";
import { TableOutlined, CalendarOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { useAppSelector } from "../../redux/app/hook";
import { useNavigate } from "react-router-dom";
import dayjs, { Dayjs } from "dayjs";

import * as tableService from "../../services/restaurant-table.service";
import type { RestaurantTable } from "../../types/RestaurantTable";

const { Option } = Select;

const BookingTablePage: React.FC = () => {
    const [tables, setTables] = useState<RestaurantTable[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [selectedTable, setSelectedTable] = useState<number | null>(null);
    const [date, setDate] = useState<Dayjs | null>(null);
    const [time, setTime] = useState<Dayjs | null>(null);

    const authState = useAppSelector(state => state.auth);
    const { user, token } = authState;
    const isAuthenticated = !!token && !!user;

    const navigate = useNavigate();

    // Lấy bàn trống từ API
    useEffect(() => {
        const fetchTables = async () => {
            setLoading(true);
            try {
                if (!isAuthenticated) {
                    message.warning("Bạn cần đăng nhập để xem bàn trống");
                    setTables([]);
                    return;
                }

                const allTables = await tableService.getAllTablesAvailable(); // API /available
                console.log('Available tables:', allTables);
                setTables(allTables);

                if (allTables.length === 0) {
                    message.info("Hiện tại không có bàn trống. Vui lòng quay lại sau!");
                }
            } catch (err) {
                console.error('Error fetching tables:', err);
                message.error("Không thể tải danh sách bàn");
            } finally {
                setLoading(false);
            }
        };
        fetchTables();
    }, [isAuthenticated]);

    // Đặt bàn
    const handleSubmit = async () => {
        if (!isAuthenticated) {
            message.warning("Bạn cần đăng nhập để đặt bàn!");
            navigate("/login");
            return;
        }

        if (!selectedTable || !date || !time) {
            message.warning("Vui lòng chọn đầy đủ bàn, ngày và giờ!");
            return;
        }

        try {
            setSubmitting(true);
            await tableService.reserveTable(selectedTable); // gửi token vào API
            message.success(`Đặt bàn thành công! Thời gian: ${date.format('DD/MM/YYYY')} lúc ${time.format('HH:mm')}`);

            // Xóa bàn vừa đặt khỏi danh sách
            setTables(prev => prev.filter(t => t.id !== selectedTable));

            setSelectedTable(null);
            setDate(null);
            setTime(null);
        } catch (err) {
            console.error('Error reserving table:', err);
            message.error("Đặt bàn thất bại. Vui lòng thử lại.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6 mt-10">
            <Card
                title={
                    <div className="flex items-center text-xl">
                        <TableOutlined className="mr-2" />
                        <span>Đặt Bàn Nhà Hàng</span>
                    </div>
                }
                loading={loading}
            >
                {!isAuthenticated ? (
                    <Alert
                        message="Yêu cầu đăng nhập"
                        description="Bạn cần đăng nhập để đặt bàn. Vui lòng đăng nhập trước."
                        type="warning"
                        showIcon
                        action={
                            <Button type="primary" onClick={() => navigate('/login')}>
                                Đăng nhập
                            </Button>
                        }
                    />
                ) : tables.length === 0 && !loading ? (
                    <Empty
                        description="Hiện tại không có bàn trống"
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                    >
                        <Button type="primary" onClick={() => window.location.reload()}>
                            Tải lại
                        </Button>
                    </Empty>
                ) : (
                    <>
                        {/* Info Alert */}
                        <Alert
                            message="Thông tin đặt bàn"
                            description={`Hiện có ${tables.length} bàn trống. Vui lòng chọn bàn, ngày và giờ để đặt bàn.`}
                            type="info"
                            showIcon
                            className="mb-4"
                        />

                        {/* Chọn bàn */}
                        <div className="mb-4">
                            <label className="mb-2 font-semibold flex items-center">
                                <TableOutlined className="mr-2" />
                                Chọn bàn trống
                            </label>
                            <Select
                                placeholder="Chọn bàn"
                                className="w-full"
                                value={selectedTable}
                                onChange={(val: number) => setSelectedTable(val)}
                                allowClear
                                size="large"
                            >
                                {tables.map(table => (
                                    <Option key={table.id} value={table.id}>
                                        Bàn {table.tableNumber} - {table.seats} chỗ ngồi
                                        {table.location && ` - ${table.location}`}
                                    </Option>
                                ))}
                            </Select>
                        </div>

                        {/* Chọn ngày */}
                        <div className="mb-4">
                            <label className="mb-2 font-semibold flex items-center">
                                <CalendarOutlined className="mr-2" />
                                Ngày đặt
                            </label>
                            <DatePicker
                                className="w-full"
                                value={date}
                                onChange={setDate}
                                disabledDate={current => current && current < dayjs().startOf("day")}
                                format="DD/MM/YYYY"
                                placeholder="Chọn ngày"
                                size="large"
                            />
                        </div>

                        {/* Chọn giờ */}
                        <div className="mb-6">
                            <label className="mb-2 font-semibold flex items-center">
                                <ClockCircleOutlined className="mr-2" />
                                Thời gian
                            </label>
                            <TimePicker
                                className="w-full"
                                value={time}
                                onChange={setTime}
                                format="HH:mm"
                                placeholder="Chọn giờ"
                                allowClear
                                size="large"
                                minuteStep={15}
                            />
                        </div>

                        <Button
                            type="primary"
                            onClick={handleSubmit}
                            disabled={submitting || tables.length === 0 || !selectedTable || !date || !time}
                            loading={submitting}
                            className="w-full"
                            size="large"
                        >
                            {submitting ? 'Đang đặt bàn...' : 'Xác nhận đặt bàn'}
                        </Button>
                    </>
                )}
            </Card>
        </div>
    );
};

export default BookingTablePage;
