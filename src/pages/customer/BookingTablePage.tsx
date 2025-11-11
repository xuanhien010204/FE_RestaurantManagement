import React, { useEffect, useState } from "react";
import { DatePicker, TimePicker, Select, Button, message, Spin } from "antd";
import { useAppSelector } from "../../redux/app/hook";
import { useNavigate } from "react-router-dom";
import dayjs, { Dayjs } from "dayjs";

import * as tableService from "../../services/restaurant-table.service";
import type { RestaurantTable } from "../../types/RestaurantTable";

const { Option } = Select;

const BookingTablePage: React.FC = () => {
    const [tables, setTables] = useState<RestaurantTable[]>([]);
    const [loading, setLoading] = useState(false);
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
                setTables(allTables);
            } catch (err) {
                console.error(err);
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
            message.warning("Vui lòng chọn bàn, ngày và giờ!");
            return;
        }

        try {
            setLoading(true);
            await tableService.reserveTable(selectedTable); // gửi token vào API
            message.success("Đặt bàn thành công!");

            // Xóa bàn vừa đặt khỏi danh sách
            setTables(prev => prev.filter(t => t.id !== selectedTable));

            setSelectedTable(null);
            setDate(null);
            setTime(null);
        } catch (err) {
            console.error(err);
            message.error("Đặt bàn thất bại. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="text-center py-12">
                <Spin tip="Đang tải..." />
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto p-6 mt-10 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Đặt Bàn</h2>

            {/* Chọn bàn */}
            <div className="mb-4">
                <label className="block mb-1 font-semibold">Chọn bàn trống</label>
                <Select
                    placeholder="Chọn bàn"
                    className="w-full"
                    value={selectedTable}
                    onChange={(val: number) => setSelectedTable(val)}
                    allowClear
                >
                    {tables.map(table => (
                        <Option key={table.id} value={table.id}>
                            Bàn {table.tableNumber} - {table.seats} chỗ - {table.location}
                        </Option>
                    ))}
                </Select>
            </div>

            {/* Chọn ngày */}
            <div className="mb-4">
                <label className="block mb-1 font-semibold">Ngày đặt</label>
                <DatePicker
                    className="w-full"
                    value={date}
                    onChange={setDate}
                    disabledDate={current => current && current < dayjs().startOf("day")}
                />
            </div>

            {/* Chọn giờ */}
            <div className="mb-4">
                <label className="block mb-1 font-semibold">Thời gian</label>
                <TimePicker
                    className="w-full"
                    value={time}
                    onChange={setTime}
                    format="HH:mm"
                    allowClear
                />
            </div>

            <Button
                type="primary"
                onClick={handleSubmit}
                disabled={loading || tables.length === 0}
                className="w-full"
            >
                Đặt Bàn
            </Button>
        </div>
    );
};

export default BookingTablePage;
